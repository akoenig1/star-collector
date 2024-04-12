import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { db } from '$lib/db/db';
import { Venue, StarAward } from "$lib/db/types";
import { venues, starAwards } from '$lib/db/schema';

export async function load(event) {
	const { params } = event;
  const { slug } = params;

  const venue = await getVenue(slug);
  const starAwards = await getStarAwards(venue.venue_id);

	if (venue) {
		return { 
      venue: venue,
      starAwards: starAwards,
    };
	}

	error(404, 'Not found');
}

const getVenue = async (slug: string) => {
  const result: Venue[] = await db.select()
    .from(venues)
    .where(eq(venues.slug, slug));

  return result[0];
}

const getStarAwards = async (venueId: number) => {
  const result: StarAward[] = await db.select()
    .from(starAwards)
    .where(eq(starAwards.venue_id, venueId));

  return result;
}