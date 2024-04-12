import { error } from "@sveltejs/kit";

import { db } from '$lib/db/db';
import { User } from "$lib/db/types";
import { users } from '$lib/db/schema';

export async function load() {
  const users = await getUsers();

	if (users) {
		return { 
      users: users,
    };
	}

	error(404, 'Not found');
}

const getUsers = async () => {
  const result: User[] = await db.select()
    .from(users)

  return result;
}
