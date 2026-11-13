CREATE TABLE `searches` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`created_at` text NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trials` (
	`id` text PRIMARY KEY NOT NULL,
	`search_id` text NOT NULL,
	`created_at` text NOT NULL,
	`payload` text NOT NULL
);
