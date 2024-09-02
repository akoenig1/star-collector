import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { db } from "$lib/db/db";
import { City, Region, StarAward, Venue } from "$lib/db/types";
import { cities, regions, starAwards, venues, visits } from '$lib/db/schema';


export async function load({ locals }) {
  const user = locals.user;
  
  const regions = await getRegions();
  const cities = await getCities();
  const venues = await getVenues();
  const currentGlobalStarAwards = await getCurrentGlobalStarAwards();
  const userVisits = user ? await getUserVisits(user) : [];

  const totalGlobalStars = currentGlobalStarAwards.reduce((acc, award) => acc + (award?.stars ?? 0), 0);
  const totalThreeStarVenues = currentGlobalStarAwards.filter(award => award.stars === 3).length;
  const totalTwoStarVenues = currentGlobalStarAwards.filter(award => award.stars === 2).length;
  const totalOneStarVenues = currentGlobalStarAwards.filter(award => award.stars === 1).length;

	if (regions) {
		return { 
      user,
      regions,
      cities,
      venues,
      totalGlobalStars,
      totalThreeStarVenues,
      totalTwoStarVenues,
      totalOneStarVenues,
      userVisits,
    };
	}

	error(404, 'Not found');
}

const getRegions = async () => {
  const result: Region[] = await db.select().from(regions)
  return result;
}

const getCities = async () => {
  const result: City[] = await db.select().from(cities)
  return result;
}

const getVenues = async () => {
  const result: Venue[] = await db.select().from(venues)
  return result;
}

const getUserVisits = async (user) => {
  const result = await db.select().from(visits).where(eq(visits.user_id, user.id));
  return result;
}

const getCurrentGlobalStarAwards = async () => {
  const result: StarAward[] = await db.select({
      star_award_id: starAwards.star_award_id,
      year: starAwards.year,
      venue_id: starAwards.venue_id,
      stars: starAwards.stars
    })
    .from(starAwards)
    .innerJoin(venues, eq(starAwards.venue_id, venues.venue_id))
    .innerJoin(cities, eq(cities.city_id, venues.city_id))
    .where(eq(starAwards.year, cities.current_year));
  return result;
}
