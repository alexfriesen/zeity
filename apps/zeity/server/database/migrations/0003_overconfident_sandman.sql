DROP INDEX "name_idx";--> statement-breakpoint
DROP INDEX "time_end_index";--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
CREATE INDEX "project_name_index" ON "project" USING btree ("name");--> statement-breakpoint
CREATE INDEX "project_status_index" ON "project" USING btree ("status");--> statement-breakpoint
CREATE INDEX "time_duration_index" ON "time" USING btree ("duration");--> statement-breakpoint
ALTER TABLE "time" DROP COLUMN "end";