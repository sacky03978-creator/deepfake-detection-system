import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const organizations = sqliteTable('organizations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  apiKey: text('api_key').notNull().unique(),
  tier: text('tier').notNull().default('free'),
  quotaLimit: integer('quota_limit').notNull(),
  quotaUsed: integer('quota_used').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const detectionJobs = sqliteTable('detection_jobs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  jobId: text('job_id').notNull().unique(),
  organizationId: integer('organization_id').notNull().references(() => organizations.id),
  status: text('status').notNull().default('pending'),
  contentType: text('content_type').notNull(),
  fileUrl: text('file_url').notNull(),
  fileSizeBytes: integer('file_size_bytes').notNull(),
  tierReached: integer('tier_reached'),
  confidenceScore: real('confidence_score'),
  prediction: text('prediction'),
  processingTimeMs: integer('processing_time_ms'),
  errorMessage: text('error_message'),
  metadata: text('metadata', { mode: 'json' }),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const detectionResults = sqliteTable('detection_results', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  jobId: integer('job_id').notNull().references(() => detectionJobs.id),
  tier: integer('tier').notNull(),
  modelName: text('model_name').notNull(),
  confidence: real('confidence').notNull(),
  prediction: text('prediction').notNull(),
  processingTimeMs: integer('processing_time_ms').notNull(),
  signals: text('signals', { mode: 'json' }).notNull(),
  heatmapUrl: text('heatmap_url'),
  createdAt: text('created_at').notNull(),
});

export const modelVersions = sqliteTable('model_versions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  version: text('version').notNull(),
  tier: integer('tier').notNull(),
  accuracy: real('accuracy').notNull(),
  falsePositiveRate: real('false_positive_rate').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(false),
  deploymentStatus: text('deployment_status').notNull().default('testing'),
  rolloutPercentage: integer('rollout_percentage').notNull().default(0),
  createdAt: text('created_at').notNull(),
  deployedAt: text('deployed_at'),
});

export const feedback = sqliteTable('feedback', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  jobId: integer('job_id').notNull().references(() => detectionJobs.id),
  organizationId: integer('organization_id').notNull().references(() => organizations.id),
  feedbackType: text('feedback_type').notNull(),
  trueLabel: text('true_label').notNull(),
  comments: text('comments'),
  createdAt: text('created_at').notNull(),
});

export const apiUsageLogs = sqliteTable('api_usage_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  organizationId: integer('organization_id').notNull().references(() => organizations.id),
  endpoint: text('endpoint').notNull(),
  method: text('method').notNull(),
  statusCode: integer('status_code').notNull(),
  responseTimeMs: integer('response_time_ms').notNull(),
  timestamp: text('timestamp').notNull(),
});

export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const sessions = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => users.id),
});

export const accounts = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const verifications = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});