import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from "zod";

import { db } from '$lib/db/db';
import { City, Region, NewCity } from "$lib/db/types";
import { cities, regions } from '$lib/db/schema';
import { Actions } from "./$types";


export async function load(event) {
	const { params } = event;
  const { slug } = params;

  const region = await getRegion(slug);
  const cities = await getCities(region.region_id);
  const form = await superValidate(zod(cityFormSchema));

	if (region) {
		return { 
      region,
      cities,
      form,
    };
	}

	error(404, 'Not found');
}

export const actions: Actions = {
  create: async ({ params, request }) => {
    const form = await superValidate(request, zod(cityFormSchema));
    const { slug } = params;
    // This feels wildly inefficient. Either svelte is ass or I have no clue how to use it
    const region = await getRegion(slug);

    if (!form.valid) {
      return fail(400, { form });
    }

    const { cityName, slug: citySlug, currentYear } = form.data;

    const newCity: NewCity = {
      name: cityName,
      region_id: region!.region_id,
      current_year: currentYear,
      slug: citySlug ?? cityName.toLowerCase().replace(/\s/g, '-'),
    }

    const result = await addCity(newCity);

    if (result.success) {
      return { form }
    } else {
      error(500, result.message)
    }
  }
};

const cityFormSchema = z.object({
  cityName: z.string(),
  slug: z.string().optional(),
  currentYear: z.number(),
});

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

const addCity = async (newCity: NewCity) => {
  try { 
    console.log(`Adding city ${newCity.name}...`)
    const res = await db.insert(cities).values(newCity).returning();
    const city = res[0];
    console.log(`City ${city.name} added successfully!`)
    return {
      success: true,
      message: `City ${city.name} added successfully!`,
    }
  } catch (error) {
    console.error(error);
    let detail = '';
    if (error instanceof Error) detail = error.message;
    return {
      success: false,
      message: `Error adding city ${newCity.name}: ${detail}`,
    }
  }
}
