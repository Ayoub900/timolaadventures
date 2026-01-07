"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { ShieldAlert } from "lucide-react"

export default function AccessDeniedPage() {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-lg shadow-lg text-center border border-border">
                <div className="mx-auto h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
                    <ShieldAlert className="h-8 w-8 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
                    <p className="text-muted-foreground">
                        You do not have permission to access the admin dashboard.
                    </p>
                </div>

                {user && (
                    <div className="bg-muted/50 p-4 rounded-md border border-border">
                        <p className="text-sm text-muted-foreground mb-1">Logged in as:</p>
                        <p className="font-medium text-foreground">{user.email}</p>
                    </div>
                )}

                <div className="space-y-4 pt-4">
                    <Button
                        onClick={() => logout()}
                        variant="destructive"
                        className="w-full"
                    >
                        Sign Out
                    </Button>

                    <div className="text-sm">
                        <Link href="/" className="text-muted-foreground hover:text-foreground">
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
