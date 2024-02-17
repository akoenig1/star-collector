import {
  cities,
  regions,
  starAwards,
  venues,
} from "./schema";

// regions
export type Region = typeof regions.$inferSelect;
export type NewRegion = typeof regions.$inferInsert;

// cities
export type City = typeof cities.$inferSelect;
export type NewCity = typeof cities.$inferInsert;

// venues
export type Venue = typeof venues.$inferSelect;
export type NewVenue = typeof venues.$inferInsert;

// starAwards
export type StarAward = typeof starAwards.$inferSelect;
export type NewStarAward = typeof starAwards.$inferInsert;
