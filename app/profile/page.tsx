"use client"

import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, User as UserIcon, Calendar, MapPin, Trash2, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession()
    const [favorites, setFavorites] = useState<any[]>([])
    const [loadingFavs, setLoadingFavs] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login")
        }
    }, [session, isPending, router])

    useEffect(() => {
        if (session) {
            fetchFavorites()
        }
    }, [session])

    const fetchFavorites = async () => {
        try {
            const res = await fetch("/api/favorites")
            const data = await res.json()
            setFavorites(data)
        } catch (error) {
            console.error("Error fetching favorites:", error)
        } finally {
            setLoadingFavs(false)
        }
    }

    const removeFavorite = async (id: string) => {
        try {
            const res = await fetch(`/api/favorites/${id}`, { method: "DELETE" })
            if (res.ok) {
                setFavorites(favorites.filter(f => f.id !== id))
            }
        } catch (error) {
            console.error("Error removing favorite:", error)
        }
    }

    if (isPending || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Profile Header */}
                    <div className="bg-card rounded-2xl p-8 shadow-sm border border-border mb-12">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-4xl">
                                {session.user.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="text-center md:text-left space-y-2">
                                <h1 className="text-3xl font-bold text-foreground">{session.user.name}</h1>
                                <p className="text-muted-foreground">{session.user.email}</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                                    <div className="flex items-center text-sm text-muted-foreground bg-background rounded-full px-4 py-1 border border-border">
                                        <Calendar className="w-4 h-4 mr-2 text-accent" />
                                        Joined {new Date(session.user.createdAt).toLocaleDateString()}
                                    </div>
                                    {(session.user as any).role === 'admin' && (
                                        <div className="flex items-center text-sm font-medium text-primary bg-primary/5 rounded-full px-4 py-1 border border-primary/20">
                                            Administrator
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="ml-auto flex gap-4">
                                {(session.user as any).role === 'admin' && (
                                    <Link href="/dashboard">
                                        <Button variant="outline">Admin Dashboard</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Favorites Section */}
                    <div id="favorites" className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-foreground flex items-center">
                                <Heart className="w-6 h-6 mr-3 text-destructive fill-destructive" />
                                My Favorite Trips
                            </h2>
                            <p className="text-sm text-muted-foreground">{favorites.length} saved</p>
                        </div>

                        {loadingFavs ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : favorites.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {favorites.map((fav) => (
                                    <div key={fav.id} className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-border/50 relative">
                                        <button
                                            onClick={() => removeFavorite(fav.id)}
                                            className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                                            title="Remove from favorites"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            {fav.circuit.images?.[0] ? (
                                                <Image
                                                    src={fav.circuit.images[0]}
                                                    alt={fav.circuit.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-accent/5 flex items-center justify-center">
                                                    <MapPin className="w-8 h-8 text-accent/20" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{fav.circuit.category}</span>
                                                <span className="text-sm font-bold text-foreground">${fav.circuit.price}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-1">
                                                {fav.circuit.name}
                                            </h3>
                                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                                <span className="text-xs text-muted-foreground flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" /> {fav.circuit.duration} Days
                                                </span>
                                                <Link href={`/circuits/${fav.circuit.slug}`} className="text-primary text-sm font-bold flex items-center group/link">
                                                    View Details <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-card border-2 border-dashed border-border rounded-2xl py-20 text-center">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Heart className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">No favorites yet</h3>
                                <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
                                    Save your favorite trips to easily find them later and plan your dream trip.
                                </p>
                                <Link href="/circuits">
                                    <Button className="bg-primary hover:bg-primary/90 text-white">Explore Trips</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
