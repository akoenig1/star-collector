ALTER TABLE "visits" ADD COLUMN "venue_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "visits" ADD CONSTRAINT "visits_venue_id_venues_venue_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("venue_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
