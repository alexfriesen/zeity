CREATE TABLE "auth_otp" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_otp" ADD CONSTRAINT "auth_otp_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auth_otp_expires_at_index" ON "auth_otp" USING btree ("expires_at");