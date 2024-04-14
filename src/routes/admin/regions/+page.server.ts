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

    await addRegion(region);

    return { form }
  }
};

const getRegions = async () => {
  const result: Region[] = await db.select().from(regions)
  return result;
}

const addRegion = async (region: NewRegion) => {
  await db.insert(regions).values(region);
}
