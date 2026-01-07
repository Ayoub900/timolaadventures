"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function useAuth() {
    const { data: session, isPending: loading } = authClient.useSession()
    const router = useRouter()

    const logout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/")
                    router.refresh()
                },
            },
        })
    }

    // Map session.user to valid export for compatibility
    const user = session?.user ? {
        ...session.user,
        // Ensure id exists as per previous interface, better-auth has id
        id: session.user.id
    } : null

    return { user, loading, logout }
}
