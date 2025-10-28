import { db } from '@/db';
import { apiUsageLogs } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const getDaysAgo = (days: number): string => {
        const date = new Date(now);
        date.setDate(date.getDate() - days);
        return date.toISOString();
    };

    const sampleApiUsageLogs = [
        // Logs for organization 1 (Acme Corp)
        {
            organizationId: 1,
            endpoint: '/api/v1/detect',
            method: 'POST',
            statusCode: 201,
            responseTimeMs: 145,
            timestamp: getDaysAgo(2),
        },
        {
            organizationId: 1,
            endpoint: '/api/v1/result/job-001-video-pending',
            method: 'GET',
            statusCode: 200,
            responseTimeMs: 78,
            timestamp: getDaysAgo(2),
        },
        {
            organizationId: 1,
            endpoint: '/api/v1/detect',
            method: 'POST',
            statusCode: 201,
            responseTimeMs: 132,
            timestamp: getDaysAgo(1),
        },
        {
            organizationId: 1,
            endpoint: '/api/v1/organization/usage',
            method: 'GET',
            statusCode: 200,
            responseTimeMs: 65,
            timestamp: getDaysAgo(1),
        },
        
        // Logs for organization 2 (TechVision Inc)
        {
            organizationId: 2,
            endpoint: '/api/v1/detect',
            method: 'POST',
            statusCode: 201,
            responseTimeMs: 167,
            timestamp: getDaysAgo(5),
        },
        {
            organizationId: 2,
            endpoint: '/api/v1/result/job-002-image-completed',
            method: 'GET',
            statusCode: 200,
            responseTimeMs: 92,
            timestamp: getDaysAgo(5),
        },
        {
            organizationId: 2,
            endpoint: '/api/v1/feedback',
            method: 'POST',
            statusCode: 201,
            responseTimeMs: 89,
            timestamp: getDaysAgo(4),
        },
        {
            organizationId: 2,
            endpoint: '/api/v1/organization/analytics',
            method: 'GET',
            statusCode: 200,
            responseTimeMs: 234,
            timestamp: getDaysAgo(3),
        },
        
        // Logs for organization 3 (MediaGuard Pro)
        {
            organizationId: 3,
            endpoint: '/api/v1/batch',
            method: 'POST',
            statusCode: 201,
            responseTimeMs: 456,
            timestamp: getDaysAgo(8),
        },
        {
            organizationId: 3,
            endpoint: '/api/v1/batch/batch-abc-123',
            method: 'GET',
            statusCode: 200,
            responseTimeMs: 198,
            timestamp: getDaysAgo(8),
        },
        {
            organizationId: 3,
            endpoint: '/api/v1/detect',
            method: 'POST',
            statusCode: 403,
            responseTimeMs: 45,
            timestamp: getDaysAgo(7),
        },
        {
            organizationId: 3,
            endpoint: '/api/v1/models/performance',
            method: 'GET',
            statusCode: 200,
            responseTimeMs: 112,
            timestamp: getDaysAgo(6),
        },
        
        // Logs for organization 4 (Startup Labs)
        {
            organizationId: 4,
            endpoint: '/api/v1/detect',
            method: 'POST',
            statusCode: 201,
            responseTimeMs: 154,
            timestamp: getDaysAgo(12),
        },
        {
            organizationId: 4,
            endpoint: '/api/v1/result/job-006-video-completed',
            method: 'GET',
            statusCode: 200,
            responseTimeMs: 87,
            timestamp: getDaysAgo(12),
        },
        {
            organizationId: 4,
            endpoint: '/api/v1/detect',
            method: 'POST',
            statusCode: 400,
            responseTimeMs: 34,
            timestamp: getDaysAgo(10),
        },
        {
            organizationId: 4,
            endpoint: '/api/v1/organization/usage',
            method: 'GET',
            statusCode: 200,
            responseTimeMs: 71,
            timestamp: getDaysAgo(9),
        },
        
        // Logs for organization 5 (Global Security Solutions)
        {
            organizationId: 5,
            endpoint: '/api/v1/batch',
            method: 'POST',
            statusCode: 201,
            responseTimeMs: 678,
            timestamp: getDaysAgo(7),
        },
        {
            organizationId: 5,
            endpoint: '/api/v1/result/job-007-audio-completed',
            method: 'GET',
            statusCode: 200,
            responseTimeMs: 143,
            timestamp: getDaysAgo(7),
        },
        {
            organizationId: 5,
            endpoint: '/api/v1/feedback',
            method: 'POST',
            statusCode: 201,
            responseTimeMs: 95,
            timestamp: getDaysAgo(6),
        },
        {
            organizationId: 5,
            endpoint: '/api/v1/organization/analytics',
            method: 'GET',
            statusCode: 200,
            responseTimeMs: 289,
            timestamp: getDaysAgo(5),
        },
    ];

    await db.insert(apiUsageLogs).values(sampleApiUsageLogs);
    
    console.log('✅ API usage logs seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});