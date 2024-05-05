import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from "zod";

import { db } from '$lib/db/db';
import { City, Venue, NewVenue } from "$lib/db/types";
import { cities, venues } from '$lib/db/schema';
import { Actions } from "./$types";

export async function load(event) {
	const { params } = event;
  const { slug } = params;

  const city = await getCity(slug);
  const venues = await getVenues(city.city_id);
  const form = await superValidate(zod(venueFormSchema));

	if (city) {
		return { 
      city: city,
      venues: venues,
      form,
    };
	}

	error(404, 'Not found');
}

export const actions: Actions = {
  create: async ({ params, request }) => {
    const form = await superValidate(request, zod(venueFormSchema));
    const { slug } = params;
    const city = await getCity(slug);

    if (!form.valid) {
      return fail(400, { form });
    }

    const { venueName, slug: venueSlug } = form.data;

    const newVenue: NewVenue = {
      name: venueName,
      city_id: city!.city_id,
      slug: venueSlug ?? venueName.toLowerCase().replace(/\s/g, '-'),
    }

    const result = await addVenue(newVenue);

    if (result.success) {
      return { form }
    } else {
      error(500, result.message)
    }
  }
};

const venueFormSchema = z.object({
  venueName: z.string(),
  slug: z.string().optional(),
});

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

const addVenue = async (newVenue: NewVenue) => {
  try { 
    console.log(`Adding venue ${newVenue.name}...`)
    const res = await db.insert(venues).values(newVenue).returning();
    const venue = res[0];
    console.log(`Venue ${venue.name} added successfully!`)
    return {
      success: true,
      message: `Venue ${venue.name} added successfully!`,
    }
  } catch (error) {
    console.error(error);
    let detail = '';
    if (error instanceof Error) detail = error.message;
    return {
      success: false,
      message: `Error adding venue ${newVenue.name}: ${detail}`,
    }
  }
}
