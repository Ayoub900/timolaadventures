"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Clock, MapPin, Check, X, ArrowLeft, Info, Calendar, Plus, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CountryCodeSelect } from "@/components/ui/country-code-select"
import { Textarea } from "@/components/ui/textarea"
import { PriceBadge } from "@/components/ui/price-badge"

interface Tour {
    id: string
    slug: string
    name: string
    tagline?: string
    description: string
    duration: number
    price: number
    isFrom?: boolean
    originalPrice?: number
    images: string[]
    highlights: string[]
    included: string[]
    excluded: string[]
    optional: string[]
    itineraryGlance: string[]
    itineraryDetail: string // Legacy or HTML
    additionalInfo: string | null
    mapUrl: string | null
    category: string
    // New Fields
    pricingTiers?: { groupSize: string, winterPrice: string, summerPrice: string }[]
    itinerary?: { day: number, title: string, description: string, stats?: string }[]
    whatToBring?: string[]
    difficulty?: string[]
    bestTime?: string[]
}

const MOCK_PRICING: { groupSize: string, winterPrice: string, summerPrice: string }[] = [] // Removed usage

export default function TourDetailPage() {
    const params = useParams()
    const [tour, setTour] = useState<Tour | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Booking Form State
    const [booking, setBooking] = useState({
        travelDates: "",
        fullName: "",
        email: "",
        phone: "",
        countryCode: "+212",
        message: "",
        adults: 1,
        children: 0,
        infants: 0,
    })
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        if (params.slug) {
            fetchTour(params.slug as string)
        }
    }, [params.slug])

    const [guests, setGuests] = useState(1)

    const handleTravelerChange = (type: 'adults' | 'children' | 'infants', delta: number) => {
        setBooking(prev => {
            const newVal = Math.max(type === 'adults' ? 1 : 0, prev[type] + delta)
            return { ...prev, [type]: newVal }
        })
    }

    // Gallery / Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentImage, setCurrentImage] = useState(0)

    // Update total guests whenever traveler counts change
    useEffect(() => {
        setGuests(booking.adults + booking.children + booking.infants)
    }, [booking.adults, booking.children, booking.infants])

    const fetchTour = async (slug: string) => {
        try {
            const response = await fetch(`/api/tours/${slug}`)
            if (!response.ok) {
                throw new Error("Tour not found")
            }
            const data = await response.json()
            setTour(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load tour")
        } finally {
            setLoading(false)
        }
    }

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const response = await fetch("/api/trip-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...booking,
                    phone: `${booking.countryCode} ${booking.phone}`,
                    circuitName: tour?.name,
                    guests: guests,
                    adults: booking.adults,
                    children: booking.children,
                    infants: booking.infants,
                    message: booking.message,
                }),
            })

            if (response.ok) {
                setSubmitted(true)
            } else {
                const data = await response.json()
                alert(data.error || "Failed to send booking request. Please try again.")
            }
        } catch (error) {
            console.error("Booking error:", error)
            alert("Failed to submit booking.")
        } finally {
            setSubmitting(false)
        }
    }

    const renderRichText = (text: string) => {
        if (!text) return ""
        return text
            .replace(/^### (.*?)$/gm, "<h3 class='text-lg font-bold mt-6 mb-4'>$1</h3>")
            .replace(/^## (.*?)$/gm, "<h2 class='text-xl font-bold mt-8 mb-4'>$1</h2>")
            .replace(/^# (.*?)$/gm, "<h1 class='text-2xl font-bold mt-10 mb-6'>$1</h1>")
            .replace(/!\[(.*?)\]\((.*?)\)/g, "<img src='$2' alt='$1' class='rounded-lg my-2 max-w-full' />")
            .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-foreground'>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
            .replace(/__(.*?)__/g, "<u class='underline'>$1</u>")
            .replace(/~~(.*?)~~/g, "<s class='line-through'>$1</s>")
            .replace(/`(.*?)`/g, "<code class='bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono'>$1</code>")
            .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' class='text-primary underline hover:text-primary/80' target='_blank' rel='noopener noreferrer'>$1</a>")
            .replace(/^> (.*?)$/gm, "<blockquote class='border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4'>$1</blockquote>")
            .replace(/\n- /g, "<br />• ")
            .replace(/\n\d+\. /g, "<br />1. ")
            .replace(/\n/g, "<br />")
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background/50 flex flex-col font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
                        <p className="text-muted-foreground text-sm font-medium">Loading details...</p>
                    </div>
                </main>
            </div>
        )
    }

    if (error || !tour) {
        return (
            <div className="min-h-screen bg-background flex flex-col font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-foreground mb-2">Tour Not Found</h1>
                        <p className="text-muted-foreground mb-6">{error || "The requested tour could not be found."}</p>
                        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-8">
                            <Link href="/tours">Back to Tours</Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-accent selection:text-accent-foreground">
            <Header />

            <main className="flex-1">
                {/* Grand Hero Section */}
                <section className="relative h-[85vh] w-full flex items-end pb-20 justify-center">
                    {tour.images[0] ? (
                        <Image
                            src={tour.images[0]}
                            alt={tour.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-background flex items-center justify-center">
                            <span className="text-muted-foreground">No Image</span>
                        </div>
                    )}
                    {/* Cinematic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-black/10" />

                    <div className="relative z-10 max-w-7xl w-full mx-auto px-6">
                        <Link
                            href="/tours"
                            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors text-sm font-medium bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Adventures
                        </Link>

                        <div className="animate-fade-in-up space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-widest shadow-lg">
                                    {tour.category}
                                </span>
                                <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-widest shadow-lg">
                                    {tour.duration} Days
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] drop-shadow-md max-w-4xl">
                                {tour.name}
                            </h1>

                            {tour.tagline && (
                                <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light leading-relaxed drop-shadow-sm">
                                    {tour.tagline}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Content - Minimal aesthetic (no borders, soft shadows) */}
                        <div className="lg:col-span-8 space-y-12">

                            {/* Overview */}
                            <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <h2 className="text-2xl font-semibold text-foreground mb-6">Overview</h2>
                                <p className="text-muted-foreground leading-loose text-lg font-light">
                                    {tour.description}
                                </p>
                            </div>

                            {/* Itinerary - Minimal Timeline */}
                            {tour.itineraryDetail && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

                                    <h2 className="text-2xl font-semibold text-foreground mb-6">
                                        Detailed Itinerary
                                    </h2>
                                    <div
                                        className="prose prose-gray max-w-none text-muted-foreground leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: renderRichText(tour.itineraryDetail) }}
                                    />

                                </div>
                            )}

                            {/* Inclusions - Soft Lists */}
                            <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-secondary" /> Included
                                        </h3>
                                        <ul className="space-y-4">
                                            {tour.included.map((item, index) => (
                                                <li key={index} className="flex items-start text-gray-600 text-sm font-medium">
                                                    <Check className="w-4 h-4 mr-3 mt-0.5 text-secondary flex-shrink-0" />
                                                    <span className="text-muted-foreground">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-destructive/30" /> Not Included
                                        </h3>
                                        <ul className="space-y-4">
                                            {tour.excluded.map((item, index) => (
                                                <li key={index} className="flex items-start text-gray-500 text-sm">
                                                    <X className="w-4 h-4 mr-3 mt-0.5 text-destructive flex-shrink-0" />
                                                    <span className="text-muted-foreground">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Highlights */}
                            {tour.highlights.length > 0 && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">Highlights</h2>

                                    <ul className="space-y-4">
                                        {tour.highlights.map((item, index) => (
                                            <li key={index} className="flex items-start text-gray-500 text-sm">
                                                <Check className="w-4 h-4 mr-3 mt-0.5 text-secondary flex-shrink-0" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* What to Bring */}
                            {tour.whatToBring && tour.whatToBring.length > 0 && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">What to Bring</h2>
                                    <ul className="space-y-4">
                                        {tour.whatToBring.map((item, index) => (
                                            <li key={index} className="flex items-start text-gray-500 text-sm">
                                                <Check className="w-4 h-4 mr-3 mt-0.5 text-secondary flex-shrink-0" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Difficulty & Fitness */}
                            {tour.difficulty && tour.difficulty.length > 0 && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">Difficulty & Fitness</h2>
                                    <ul className="space-y-4">
                                        {tour.difficulty.map((item, index) => (
                                            <li key={index} className="flex items-start text-slate-600 text-sm font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 mr-3 flex-shrink-0" />
                                                <span className="text-muted-foreground leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Best Time to Climb */}
                            {tour.bestTime && tour.bestTime.length > 0 && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">Best Time to Climb</h2>
                                    <ul className="space-y-4">
                                        {tour.bestTime.map((item, index) => (
                                            <li key={index} className="flex items-start text-slate-600 text-sm font-medium">
                                                <Calendar className="w-4 h-4 mr-3 mt-0.5 text-secondary flex-shrink-0" />
                                                <span className="text-muted-foreground leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}


                            {/* Optional Activities */}
                            {tour.optional && tour.optional.length > 0 && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">Optional</h2>

                                    <ul className="space-y-4">
                                        {tour.optional.map((item, index) => (
                                            <li key={index} className="flex items-start text-gray-500 text-sm">
                                                <Plus className="w-4 h-4 mr-3 mt-0.5 text-primary flex-shrink-0" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Additional Info */}
                            {tour.additionalInfo && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">Important Notes</h2>
                                    <div
                                        className="prose prose-gray max-w-none text-muted-foreground leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: renderRichText(tour.additionalInfo) }}
                                    />
                                </div>
                            )}

                            {/* Gallery */}
                            {tour.images && tour.images.length > 0 && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">Gallery</h2>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {tour.images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => { setCurrentImage(idx); setLightboxOpen(true); }}
                                                className="relative overflow-hidden rounded-lg"
                                            >
                                                <Image
                                                    src={img}
                                                    alt={`${tour.name} image ${idx + 1}`}
                                                    width={600}
                                                    height={420}
                                                    className="object-cover w-full h-36"
                                                    draggable={false}
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                                        <DialogContent className="w-full bg-white/90 sm:max-w-5xl p-0 border-0 shadow-none">
                                            <div className="relative flex items-center justify-center p-4">
                                                {/* <DialogClose className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/40">
                                                <X className="w-5 h-5" />
                                            </DialogClose> */}

                                                <button
                                                    onClick={() => setCurrentImage((i) => (i - 1 + tour.images.length) % tour.images.length)}
                                                    aria-label="Previous image"
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2 hover:bg-black/40"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>

                                                <div className="max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
                                                    <Image
                                                        src={tour.images[currentImage]}
                                                        alt={`${tour.name} large`}
                                                        width={1600}
                                                        height={900}
                                                        className="object-contain mx-auto max-h-[80vh]"
                                                        draggable={false}
                                                    />
                                                </div>

                                                <button
                                                    onClick={() => setCurrentImage((i) => (i + 1) % tour.images.length)}
                                                    aria-label="Next image"
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2 hover:bg-black/40"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )}


                        </div>

                        {/* Sidebar - Sticky Booking Card */}
                        <div className="lg:col-span-4">
                            {/* Seasonal Pricing Table */}
                            {tour.pricingTiers && tour.pricingTiers.length > 0 && (
                                <div className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 mb-8">
                                    <div className="bg-primary/10 p-6 border-b border-primary/10">
                                        <h3 className="text-lg font-bold text-primary uppercase tracking-widest flex items-center justify-between">
                                            Tour Prices
                                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        {/* <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                            We have set some dates to allow solo travelers or couples who wish to travel in groups to join. Please click on Book Now to find out more.
                                        </p> */}

                                        <div className="overflow-hidden rounded-xl border border-gray-100">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50/50 divide-x divide-gray-100">
                                                        <th className="p-3 text-left font-bold text-gray-900 w-1/3">Group</th>
                                                        <th className="p-3 text-center font-bold text-gray-900 w-1/3">
                                                            <span className="block text-xs text-muted-foreground font-normal uppercase tracking-wider mb-1">Nov - April</span>
                                                            Winter
                                                        </th>
                                                        <th className="p-3 text-center font-bold text-gray-900 w-1/3">
                                                            <span className="block text-xs text-muted-foreground font-normal uppercase tracking-wider mb-1">May - Oct</span>
                                                            Summer
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {tour.pricingTiers.map((row, i) => (
                                                        <tr key={i} className="divide-x divide-gray-100 hover:bg-gray-50/50 transition-colors">
                                                            <td className="p-3 font-medium text-gray-700">{row.groupSize}</td>
                                                            <td className="p-3 text-center text-gray-600">{row.winterPrice}</td>
                                                            <td className="p-3 text-center text-gray-600">{row.summerPrice}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Booking Card */}
                            <div className="space-y-6">
                                {/* Price Card */}
                                <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 relative overflow-hidden">
                                    <div className="border-b border-gray-100 pb-6 mb-6">
                                        <div className="text-center">
                                            <span className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-2 block">Starting From</span>
                                            <div className="flex items-baseline justify-center gap-1">
                                                <PriceBadge price={tour.price} originalPrice={tour.originalPrice} from={tour.isFrom} className="text-4xl font-black text-primary" />
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-2">Per person sharing</p>
                                        </div>
                                    </div>

                                    {/* Booking Form Direct */}
                                    {submitted ? (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Check className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground mb-2">Request Sent!</h3>
                                            <p className="text-muted-foreground text-sm">
                                                Our team will get back to you shortly regarding <strong>{tour.name}</strong>.
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleBookingSubmit} className="space-y-5">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="travelDates" className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Start Date</Label>
                                                <Input
                                                    id="travelDates"
                                                    type="date"
                                                    value={booking.travelDates.split(" to ")[0] || ""}
                                                    onChange={(e) => {
                                                        const end = booking.travelDates.split(" to ")[1] || ""
                                                        setBooking({ ...booking, travelDates: `${e.target.value}${end ? ` to ${end}` : ""}` })
                                                    }}
                                                    required
                                                    className="bg-gray-50 border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20 h-11"
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider block">Travelers</Label>

                                                {/* Adults */}
                                                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold">Adults</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Ages 13+</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button type="button" onClick={() => handleTravelerChange('adults', -1)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:border-primary transition-colors hover:bg-primary/5">-</button>
                                                        <span className="w-4 text-center font-bold">{booking.adults}</span>
                                                        <button type="button" onClick={() => handleTravelerChange('adults', 1)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:border-primary transition-colors hover:bg-primary/5">+</button>
                                                    </div>
                                                </div>

                                                {/* Children */}
                                                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold">Children</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Ages 3-12</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button type="button" onClick={() => handleTravelerChange('children', -1)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:border-primary transition-colors hover:bg-primary/5">-</button>
                                                        <span className="w-4 text-center font-bold">{booking.children}</span>
                                                        <button type="button" onClick={() => handleTravelerChange('children', 1)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:border-primary transition-colors hover:bg-primary/5">+</button>
                                                    </div>
                                                </div>

                                                {/* Infants */}
                                                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold">Infants</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Under 3</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button type="button" onClick={() => handleTravelerChange('infants', -1)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:border-primary transition-colors hover:bg-primary/5">-</button>
                                                        <span className="w-4 text-center font-bold">{booking.infants}</span>
                                                        <button type="button" onClick={() => handleTravelerChange('infants', 1)} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:border-primary transition-colors hover:bg-primary/5">+</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="fullname" className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Full Name</Label>
                                                <Input
                                                    id="fullname"
                                                    value={booking.fullName}
                                                    onChange={(e) => setBooking({ ...booking, fullName: e.target.value })}
                                                    required
                                                    className="bg-gray-50 border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20 h-11"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="email" className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={booking.email}
                                                    onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                                                    required
                                                    className="bg-gray-50 border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20 h-11"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="phone" className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Phone</Label>
                                                <div className="flex gap-2">
                                                    <div className="w-[100px]">
                                                        <CountryCodeSelect
                                                            value={booking.countryCode}
                                                            onChange={(val) => setBooking({ ...booking, countryCode: val })}
                                                        />
                                                    </div>
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        value={booking.phone}
                                                        onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                                                        required
                                                        className="flex-1 bg-gray-50 border-gray-200 rounded-lg focus:border-primary focus:ring-primary/20 h-11"
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12 text-base font-bold shadow-lg shadow-primary/25 mt-2"
                                            >
                                                {submitting ? "Checking Availability..." : "Request Booking"}
                                            </Button>

                                            <p className="text-xs text-center text-muted-foreground mt-4">
                                                No payment required yet. We&apos;ll confirm your dates first.
                                            </p>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >

            <Footer />
        </div >
    )
}
