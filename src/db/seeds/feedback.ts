import { db } from '@/db';
import { feedback } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const sampleFeedback = [
        {
            jobId: 2,
            organizationId: 2,
            feedbackType: 'correct',
            trueLabel: 'deepfake',
            comments: 'The detection was accurate. This was indeed a manipulated profile photo.',
            createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            jobId: 4,
            organizationId: 3,
            feedbackType: 'correct',
            trueLabel: 'authentic',
            comments: 'Confirmed authentic news footage. Thank you for the detailed analysis.',
            createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            jobId: 6,
            organizationId: 4,
            feedbackType: 'incorrect',
            trueLabel: 'deepfake',
            comments: 'This was actually a deepfake video. The system missed subtle face swapping.',
            createdAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            jobId: 7,
            organizationId: 5,
            feedbackType: 'correct',
            trueLabel: 'deepfake',
            comments: 'Excellent detection on synthetic voice. Very helpful for our investigation.',
            createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            jobId: 8,
            organizationId: 3,
            feedbackType: 'uncertain',
            trueLabel: 'authentic',
            comments: 'The image quality was poor, making it difficult to determine. System response appropriate.',
            createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            jobId: 10,
            organizationId: 2,
            feedbackType: 'correct',
            trueLabel: 'authentic',
            comments: 'Verified as authentic social media post. Good call.',
            createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            jobId: 13,
            organizationId: 4,
            feedbackType: 'correct',
            trueLabel: 'deepfake',
            comments: 'Critical catch! This forged passport would have been approved without your system.',
            createdAt: new Date(now.getTime() - 17 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            jobId: 15,
            organizationId: 5,
            feedbackType: 'correct',
            trueLabel: 'authentic',
            comments: null,
            createdAt: new Date(now.getTime() - 24 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];

    await db.insert(feedback).values(sampleFeedback);
    
    console.log('✅ Feedback seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});