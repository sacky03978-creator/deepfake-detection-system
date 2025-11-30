import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // Assuming db is exported from src/db/index.ts
import * as schema from "@/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite", // or "pg" or "mysql", checking db/index.ts will confirm
        schema: schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    // socialProviders: {
    //   github: {
    //     clientId: process.env.GITHUB_CLIENT_ID!,
    //     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    //   },
    // },
});
