import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { venues } from '$lib/db/schema';
import { Venue, NewVenue } from '$lib/db/types';


// GET /api/venues
// GET /api/venues/:id
export async function GET({ url }) {
  try {
    const params = url.searchParams;
    const idString = params.get('id') as string | null;
    const id = idString ? parseInt(idString) : null;

    const result: Venue[] = id 
      ? await db.select()
        .from(venues)
        .where(eq(venues.venue_id, id))
      : await db.select().from(venues);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// POST /api/venues
export async function POST({ request }) {
  try {
    const data = await request.formData();
    const venueName = data.get('name') as string;
    const cityId = data.get('city_id') as string;
    const slug = venueName.toLowerCase().replace(/\s/g, '-');
    const venue: NewVenue = { 
      name: venueName,
      city_id: parseInt(cityId),
      slug: slug,
    };

    const result = await db.insert(venues).values(venue).returning();

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// PUT /api/venues/:id
export async function PUT({ request, url }) {
  try {
    const params = url.searchParams;
    const idToUpdate = parseInt(params.get('id') as string);

    const data = await request.formData();
    const updatedVenueName = data.get('name') as string | null;
    const updatedCityId = data.get('city_id') as string | null;
    const updatedSlug = data.get('slug') as string | null;

    const updatedVenue = await db.update(venues)
      .set({
        // TODO: Are these ternaries safe? Testing seems to indicate that they are.
        name: updatedVenueName ? updatedVenueName : undefined,
        city_id: updatedCityId ? parseInt(updatedCityId) : undefined,
        slug: updatedSlug ? updatedSlug : undefined,
      })
      .where(eq(venues.venue_id, idToUpdate))
      .returning();
    
    return new Response(JSON.stringify(updatedVenue), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// DELETE /api/venues/:id
export async function DELETE({ url }) {
  try {
    const params = url.searchParams;
    const idToDelete = parseInt(params.get('id') as string);

    console.log(`Deleting venue with id: ${idToDelete}`);
    const deletedVenueId = await db.delete(venues)
      .where(eq(venues.venue_id, idToDelete))
      .returning({deletedId: venues.venue_id});
    
    return new Response(JSON.stringify(deletedVenueId), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
