import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

export const config = {
    theme: {
        logo: "https://next-auth.js.org/img/logo/logo-sm.png",
    },
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Mock user for MVP
                if (credentials?.email === "user@example.com" && credentials?.password === "password") {
                    return {
                        id: "1",
                        name: "Demo User",
                        email: "user@example.com",
                    }
                }
                return null
            },
        }),
    ],
    callbacks: {
        authorized({ request, auth }) {
            const { pathname } = request.nextUrl
            if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) return !!auth
            if (pathname === "/problems" || pathname.startsWith("/problems/")) return true // Allow public access to problems
            return true
        },
    },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
