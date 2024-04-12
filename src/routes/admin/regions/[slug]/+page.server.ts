import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { db } from '$lib/db/db';
import { Region } from "$lib/db/types";
import { regions } from '$lib/db/schema';

export async function load(event) {
	const { params } = event;
  const { slug } = params;

  const result: Region[] = await db.select()
    .from(regions)
    .where(eq(regions.slug, slug))

  const region = result[0];

	if (region) {
		return { region: region };
	}

	error(404, 'Not found');
}