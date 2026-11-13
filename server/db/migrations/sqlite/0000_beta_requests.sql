CREATE TABLE `beta_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`server` text NOT NULL,
	`role` text NOT NULL,
	`members` text NOT NULL,
	`email` text NOT NULL,
	`created_at` integer NOT NULL,
	`closed_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `beta_requests_email_server` ON `beta_requests` (`email`,`server`);