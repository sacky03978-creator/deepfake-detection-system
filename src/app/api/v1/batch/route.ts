import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { organizations, detectionJobs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

interface FileInput {
  content_type: string;
  file_url: string;
  metadata?: Record<string, any>;
}

interface RequestBody {
  files: FileInput[];
}

export async function POST(request: NextRequest) {
  try {
    // Authentication: Validate API key from header
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required', code: 'MISSING_API_KEY' },
        { status: 401 }
      );
    }

    // Look up organization by API key
    const organization = await db
      .select()
      .from(organizations)
      .where(eq(organizations.apiKey, apiKey))
      .limit(1);

    if (organization.length === 0) {
      return NextResponse.json(
        { error: 'Invalid API key', code: 'INVALID_API_KEY' },
        { status: 401 }
      );
    }

    const org = organization[0];

    // Parse and validate request body
    const body: RequestBody = await request.json();

    // Validate files field exists
    if (!body.files) {
      return NextResponse.json(
        { error: 'files array is required', code: 'MISSING_FILES' },
        { status: 400 }
      );
    }

    // Validate files is an array
    if (!Array.isArray(body.files)) {
      return NextResponse.json(
        { error: 'files must be an array', code: 'INVALID_FILES_FORMAT' },
        { status: 400 }
      );
    }

    // Validate array is not empty
    if (body.files.length === 0) {
      return NextResponse.json(
        { error: 'files array cannot be empty', code: 'EMPTY_FILES_ARRAY' },
        { status: 400 }
      );
    }

    // Validate batch size limit
    if (body.files.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 files per batch', code: 'BATCH_SIZE_EXCEEDED' },
        { status: 400 }
      );
    }

    // Validate each file in the array
    const validContentTypes = ['video', 'image', 'audio'];
    
    for (let i = 0; i < body.files.length; i++) {
      const file = body.files[i];

      // Validate content_type
      if (!file.content_type) {
        return NextResponse.json(
          { error: `Invalid file at index ${i}: content_type is required`, code: 'INVALID_FILE' },
          { status: 400 }
        );
      }

      if (!validContentTypes.includes(file.content_type)) {
        return NextResponse.json(
          { error: `Invalid file at index ${i}: content_type must be 'video', 'image', or 'audio'`, code: 'INVALID_FILE' },
          { status: 400 }
        );
      }

      // Validate file_url
      if (!file.file_url) {
        return NextResponse.json(
          { error: `Invalid file at index ${i}: file_url is required`, code: 'INVALID_FILE' },
          { status: 400 }
        );
      }

      if (typeof file.file_url !== 'string') {
        return NextResponse.json(
          { error: `Invalid file at index ${i}: file_url must be a string`, code: 'INVALID_FILE' },
          { status: 400 }
        );
      }

      // Validate URL format
      try {
        new URL(file.file_url);
      } catch (error) {
        return NextResponse.json(
          { error: `Invalid file at index ${i}: file_url must be a valid URL`, code: 'INVALID_FILE' },
          { status: 400 }
        );
      }
    }

    // Quota check
    const requiredQuota = body.files.length;
    const quotaAfterRequest = org.quotaUsed + requiredQuota;

    if (quotaAfterRequest > org.quotaLimit) {
      return NextResponse.json(
        {
          error: 'Batch would exceed quota limit',
          code: 'QUOTA_EXCEEDED',
          quota_used: org.quotaUsed,
          quota_limit: org.quotaLimit,
          requested: requiredQuota
        },
        { status: 403 }
      );
    }

    // Generate batch ID
    const batchId = uuidv4();
    const jobIds: string[] = [];
    const currentTimestamp = new Date().toISOString();

    // Create detection jobs for each file
    for (const file of body.files) {
      const jobId = uuidv4();
      const fileSizeBytes = 1024000; // Mock file size

      // Prepare metadata with batch_id
      const metadata = {
        ...(file.metadata || {}),
        batch_id: batchId
      };

      // Insert detection job
      await db.insert(detectionJobs).values({
        jobId,
        organizationId: org.id,
        status: 'pending',
        contentType: file.content_type,
        fileUrl: file.file_url,
        fileSizeBytes,
        tierReached: null,
        confidenceScore: null,
        prediction: null,
        processingTimeMs: null,
        errorMessage: null,
        metadata,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
      });

      jobIds.push(jobId);
    }

    // Update organization quota usage
    await db
      .update(organizations)
      .set({
        quotaUsed: quotaAfterRequest,
        updatedAt: currentTimestamp
      })
      .where(eq(organizations.id, org.id));

    // Return success response
    return NextResponse.json(
      {
        batch_id: batchId,
        job_ids: jobIds,
        total_count: jobIds.length
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}