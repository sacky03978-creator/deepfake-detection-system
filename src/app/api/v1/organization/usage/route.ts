import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { organizations, detectionJobs } from '@/db/schema';
import { eq, gte, count, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get API key from header
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: "API key is required",
        code: "MISSING_API_KEY" 
      }, { status: 401 });
    }

    // Look up organization by API key
    const organization = await db.select()
      .from(organizations)
      .where(eq(organizations.apiKey, apiKey))
      .limit(1);

    if (organization.length === 0) {
      return NextResponse.json({ 
        error: "Invalid API key",
        code: "INVALID_API_KEY" 
      }, { status: 401 });
    }

    const org = organization[0];

    // Calculate quota remaining
    const quota_remaining = org.quotaLimit - org.quotaUsed;

    // Calculate first day of current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Count detection jobs for current month
    const usageResult = await db.select({ count: count() })
      .from(detectionJobs)
      .where(
        sql`${detectionJobs.organizationId} = ${org.id} AND ${detectionJobs.createdAt} >= ${firstDayOfMonth}`
      );

    const usage_this_month = usageResult[0]?.count || 0;

    // Build response
    return NextResponse.json({
      quota_limit: org.quotaLimit,
      quota_used: org.quotaUsed,
      quota_remaining: quota_remaining,
      tier: org.tier,
      usage_this_month: usage_this_month,
      member_since: org.createdAt
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}