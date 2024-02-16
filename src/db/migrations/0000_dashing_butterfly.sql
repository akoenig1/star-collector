CREATE TABLE IF NOT EXISTS "cities" (
	"city_id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"region_id" integer,
	"current_year" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "regions" (
	"region_id" serial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "star_awards" (
	"star_award_id" serial PRIMARY KEY NOT NULL,
	"year" integer,
	"venue_id" integer,
	"stars" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "venues" (
	"venue_id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"city_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cities" ADD CONSTRAINT "cities_region_id_regions_region_id_fk" FOREIGN KEY ("region_id") REFERENCES "regions"("region_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "star_awards" ADD CONSTRAINT "star_awards_venue_id_venues_venue_id_fk" FOREIGN KEY ("venue_id") REFERENCES "venues"("venue_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "venues" ADD CONSTRAINT "venues_city_id_cities_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "cities"("city_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
