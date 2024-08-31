import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { Argon2id } from "oslo/password";
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from "zod";

import type { Actions } from "./$types";
import { db } from "$lib/db/db";
import { users } from "$lib/db/schema";
import { eq } from "drizzle-orm";
import { User } from "$lib/db/types";

const loginFormSchema = z.object({
  email: z.string().email().min(3).max(320),
  password: z.string().min(6).max(255)
});

export const actions: Actions = {
	default: async (event) => {
		const { request } = event;
		const form = await superValidate(request, zod(loginFormSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { email, password } = form.data;

		const existingUser: User = (await db.select()
      .from(users)
			.where(eq(users.email, email.toLowerCase())))[0];
		if (!existingUser) {
			// NOTE:
			// Returning immediately allows malicious actors to figure out valid emails from response times,
			// allowing them to only focus on guessing passwords in brute-force attacks.
			// As a preventive measure, you may want to hash passwords even for invalid emails.
			// However, valid emails can already be revealed with the signup page among other methods.
			// It will also be much more resource intensive.
			// Since protecting against this is non-trivial,
			// it is crucial your implementation is protected against brute-force attacks with login throttling etc.
			// If emails are public, you may outright tell the user that the email is invalid.
			return setError(form, 'email', 'Email does not exist.');
		}

		const validPassword = await new Argon2id().verify(existingUser.hashedPassword, password);
		if (!validPassword) {
			return setError(form, 'password', 'Invalid password.');
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

    existingUser.isAdmin
      ? redirect(302, "/admin") 
      : redirect(302, "/");
	}
};

export const load = (async () => {
  const form = await superValidate(zod(loginFormSchema));

  return { form };
});
