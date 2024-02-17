import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const regions = pgTable("regions", {
  region_id: serial("region_id").primaryKey(),
  name: text("name"),
});
export type Region = typeof regions.$inferSelect;
export type NewRegion = typeof regions.$inferInsert;

export const cities = pgTable("cities", {
  city_id: serial("city_id").primaryKey(),
  name: text("name"),
  region_id: integer("region_id").references(() => regions.region_id),
  current_year: integer("current_year"),
});

export const venues = pgTable("venues", {
  venue_id: serial("venue_id").primaryKey(),
  name: text("name"),
  city_id: integer("city_id").references(() => cities.city_id),
});

export const starAwards = pgTable("star_awards", {
  star_award_id: serial("star_award_id").primaryKey(),
  year: integer("year"),
  venue_id: integer("venue_id").references(() => venues.venue_id),
  stars: integer("stars"),
});
