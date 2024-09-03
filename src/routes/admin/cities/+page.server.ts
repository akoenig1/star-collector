import { error } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from "zod";

import { db } from '$lib/db/db';
import { NewCity, City, Region } from "$lib/db/types";
import { cities, regions } from '$lib/db/schema';
import { Actions } from "./$types";

export async function load() {
  const regions = await getRegions();
  const cities = await getCities();
  const form = await superValidate(zod(cityFormSchema));

	if (regions && cities) {
		return { 
      regions,
      cities,
      form
    };
	}

	error(404, 'Not found');
}

export const actions: Actions = {
  create: async ({ request }) => {
    const form = await superValidate(request, zod(cityFormSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { cityName, regionId, slug: citySlug, currentYear } = form.data;

    const newCity: NewCity = {
      name: cityName,
      region_id: regionId,
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
  regionId: z.number(),
  slug: z.string().optional(),
  currentYear: z.number(),
});

const getRegions = async () => {
  const result: Region[] = await db.select().from(regions)
  return result;
}

const getCities = async () => {
  const result: City[] = await db.select().from(cities)
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
