CREATE TABLE `api_usage_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_id` integer NOT NULL,
	`endpoint` text NOT NULL,
	`method` text NOT NULL,
	`status_code` integer NOT NULL,
	`response_time_ms` integer NOT NULL,
	`timestamp` text NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `detection_jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_id` text NOT NULL,
	`organization_id` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`content_type` text NOT NULL,
	`file_url` text NOT NULL,
	`file_size_bytes` integer NOT NULL,
	`tier_reached` integer,
	`confidence_score` real,
	`prediction` text,
	`processing_time_ms` integer,
	`error_message` text,
	`metadata` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `detection_jobs_job_id_unique` ON `detection_jobs` (`job_id`);--> statement-breakpoint
CREATE TABLE `detection_results` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_id` integer NOT NULL,
	`tier` integer NOT NULL,
	`model_name` text NOT NULL,
	`confidence` real NOT NULL,
	`prediction` text NOT NULL,
	`processing_time_ms` integer NOT NULL,
	`signals` text NOT NULL,
	`heatmap_url` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `detection_jobs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `feedback` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_id` integer NOT NULL,
	`organization_id` integer NOT NULL,
	`feedback_type` text NOT NULL,
	`true_label` text NOT NULL,
	`comments` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `detection_jobs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `model_versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`version` text NOT NULL,
	`tier` integer NOT NULL,
	`accuracy` real NOT NULL,
	`false_positive_rate` real NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`deployment_status` text DEFAULT 'testing' NOT NULL,
	`rollout_percentage` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`deployed_at` text
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`api_key` text NOT NULL,
	`tier` text DEFAULT 'free' NOT NULL,
	`quota_limit` integer NOT NULL,
	`quota_used` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_api_key_unique` ON `organizations` (`api_key`);