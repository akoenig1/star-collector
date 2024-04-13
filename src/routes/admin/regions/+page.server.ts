import { error } from "@sveltejs/kit";

import { db } from '$lib/db/db';
import { Region } from "$lib/db/types";
import { regions } from '$lib/db/schema';

export async function load() {
  const regions = await getRegions();

	if (regions) {
		return { 
      regions: regions,
    };
	}

	error(404, 'Not found');
}

const getRegions = async () => {
  const result: Region[] = await db.select()
    .from(regions)

  return result;
}