import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { cities } from '$lib/db/schema';
import { City, NewCity } from '$lib/db/types';


// GET /api/cities
// GET /api/cities/:id
export async function GET({ url }) {
  try {
    const params = url.searchParams;
    const idString = params.get('id') as string | null;
    const id = idString ? parseInt(idString) : null;

    const result: City[] = id
      ? await db.select()
        .from(cities)
        .where(eq(cities.city_id, id))
      : await db.select().from(cities);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// POST /api/cities
export async function POST({ request }) {
  try {
    const data = await request.formData();
    const cityName = data.get('name') as string;
    const regionId = data.get('region_id') as string;
    const currentYear = data.get('current_year') as string;
    const slug = cityName.toLowerCase().replace(/\s/g, '-');
    
    const city: NewCity = { 
      name: cityName,
      region_id: parseInt(regionId),
      current_year: parseInt(currentYear),
      slug: slug,
    };

    const result = await db.insert(cities).values(city).returning();

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// PUT /api/cities/:id
export async function PUT({ request, url }) {
  try {
    const params = url.searchParams;
    const idToUpdate = parseInt(params.get('id') as string);

    const data = await request.formData();
    const updatedCityName = data.get('name') as string | null;
    const updatedRegionId = data.get('region_id') as string | null;
    const updatedCurrentYear = data.get('current_year') as string | null;
    const updatedCitySlug = data.get('slug') as string | null;

    const updatedCity = await db.update(cities)
      .set({ 
        name: updatedCityName ? updatedCityName : undefined,
        region_id: updatedRegionId ? parseInt(updatedRegionId) : undefined,
        current_year: updatedCurrentYear ? parseInt(updatedCurrentYear) : undefined,
        slug: updatedCitySlug ? updatedCitySlug : undefined,
      })
      .where(eq(cities.city_id, idToUpdate))
      .returning();
    
    return new Response(JSON.stringify(updatedCity), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// DELETE /api/cities/:id
export async function DELETE({ url }) {
  try {
    const params = url.searchParams;
    const idToDelete = parseInt(params.get('id') as string);

    console.log(`Deleting city with id: ${idToDelete}`);
    const deletedCityId = await db.delete(cities)
      .where(eq(cities.city_id, idToDelete))
      .returning({deletedId: cities.city_id});
    
    return new Response(JSON.stringify(deletedCityId), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
