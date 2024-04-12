import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { db } from '$lib/db/db';
import { City, Venue } from "$lib/db/types";
import { cities, venues } from '$lib/db/schema';

export async function load(event) {
	const { params } = event;
  const { slug } = params;

  const city = await getCity(slug);
  const venues = await getVenues(city.city_id);

	if (city) {
		return { 
      city: city,
      venues: venues,
    };
	}

	error(404, 'Not found');
}

const getCity = async (slug: string) => {
  const result: City[] = await db.select()
    .from(cities)
    .where(eq(cities.slug, slug));

  return result[0];
}

const getVenues = async (cityId: number) => {
  const result: Venue[] = await db.select()
    .from(venues)
    .where(eq(venues.city_id, cityId));

  return result;
}