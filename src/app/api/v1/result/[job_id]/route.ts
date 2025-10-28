import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { organizations, detectionJobs, detectionResults } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { job_id: string } }
) {
  try {
    // Extract API key from header
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required', code: 'MISSING_API_KEY' },
        { status: 401 }
      );
    }

    // Authenticate organization
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

    // Validate job_id parameter
    const jobId = params.job_id;
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'job_id is required', code: 'MISSING_JOB_ID' },
        { status: 400 }
      );
    }

    // Query detection job by jobId (text field)
    const job = await db
      .select()
      .from(detectionJobs)
      .where(eq(detectionJobs.jobId, jobId))
      .limit(1);

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

    // Query detection results for this job
    const results = await db
      .select()
      .from(detectionResults)
      .where(eq(detectionResults.jobId, detectionJob.id))
      .orderBy(asc(detectionResults.tier));

    // Build results array
    const resultsArray = results.map(result => ({
      tier: result.tier,
      model_name: result.modelName,
      confidence: result.confidence,
      prediction: result.prediction,
      processing_time_ms: result.processingTimeMs,
      signals: Array.isArray(result.signals) ? result.signals : [],
      heatmap_url: result.heatmapUrl
    }));

    // Aggregate signals from all results
    const aggregatedSignals: any[] = [];
    results.forEach(result => {
      if (Array.isArray(result.signals)) {
        aggregatedSignals.push(...result.signals);
      }
    });

    // Get heatmap URL from highest tier result
    const highestTierResult = results.length > 0 ? results[results.length - 1] : null;
    const heatmapUrl = highestTierResult?.heatmapUrl || null;

    // Build response
    const response = {
      job_id: detectionJob.jobId,
      status: detectionJob.status,
      confidence_score: detectionJob.confidenceScore,
      prediction: detectionJob.prediction,
      tier_reached: detectionJob.tierReached,
      processing_time_ms: detectionJob.processingTimeMs,
      content_type: detectionJob.contentType,
      file_url: detectionJob.fileUrl,
      created_at: detectionJob.createdAt,
      updated_at: detectionJob.updatedAt,
      error_message: detectionJob.errorMessage,
      results: resultsArray,
      signals: aggregatedSignals,
      heatmap_url: heatmapUrl
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}