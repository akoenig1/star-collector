ALTER TABLE "cities" ADD CONSTRAINT "cities_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "venues" ADD CONSTRAINT "venues_slug_unique" UNIQUE("slug");