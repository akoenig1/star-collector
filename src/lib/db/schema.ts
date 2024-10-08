import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
	id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
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
  slug: text("slug").unique(),
});

export const cities = pgTable("cities", {
  city_id: serial("city_id").primaryKey(),
  name: text("name"),
  region_id: integer("region_id").references(() => regions.region_id),
  current_year: integer("current_year"),
  slug: text("slug").unique(),
});

export const venues = pgTable("venues", {
  venue_id: serial("venue_id").primaryKey(),
  name: text("name"),
  city_id: integer("city_id").references(() => cities.city_id),
  slug: text("slug").unique(),
});

export const starAwards = pgTable("star_awards", {
  star_award_id: serial("star_award_id").primaryKey(),
  year: integer("year"),
  venue_id: integer("venue_id").references(() => venues.venue_id),
  stars: integer("stars"),
});

export const visits = pgTable("visits", {
  visit_id: serial("visit_id").primaryKey(),
  user_id: text("user_id").references(() => users.id),
  venue_id: integer("venue_id").references(() => venues.venue_id),
  star_award_id: integer("star_award_id").references(() => starAwards.star_award_id),
  visit_date: timestamp("visit_date", {
    withTimezone: true,
    mode: "date"
  }).notNull()
});
