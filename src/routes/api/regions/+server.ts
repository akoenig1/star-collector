import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { regions } from '$lib/db/schema';
import { Region, NewRegion } from '$lib/db/types';


// GET /api/regions
// GET /api/regions/:slug
export async function GET({ url }) {
  try {
    const params = url.searchParams;
    const slug = params.get('slug') as string | null;

    const result: Region[] = slug
      ? await db.select()
        .from(regions)
        .where(eq(regions.slug, slug))
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
    const slug = name.toLowerCase().replace(/\s/g, '-');
    const region: NewRegion = { name, slug };

    const result = await db.insert(regions).values(region).returning();

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// PUT /api/regions/:slug
export async function PUT({ request, url }) {
  try {
    const params = url.searchParams;
    const slugToUpdate = params.get('slug') as string;

    const data = await request.formData();
    const updatedRegionName = data.get('name') as string;
    const updatedSlugName = data.get('slug') as string;

    const updatedRegion = await db.update(regions)
      .set({ 
        name: updatedRegionName ? updatedRegionName : undefined,
        slug: updatedSlugName ? updatedSlugName : undefined,
      })
      // TODO: test if this is an issue
      .where(eq(regions.slug, slugToUpdate))
      .returning();
    
    return new Response(JSON.stringify(updatedRegion), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// DELETE /api/regions/:slug
export async function DELETE({ url }) {
  try {
    const params = url.searchParams;
    const slugToDelete = params.get('slug') as string;

    console.log(`Deleting region with id: ${slugToDelete}`);
    const deletedRegionId = await db.delete(regions)
      .where(eq(regions.slug, slugToDelete))
      .returning({deletedId: regions.region_id});
    
    return new Response(JSON.stringify(deletedRegionId), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
