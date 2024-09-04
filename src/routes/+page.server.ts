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

  // FIX: for repeat visits, we should only count the stars once, but which visit to use?
  const userStars = userVisits.reduce((acc, visit) => {
    const addend = visit.star_awards?.stars ?? 0;
    return acc + addend;
  }, 0);

  const uniqueVenueIds = new Set(userVisits.map(visit => visit.visits.venue_id));
  const userVenueCount = uniqueVenueIds.size;
  const userOneStarVenues = userVisits.filter(visit => uniqueVenueIds.has(visit.visits.venue_id) && visit.star_awards?.stars === 1).length;
  const userTwoStarVenues = userVisits.filter(visit => uniqueVenueIds.has(visit.visits.venue_id) && visit.star_awards?.stars === 2).length;
  const userThreeStarVenues = userVisits.filter(visit => uniqueVenueIds.has(visit.visits.venue_id) && visit.star_awards?.stars === 3).length;

  const uniqueRegionIds = new Set(userVisits.map(visit => visit.cities.region_id));
  const userRegionCount = uniqueRegionIds.size;

  const uniqueCityIds = new Set(userVisits.map(visit => visit.venues.city_id));
  const userCityCount = uniqueCityIds.size;

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
      userStars,
      userVenueCount,
      userOneStarVenues,
      userTwoStarVenues,
      userThreeStarVenues,
      userRegionCount,
      userCityCount,
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
  const result = await db.select().from(visits)
    .innerJoin(venues, eq(visits.venue_id, venues.venue_id))
    .innerJoin(starAwards, eq(visits.star_award_id, starAwards.star_award_id))
    .innerJoin(cities, eq(venues.city_id, cities.city_id))
    .where(eq(visits.user_id, user.id));

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
