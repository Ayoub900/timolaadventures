import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mongodb",
    }),
    emailAndPassword: {
        enabled: true
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 12 * 60 * 60, // Cache session for 12 hours
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
            },
        },
    },
});
