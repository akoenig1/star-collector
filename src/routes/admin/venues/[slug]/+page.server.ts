import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from "zod";

import { db } from '$lib/db/db';
import { Venue, StarAward, NewStarAward } from "$lib/db/types";
import { venues, starAwards } from '$lib/db/schema';
import { Actions } from "./$types";

export async function load(event) {
	const { params } = event;
  const { slug } = params;

  const venue = await getVenue(slug);
  const starAwards = await getStarAwards(venue.venue_id);
  const form = await superValidate(zod(starAwardFormSchema));


	if (venue) {
		return { 
      venue: venue,
      starAwards: starAwards,
      form,
    };
	}

	error(404, 'Not found');
}

export const actions: Actions = {
  create: async ({ params, request }) => {
    const form = await superValidate(request, zod(starAwardFormSchema));
    const { slug } = params;
    const venue = await getVenue(slug);
    const { venue_id, name: venueName } = venue;

    if (!form.valid) {
      return fail(400, { form });
    }

    const { starAwardYear, stars } = form.data;

    const newStarAward: NewStarAward = {
      year: starAwardYear,
      venue_id: venue_id,
      stars: stars,
    }

    const result = await addStarAward(newStarAward, venueName!);

    if (result.success) {
      return { form }
    } else {
      error(500, result.message)
    }
  }
};

const starAwardFormSchema = z.object({
  starAwardYear: z.number(),
  stars: z.number().min(1).max(3),
});

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

const addStarAward = async (newStarAward: NewStarAward, venueName: string) => {
  try { 
    console.log(`Adding ${venueName} Star Award ${newStarAward.year}...`)
    const res = await db.insert(starAwards).values(newStarAward).returning();
    const starAward = res[0];
    console.log(`${venueName} Star Award ${starAward.year} added successfully!`)
    return {
      success: true,
      message: `${venueName} Star Award ${starAward.year} added successfully!`,
    }
  } catch (error) {
    console.error(error);
    let detail = '';
    if (error instanceof Error) detail = error.message;
    return {
      success: false,
      message: `Error adding ${venueName} Star Award ${newStarAward.year}: ${detail}`,
    }
  }
}
