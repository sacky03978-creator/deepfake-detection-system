import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { organizations, detectionJobs } from '@/db/schema';
import { eq, gte, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Authentication: Get API key from header
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

    // Get all detection jobs for this organization
    const jobs = await db
      .select()
      .from(detectionJobs)
      .where(eq(detectionJobs.organizationId, org.id));

    // Calculate total jobs
    const total_jobs = jobs.length;

    // Calculate by_status
    const by_status = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    };

    jobs.forEach((job) => {
      const status = job.status as keyof typeof by_status;
      if (status in by_status) {
        by_status[status]++;
      }
    });

    // Calculate by_prediction
    const by_prediction = {
      authentic: 0,
      deepfake: 0,
      uncertain: 0,
      pending: 0,
    };

    jobs.forEach((job) => {
      if (job.prediction === null) {
        by_prediction.pending++;
      } else {
        const prediction = job.prediction as keyof typeof by_prediction;
        if (prediction in by_prediction) {
          by_prediction[prediction]++;
        }
      }
    });

    // Calculate average confidence score
    const jobsWithConfidence = jobs.filter(
      (job) => job.confidenceScore !== null
    );
    const avg_confidence =
      jobsWithConfidence.length > 0
        ? jobsWithConfidence.reduce(
            (sum, job) => sum + (job.confidenceScore || 0),
            0
          ) / jobsWithConfidence.length
        : null;

    // Calculate average processing time
    const jobsWithProcessingTime = jobs.filter(
      (job) => job.processingTimeMs !== null
    );
    const avg_processing_time_ms =
      jobsWithProcessingTime.length > 0
        ? jobsWithProcessingTime.reduce(
            (sum, job) => sum + (job.processingTimeMs || 0),
            0
          ) / jobsWithProcessingTime.length
        : null;

    // Calculate jobs by day for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString().substring(0, 10);

    // Group jobs by date
    const jobsByDateMap = new Map<string, number>();

    jobs.forEach((job) => {
      const date = job.createdAt.substring(0, 10);
      if (date >= thirtyDaysAgoISO) {
        jobsByDateMap.set(date, (jobsByDateMap.get(date) || 0) + 1);
      }
    });

    // Convert to array and sort by date ascending
    const jobs_by_day = Array.from(jobsByDateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Return analytics
    return NextResponse.json(
      {
        total_jobs,
        by_status,
        by_prediction,
        avg_confidence,
        avg_processing_time_ms,
        jobs_by_day,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}