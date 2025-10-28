import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { organizations, detectionJobs, feedback } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Authentication - Require x-api-key header
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required', code: 'MISSING_API_KEY' },
        { status: 401 }
      );
    }

    // Look up organization by API key
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.apiKey, apiKey))
      .limit(1);

    if (org.length === 0) {
      return NextResponse.json(
        { error: 'Invalid API key', code: 'INVALID_API_KEY' },
        { status: 401 }
      );
    }

    const organization = org[0];

    // Parse request body
    const body = await request.json();
    const { job_id, feedback_type, true_label, comments } = body;

    // Validate job_id
    if (!job_id) {
      return NextResponse.json(
        { error: 'job_id is required', code: 'MISSING_JOB_ID' },
        { status: 400 }
      );
    }

    // Validate feedback_type
    if (!feedback_type) {
      return NextResponse.json(
        { error: 'feedback_type is required', code: 'MISSING_FEEDBACK_TYPE' },
        { status: 400 }
      );
    }

    if (!['correct', 'incorrect', 'uncertain'].includes(feedback_type)) {
      return NextResponse.json(
        { error: 'feedback_type must be correct, incorrect, or uncertain', code: 'INVALID_FEEDBACK_TYPE' },
        { status: 400 }
      );
    }

    // Validate true_label
    if (!true_label) {
      return NextResponse.json(
        { error: 'true_label is required', code: 'MISSING_TRUE_LABEL' },
        { status: 400 }
      );
    }

    if (!['authentic', 'deepfake'].includes(true_label)) {
      return NextResponse.json(
        { error: 'true_label must be authentic or deepfake', code: 'INVALID_TRUE_LABEL' },
        { status: 400 }
      );
    }

    // Query detectionJobs by jobId (text field)
    const job = await db
      .select()
      .from(detectionJobs)
      .where(eq(detectionJobs.jobId, job_id))
      .limit(1);

    // Check if job exists
    if (job.length === 0) {
      return NextResponse.json(
        { error: 'Job not found', code: 'JOB_NOT_FOUND' },
        { status: 404 }
      );
    }

    const detectionJob = job[0];

    // Verify job belongs to authenticated organization
    if (detectionJob.organizationId !== organization.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to job', code: 'UNAUTHORIZED_JOB_ACCESS' },
        { status: 403 }
      );
    }

    // Insert feedback record
    const newFeedback = await db
      .insert(feedback)
      .values({
        jobId: detectionJob.id,
        organizationId: organization.id,
        feedbackType: feedback_type,
        trueLabel: true_label,
        comments: comments || null,
        createdAt: new Date().toISOString(),
      })
      .returning();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        feedback_id: newFeedback[0].id,
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