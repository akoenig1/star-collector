import { error } from "@sveltejs/kit";

import { db } from '$lib/db/db';
import { City, Region } from "$lib/db/types";
import { cities, regions } from '$lib/db/schema';

export async function load() {
  const regions = await getRegions();
  const cities = await getCities();

	if (regions && cities) {
		return { 
      regions,
      cities,
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
