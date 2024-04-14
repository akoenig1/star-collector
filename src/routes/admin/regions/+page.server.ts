import { error } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from "zod";

import { db } from '$lib/db/db';
import { NewRegion, Region } from "$lib/db/types";
import { regions } from '$lib/db/schema';
import { Actions } from "./$types";

export async function load() {
  const regions = await getRegions();
  const form = await superValidate(zod(regionFormSchema));

	if (regions) {
		return { 
      regions,
      form,
    };
	}

	error(404, 'Not found');
}

const regionFormSchema = z.object({
  regionName: z.string(),
  slug: z.string().optional(),
});

export const actions: Actions = {
  create: async ({ request }) => {
    const form = await superValidate(request, zod(regionFormSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { regionName, slug } = form.data;

    const region: NewRegion = {
      name: regionName,
      slug: slug ?? regionName.toLowerCase().replace(/\s/g, '-'),
    }

    const result = await addRegion(region);

    if (result.success) {
      return { form }
    } else {
      error(500, result.message)
    }
  }
};

const getRegions = async () => {
  const result: Region[] = await db.select().from(regions)
  return result;
}

const addRegion = async (region: NewRegion) => {
  try { 
    console.log(`Adding region ${region.name}...`)
    const res = await db.insert(regions).values(region).returning();
    const newRegion = res[0];
    console.log(`Region ${newRegion.name} added successfully!`)
    return {
      success: true,
      message: `Region ${newRegion.name} added successfully!`,
    }
  } catch (error) {
    console.error(error);
    let detail = '';
    if (error instanceof Error) detail = error.message;
    return {
      success: false,
      message: `Error adding region ${region.name}: ${detail}`,
    }
  }
}
