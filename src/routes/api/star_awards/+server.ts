import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { starAwards } from '$lib/db/schema';
import { StarAward, NewStarAward } from '$lib/db/types';


// GET /api/star_awards
// GET /api/star_awards/:id
export async function GET({ url }) {
  try {
    const params = url.searchParams;
    const idString = params.get('id') as string | null;
    const id = idString ? parseInt(idString) : null;

    const result: StarAward[] = id
      ? await db.select()
        .from(starAwards)
        .where(eq(starAwards.star_award_id, id))
      : await db.select().from(starAwards);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// POST /api/star_awards
export async function POST({ request }) {
  try {
    const data = await request.formData();
    const year = data.get('year') as string;
    const venueId = data.get('venue_id') as string;
    const stars = data.get('stars') as string;

    const starAward: NewStarAward = { 
      year: parseInt(year),
      venue_id: parseInt(venueId),
      stars: parseInt(stars),
    };

    const result = await db.insert(starAwards).values(starAward).returning();

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// PUT /api/star_awards/:id
export async function PUT({ request, url }) {
  try {
    const params = url.searchParams;
    const idToUpdate = parseInt(params.get('id') as string);

    const data = await request.formData();
    const updatedYear = data.get('year') as string | null;
    const updatedVenueId = data.get('venue_id') as string | null;
    const updatedStars = data.get('stars') as string | null;

    const updatedStarAward = await db.update(starAwards)
      .set({ 
        year: updatedYear ? parseInt(updatedYear) : undefined,
        venue_id: updatedVenueId ? parseInt(updatedVenueId) : undefined,
        stars: updatedStars ? parseInt(updatedStars) : undefined,
      })
      .where(eq(starAwards.star_award_id, idToUpdate))
      .returning();
    
    return new Response(JSON.stringify(updatedStarAward), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// DELETE /api/star_awards/:id
export async function DELETE({ url }) {
  try {
    const params = url.searchParams;
    const idToDelete = parseInt(params.get('id') as string);

    console.log(`Deleting star award with id: ${idToDelete}`);
    const deletedStarAwardId = await db.delete(starAwards)
      .where(eq(starAwards.star_award_id, idToDelete))
      .returning({deletedId: starAwards.star_award_id});
    
    return new Response(JSON.stringify(deletedStarAwardId), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
