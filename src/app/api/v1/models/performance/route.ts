import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { organizations, modelVersions } from '@/db/schema';
import { eq, asc, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Extract API key from headers
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'API key is required',
          code: 'MISSING_API_KEY' 
        },
        { status: 401 }
      );
    }

    // Validate API key by looking up organization
    const organization = await db.select()
      .from(organizations)
      .where(eq(organizations.apiKey, apiKey))
      .limit(1);

    if (organization.length === 0) {
      return NextResponse.json(
        { 
          error: 'Invalid API key',
          code: 'INVALID_API_KEY' 
        },
        { status: 401 }
      );
    }

    // Query all model versions ordered by tier ASC, then createdAt DESC
    const models = await db.select()
      .from(modelVersions)
      .orderBy(asc(modelVersions.tier), desc(modelVersions.createdAt));

    // Map results to response format
    const formattedModels = models.map(model => ({
      name: model.name,
      version: model.version,
      tier: model.tier,
      accuracy: model.accuracy,
      false_positive_rate: model.falsePositiveRate,
      is_active: model.isActive,
      deployment_status: model.deploymentStatus,
      rollout_percentage: model.rolloutPercentage,
      created_at: model.createdAt,
      deployed_at: model.deployedAt
    }));

    return NextResponse.json(
      { models: formattedModels },
      { status: 200 }
    );

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}