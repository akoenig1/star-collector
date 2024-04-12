import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
	id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
});

export const sessions = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export const regions = pgTable("regions", {
  region_id: serial("region_id").primaryKey(),
  name: text("name"),
});

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
