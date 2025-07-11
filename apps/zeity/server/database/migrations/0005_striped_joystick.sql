CREATE TABLE "organisation_team_member" (
	"team_id" serial NOT NULL,
	"member_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organisation_team_member_team_id_member_id_pk" PRIMARY KEY("team_id","member_id")
);
--> statement-breakpoint
CREATE TABLE "organisation_team" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"permissions" jsonb DEFAULT '[]' NOT NULL,
	"organisation_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "organisation_team_organisation_id_name_unique" UNIQUE("organisation_id","name")
);
--> statement-breakpoint
ALTER TABLE "organisation_member" DROP CONSTRAINT "organisation_member_user_id_organisation_id_pk";--> statement-breakpoint
ALTER TABLE "organisation_member" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "organisation_team_member" ADD CONSTRAINT "organisation_team_member_team_id_organisation_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."organisation_team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_team_member" ADD CONSTRAINT "organisation_team_member_member_id_organisation_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."organisation_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_team" ADD CONSTRAINT "organisation_team_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_member" ADD CONSTRAINT "organisation_member_user_id_organisation_id_unique" UNIQUE("user_id","organisation_id");