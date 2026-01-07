import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
    return (
        <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=2070')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
                <div className="max-w-3xl">
                    <div className="flex items-center justify-center md:justify-start mb-2">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
                            <Sparkles className="w-4 h-4 mr-2 text-accent" />
                            <span className="text-sm font-medium text-accent">Authentic Moroccan Experiences</span>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold font-serif mb-2 leading-tight">
                        Discover the
                        <span className="block text-primary mt-2">Magic of Morocco</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl">
                        Embark on unforgettable journeys through imperial cities, Sahara dunes, and ancient medinas. Let us craft your perfect Moroccan adventure.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link href="/circuits">
                            <Button size="lg" className="text-lg px-8 group">
                                Explore Circuits
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/plan-trip">
                            <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                                Plan Custom Trip
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-12 bg-red-900 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-8 text-sm">
                        <div className="flex items-center">
                            <div className="flex -space-x-2 mr-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full border-2 border-background bg-primary/20"
                                    />
                                ))}
                            </div>
                            <span className="text-muted-foreground">
                                <strong className="text-foreground">500+</strong> Happy Travelers
                            </span>
                        </div>
                        <div className="text-muted-foreground">
                            ⭐ <strong className="text-foreground">4.9/5</strong> Rating
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
        </section>
    )
}
