import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from "zod";

import type { Actions } from "./$types";
import { db } from "$lib/db/db";
import { users } from "$lib/db/schema";
import { NewUser } from "$lib/db/types";

const signupFormSchema = z.object({
  email: z.string().email().min(3).max(320),
  password: z.string().min(6).max(255)
});

export const actions: Actions = {
	default: async (event) => {
    const { request } = event;
		const form = await superValidate(request, zod(signupFormSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { email, password } = form.data;

		const userId = generateId(15);
		const hashedPassword = await new Argon2id().hash(password);
    
    const user: NewUser = {
			id: userId,
			email: email,
			hashedPassword: hashedPassword
    }

		// TODO: check if email is already used
		await db.insert(users).values(user);

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		redirect(302, "/");
	}
};

export const load = (async () => {
  const form = await superValidate(zod(signupFormSchema));

  return { form };
});
