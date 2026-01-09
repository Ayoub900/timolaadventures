"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { Clock, ArrowRight, Heart } from "lucide-react"
import { PriceBadge } from "@/components/ui/price-badge"


interface Tour {
    id: string
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
    slug: string
}

export default function ToursPage() {
    const [tours, setTours] = useState<Tour[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTours()
    }, [])

    const fetchTours = async () => {
        try {
            const response = await fetch("/api/tours")
            if (response.ok) {
                const data = await response.json()
                setTours(data)
            }
        } catch (error) {
            console.error("Failed to fetch tours:", error)
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

                {/* Tours Grid */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce mr-1"></div>
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce mr-1 delay-75"></div>
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-150"></div>
                        </div>
                    ) : tours.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-md shadow-sm border border-gray-100">
                            <p className="text-gray-400">No journeys available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {tours.map((tour) => (
                                <Link key={tour.id} href={`/tours/${tour.slug}`} className="group block h-full">
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col border border-border/40 group-hover:border-primary/20">
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                            {tour.images[0] ? (
                                                <Image
                                                    src={tour.images[0]}
                                                    alt={tour.name}
                                                    fill
                                                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <span className="inline-block px-3 py-1 rounded-full bg-white/90 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-sm">
                                                    {tour.category}
                                                </span>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <div className="flex items-center justify-between text-sm font-medium">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tour.duration} Days</span>
                                                    <span className="font-bold text-lg text-secondary">€{tour.price}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                                                {tour.name}
                                            </h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-6 font-light">
                                                {tour.description}
                                            </p>
                                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                                                <span className="font-semibold text-primary group-hover:underline">View Details</span>
                                                <ArrowRight className="w-4 h-4 text-primary transform group-hover:translate-x-1 transition-transform" />
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
