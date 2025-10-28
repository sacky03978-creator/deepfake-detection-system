import { db } from '@/db';
import { organizations } from '@/db/schema';

async function main() {
    const now = new Date().toISOString();
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString();
    const fourMonthsAgo = new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString();
    const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const sampleOrganizations = [
        {
            name: 'Acme Corp',
            apiKey: 'test-key-acme-corp-123',
            tier: 'free',
            quotaLimit: 100,
            quotaUsed: 45,
            createdAt: sixMonthsAgo,
            updatedAt: now,
        },
        {
            name: 'TechVision Inc',
            apiKey: 'test-key-techvision-456',
            tier: 'professional',
            quotaLimit: 1000,
            quotaUsed: 234,
            createdAt: fourMonthsAgo,
            updatedAt: now,
        },
        {
            name: 'MediaGuard Pro',
            apiKey: 'test-key-mediaguard-789',
            tier: 'enterprise',
            quotaLimit: 10000,
            quotaUsed: 3456,
            createdAt: threeMonthsAgo,
            updatedAt: now,
        },
        {
            name: 'Startup Labs',
            apiKey: 'test-key-startup-labs-321',
            tier: 'free',
            quotaLimit: 100,
            quotaUsed: 98,
            createdAt: twoMonthsAgo,
            updatedAt: now,
        },
        {
            name: 'Global Security Solutions',
            apiKey: 'test-key-global-security-654',
            tier: 'enterprise',
            quotaLimit: 50000,
            quotaUsed: 12345,
            createdAt: oneMonthAgo,
            updatedAt: now,
        },
    ];

    await db.insert(organizations).values(sampleOrganizations);
    
    console.log('✅ Organizations seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});