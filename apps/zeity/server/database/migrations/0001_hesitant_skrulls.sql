CREATE TABLE "organisation_invite" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organisationMember" RENAME TO "organisation_member";--> statement-breakpoint
ALTER TABLE "organisation_member" DROP CONSTRAINT "organisationMember_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation_member" DROP CONSTRAINT "organisationMember_organisation_id_organisation_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation_member" DROP CONSTRAINT "organisationMember_user_id_organisation_id_pk";--> statement-breakpoint
ALTER TABLE "organisation_member" ADD CONSTRAINT "organisation_member_user_id_organisation_id_pk" PRIMARY KEY("user_id","organisation_id");--> statement-breakpoint
ALTER TABLE "organisation_invite" ADD CONSTRAINT "organisation_invite_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "organisation_invite_organisation_id_email_index" ON "organisation_invite" USING btree ("organisation_id","email");--> statement-breakpoint
CREATE INDEX "organisation_invite_email_index" ON "organisation_invite" USING btree ("email");--> statement-breakpoint
ALTER TABLE "organisation_member" ADD CONSTRAINT "organisation_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_member" ADD CONSTRAINT "organisation_member_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;