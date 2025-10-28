import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { organizations, detectionJobs } from '@/db/schema';
import { eq, like, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { batch_id: string } }
) {
  try {
    // Extract API key from headers
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Invalid API key', code: 'INVALID_API_KEY' },
        { status: 401 }
      );
    }

    // Authenticate organization
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

    // Validate batch_id parameter
    const batch_id = params.batch_id;
    
    if (!batch_id) {
      return NextResponse.json(
        { error: 'batch_id is required', code: 'MISSING_BATCH_ID' },
        { status: 400 }
      );
    }

    // Query detection jobs by batch_id in metadata and organization
    const jobs = await db
      .select()
      .from(detectionJobs)
      .where(
        and(
          eq(detectionJobs.organizationId, org.id),
          like(detectionJobs.metadata, `%"batch_id":"${batch_id}"%`)
        )
      );

    // Return 404 if no jobs found
    if (jobs.length === 0) {
      return NextResponse.json(
        { error: 'Batch not found', code: 'BATCH_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Count jobs by status
    let completedCount = 0;
    let pendingCount = 0;
    let processingCount = 0;
    let failedCount = 0;

    jobs.forEach(job => {
      switch (job.status) {
        case 'completed':
          completedCount++;
          break;
        case 'pending':
          pendingCount++;
          break;
        case 'processing':
          processingCount++;
          break;
        case 'failed':
          failedCount++;
          break;
      }
    });

    // Build results array
    const results = jobs.map(job => ({
      job_id: job.jobId,
      status: job.status,
      content_type: job.contentType,
      file_url: job.fileUrl,
      confidence_score: job.confidenceScore,
      prediction: job.prediction,
      processing_time_ms: job.processingTimeMs,
      created_at: job.createdAt,
      updated_at: job.updatedAt
    }));

    // Return success response
    return NextResponse.json({
      batch_id,
      total: jobs.length,
      completed: completedCount,
      pending: pendingCount,
      processing: processingCount,
      failed: failedCount,
      results
    }, { status: 200 });

  } catch (error) {
    console.error('GET batch detection results error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}