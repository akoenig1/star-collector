import { error } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { db } from '$lib/db/db';
import { NewVisit, Venue } from "$lib/db/types";
import { cities, starAwards, visits, venues } from '$lib/db/schema';
import { Actions } from "./$types";

export async function load() {
  const venues = await getVenues();
  const form = await superValidate(zod(visitFormSchema));

	if (venues) {
		return { 
      venues,
      form
    };
	}

	error(404, 'Not found');
}

export const actions: Actions = {
  create: async ({ locals, request }) => {
    const user = locals.user;

    if (!user) {
      error(401, 'Unauthorized');
    }

    const form = await superValidate(request, zod(visitFormSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { venueId, year, month, day } = form.data;

    const visitDate = new Date(year, month, day ?? 1);
    const cityYear = await getCityYear(venueId);

    if (!cityYear) {
      error(404, 'Error retrieving current year for city.');
    }

    const starAwardYear = year > cityYear ? cityYear : year;

    const starAwardId = await getStarAwardId(venueId, starAwardYear);

    const newVisit: NewVisit = {
      user_id: user.id,
      venue_id: venueId,
      star_award_id: starAwardId,
      visit_date: visitDate,
    }

    const result = await addVisit(newVisit);

    if (result.success) {
      return { form }
    } else {
      error(500, result.message)
    }
  }
};

const visitFormSchema = z.object({
  venueId: z.number(),
  year: z.number(),
  month: z.number(),
  day: z.number().optional(),
});

const getVenues = async () => {
  const result: Venue[] = await db.select().from(venues)
  return result;
}

const getCityYear = async (venueId: number) => {
  const venueResult = await db.select().from(venues).where(eq(venues.venue_id, venueId));
  const cityId = venueResult[0]?.city_id;
  if (!cityId) return null;

  const cityResult = await db.select().from(cities).where(eq(cities.city_id, cityId));

  return cityResult[0]?.current_year;
}

const getStarAwardId = async (venueId: number, year: number) => {
  const result = await db.select().from(starAwards).where(
    and(
      eq(starAwards.venue_id, venueId),
      eq(starAwards.year, year),
    )
  );
  return result[0]?.star_award_id;
}

const addVisit = async (newVisit: NewVisit) => {
  try { 
    console.log(`Adding visit to ${newVisit.venue_id} on ${newVisit.visit_date} for ${newVisit.user_id}...`)
    const res = await db.insert(visits).values(newVisit).returning();
    const visit = res[0];
    console.log(`Visit ${visit.visit_id} added successfully!`)
    return {
      success: true,
      message: `Visit ${visit.visit_id} added successfully!`,
    }
  } catch (error) {
    console.error(error);
    let detail = '';
    if (error instanceof Error) detail = error.message;
    return {
      success: false,
      message: `Error adding visit to ${newVisit.venue_id}: ${detail}`,
    }
  }
}
