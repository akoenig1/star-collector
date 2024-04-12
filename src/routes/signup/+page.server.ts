import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

import type { Actions } from "./$types";
import { db } from "$lib/db/db";
import { users } from "$lib/db/schema";
import { NewUser } from "$lib/db/types";

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get("email");
		const password = formData.get("password");
		// email must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
		// keep in mind some database (e.g. mysql) are case insensitive
		if (
			typeof email !== "string" ||
			email.length < 3 ||
			email.length > 31 ||
			!/^[a-z0-9_-]+$/.test(email)
		) {
			return fail(400, {
				message: "Invalid email"
			});
		}
		if (typeof password !== "string" || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: "Invalid password"
			});
		}

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