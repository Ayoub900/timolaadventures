"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const { data, error } = await authClient.signIn.email({
                email: formData.email,
                password: formData.password,
            }, {
                onSuccess: () => {
                    router.push("/dashboard")
                },
                onError: (ctx) => {
                    setError(ctx.error.message || "Login failed")
                }
            })
        } catch (err) {
            setError("An error occurred during login")
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center text-foreground mb-2">Welcome Back</h1>
                <p className="text-center text-muted-foreground mb-8">Sign in to your Timola Adventures account</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="youremail@example.com"
                            required
                            className="bg-background border-input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            className="bg-background border-input"
                        />
                    </div>

                    {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">{error}</div>}

                    <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <p className="text-center text-muted-foreground text-sm mt-6">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    )
}
