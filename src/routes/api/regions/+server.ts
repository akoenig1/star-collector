import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { regions } from '$lib/db/schema';
import { Region, NewRegion } from '$lib/db/types';


// GET /api/regions
// GET /api/regions/:id
export async function GET({ url }) {
  try {
    const params = url.searchParams;
    const idString = params.get('id') as string | null;
    const id = idString ? parseInt(idString) : null;

    const result: Region[] = id
      ? await db.select()
        .from(regions)
        .where(eq(regions.region_id, id))
      : await db.select().from(regions);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// POST /api/regions
export async function POST({ request }) {
  try {
    const data = await request.formData();
    const name = data.get('name') as string;
    const slug = data.get('slug') as string ?? name.toLowerCase().replace(/\s/g, '-');
    const region: NewRegion = { name, slug };

    const result = await db.insert(regions).values(region).returning();

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// PUT /api/regions/:id
export async function PUT({ request, url }) {
  try {
    const params = url.searchParams;
    const idToUpdate = parseInt(params.get('id') as string);

    const data = await request.formData();
    const updatedRegionName = data.get('name') as string;
    const updatedSlugName = data.get('slug') as string;

    const updatedRegion = await db.update(regions)
      .set({ 
        name: updatedRegionName ? updatedRegionName : undefined,
        slug: updatedSlugName ? updatedSlugName : undefined,
      })
      // TODO: test if this is an issue
      .where(eq(regions.region_id, idToUpdate))
      .returning();
    
    return new Response(JSON.stringify(updatedRegion), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// DELETE /api/regions/:id
export async function DELETE({ url }) {
  try {
    const params = url.searchParams;
    const idToDelete = parseInt(params.get('id') as string);

    console.log(`Deleting region with id: ${idToDelete}`);
    const deletedRegionId = await db.delete(regions)
      .where(eq(regions.region_id, idToDelete))
      .returning({deletedId: regions.region_id});
    
    return new Response(JSON.stringify(deletedRegionId), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
