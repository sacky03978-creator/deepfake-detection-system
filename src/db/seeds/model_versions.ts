import { db } from '@/db';
import { modelVersions } from '@/db/schema';

async function main() {
    const sampleModels = [
        {
            name: 'QuickScan-V1',
            version: '1.2.0',
            tier: 1,
            accuracy: 0.85,
            falsePositiveRate: 0.12,
            isActive: true,
            deploymentStatus: 'production',
            rolloutPercentage: 100,
            createdAt: new Date('2023-12-15').toISOString(),
            deployedAt: new Date('2024-01-10').toISOString(),
        },
        {
            name: 'QuickScan-V2',
            version: '2.0.0',
            tier: 1,
            accuracy: 0.87,
            falsePositiveRate: 0.10,
            isActive: false,
            deploymentStatus: 'canary',
            rolloutPercentage: 25,
            createdAt: new Date('2024-02-01').toISOString(),
            deployedAt: new Date('2024-03-15').toISOString(),
        },
        {
            name: 'SmartDetect-Pro',
            version: '3.1.5',
            tier: 2,
            accuracy: 0.92,
            falsePositiveRate: 0.07,
            isActive: true,
            deploymentStatus: 'production',
            rolloutPercentage: 100,
            createdAt: new Date('2023-10-20').toISOString(),
            deployedAt: new Date('2023-12-01').toISOString(),
        },
        {
            name: 'SmartDetect-Pro',
            version: '3.2.0',
            tier: 2,
            accuracy: 0.93,
            falsePositiveRate: 0.06,
            isActive: false,
            deploymentStatus: 'testing',
            rolloutPercentage: 0,
            createdAt: new Date('2024-03-10').toISOString(),
            deployedAt: null,
        },
        {
            name: 'DeepGuard-Advanced',
            version: '4.0.2',
            tier: 3,
            accuracy: 0.96,
            falsePositiveRate: 0.04,
            isActive: true,
            deploymentStatus: 'production',
            rolloutPercentage: 100,
            createdAt: new Date('2023-08-15').toISOString(),
            deployedAt: new Date('2023-11-01').toISOString(),
        },
        {
            name: 'DeepGuard-Advanced',
            version: '4.1.0',
            tier: 3,
            accuracy: 0.97,
            falsePositiveRate: 0.03,
            isActive: false,
            deploymentStatus: 'canary',
            rolloutPercentage: 50,
            createdAt: new Date('2024-02-20').toISOString(),
            deployedAt: new Date('2024-03-25').toISOString(),
        },
        {
            name: 'UltraVerify-Enterprise',
            version: '5.0.1',
            tier: 4,
            accuracy: 0.985,
            falsePositiveRate: 0.015,
            isActive: true,
            deploymentStatus: 'production',
            rolloutPercentage: 100,
            createdAt: new Date('2023-06-01').toISOString(),
            deployedAt: new Date('2023-09-15').toISOString(),
        },
        {
            name: 'UltraVerify-Enterprise',
            version: '5.1.0-beta',
            tier: 4,
            accuracy: 0.99,
            falsePositiveRate: 0.01,
            isActive: false,
            deploymentStatus: 'testing',
            rolloutPercentage: 0,
            createdAt: new Date('2024-03-01').toISOString(),
            deployedAt: null,
        },
    ];

    await db.insert(modelVersions).values(sampleModels);
    
    console.log('✅ Model versions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});