import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { regions } from '$lib/db/schema';
import { Region, NewRegion } from '$lib/db/types';


// GET /api/regions
export async function GET() {
  try {
    const result: Region[] = await db.select().from(regions);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// POST /api/regions
export async function POST({ request }) {
  try {
    const data = await request.formData();
    const regionName = data.get('name') as string;
    const region: NewRegion = { name: regionName };

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

    const updatedRegion = await db.update(regions)
      .set({ name: updatedRegionName })
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
    const deletedRegionId = await db.delete(regions).where(eq(regions.region_id, idToDelete)).returning({deletedId: regions.region_id});
    
    return new Response(JSON.stringify(deletedRegionId), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
