import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { db } from '$lib/db/db';
import { City, Region } from "$lib/db/types";
import { cities, regions } from '$lib/db/schema';

export async function load(event) {
	const { params } = event;
  const { slug } = params;

  const region = await getRegion(slug);
  const cities = await getCities(region.region_id);

	if (region) {
		return { 
      region: region,
      cities: cities,
    };
	}

	error(404, 'Not found');
}

const getRegion = async (slug: string) => {
  const result: Region[] = await db.select()
    .from(regions)
    .where(eq(regions.slug, slug));

  return result[0];
}

const getCities = async (regionId: number) => {
  const result: City[] = await db.select()
    .from(cities)
    .where(eq(cities.region_id, regionId));

  return result;
}
