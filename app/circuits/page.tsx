"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { Clock, ArrowRight, Heart } from "lucide-react"
import { PriceBadge } from "@/components/ui/price-badge"


interface Circuit {
    id: string
    slug: string
    name: string
    tagline?: string
    description: string
    duration: number
    price: number
    originalPrice?: number
    isFrom?: boolean
    images: string[]
    highlights: string[]
    category: string
}

export default function CircuitsPage() {
    const [circuits, setCircuits] = useState<Circuit[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCircuits()
    }, [])

    const fetchCircuits = async () => {
        try {
            const response = await fetch("/api/circuits")
            if (response.ok) {
                const data = await response.json()
                setCircuits(data)
            }
        } catch (error) {
            console.error("Failed to fetch circuits:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
            <Header />

            <main className="flex-1">
                {/* Soft Hero */}
                <section className="bg-white pt-32 pb-16 px-4 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto text-center space-y-4">
                        <span className="text-accent font-medium text-sm tracking-widest uppercase">Discover Morocco</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Curated Journeys</h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
                            Handpicked itineraries designed to immerse you in the magic of the kingdom.
                        </p>
                    </div>
                </section>

                {/* Circuits Grid */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce mr-1"></div>
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce mr-1 delay-75"></div>
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-150"></div>
                        </div>
                    ) : circuits.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-md shadow-sm border border-gray-100">
                            <p className="text-gray-400">No journeys available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {circuits.map((circuit) => (
                                <Link key={circuit.id} href={`/circuits/${circuit.slug}`} className="group block">
                                    <div className="bg-white rounded-md overflow-hidden shadow-[0_2px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 h-full flex flex-col transform hover:-translate-y-1">
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                            {circuit.images[0] ? (
                                                <Image
                                                    src={circuit.images[0]}
                                                    alt={circuit.name}
                                                    fill
                                                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                                                    <span className="text-sm">No Image</span>
                                                </div>
                                            )}

                                            <div className="absolute top-4 left-4">
                                                <span className="inline-block px-3 py-1 rounded-md bg-white/95 text-xs font-semibold text-gray-700 uppercase tracking-wide shadow-sm border border-gray-100">
                                                    {circuit.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-8 flex flex-col flex-1">
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
                                                    <span>{circuit.duration} Days</span>
                                                    <div className="flex flex-col">
                                                        <div className="flex flex-col items-baseline">
                                                            <p className="text-xl text-foreground font-bold">${circuit.price} <span className="text-muted-foreground text-sm font-medium">/ person</span></p>
                                                            {circuit.originalPrice != null && (
                                                                <span className="text-sm text-muted-foreground line-through">${circuit.originalPrice}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight">
                                                    {circuit.name}
                                                </h3>
                                            </div>

                                            <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-1 font-light">
                                                {circuit.description}
                                            </p>

                                            <div className="flex items-center text-gray-900 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                                                View Itinerary <ArrowRight className="ml-2 h-4 w-4 text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    )
}
