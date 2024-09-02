CREATE TABLE IF NOT EXISTS "visits" (
	"visit_id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"star_award_id" integer,
	"visit_date" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "visits" ADD CONSTRAINT "visits_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "visits" ADD CONSTRAINT "visits_star_award_id_star_awards_star_award_id_fk" FOREIGN KEY ("star_award_id") REFERENCES "public"."star_awards"("star_award_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
