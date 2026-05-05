"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import type { StaticImageData } from "next/image"
import { MapPin, ArrowRight, Star, Shield, Heart, Clock, MousePointerClick, Settings2, CalendarCheck, Map } from "lucide-react"
import { Button } from "@/components/ui/button"

import bg1 from "@/public/bg1.jpeg"
import bg2 from "@/public/bg2.jpeg"
import bg3 from "@/public/bg3.jpeg"
import bg4 from "@/public/bg4.jpeg"
import bg5 from "@/public/bg5.jpeg"
import bg6 from "@/public/bg6.jpeg"

const FAQSection = dynamic(() => import("@/components/faq-section"), { ssr: true })
const TestimonialsSection = dynamic(() => import("@/components/testimonials-section"), { ssr: true })
const ContactSection = dynamic(() => import("@/components/contact-section"), { ssr: true })

const heroImages: StaticImageData[] = [bg1, bg2, bg3, bg4, bg5, bg6]

interface Circuit {
  id: string
  slug: string
  name: string
  description: string
  duration: number
  price: number
  images: string[]
  category: string
}

export default function HomePage() {
  const [circuits, setCircuits] = useState<Circuit[]>([])
  const [loading, setLoading] = useState(true)
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchFeaturedCircuits()
  }, [])

  const fetchFeaturedCircuits = async () => {
    try {
      const response = await fetch("/api/tours?featured=true")
      if (response.ok) {
        const data = await response.json()
        setCircuits(data.slice(0, 3))
      }
    } catch (error) {
      console.error("Failed to fetch circuits:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background/50 flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            {/* LCP image rendered first with explicit priority/fetchpriority */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${0 === currentHeroIndex ? 'opacity-100' : 'opacity-0'}`}>
              <Image
                src={bg1}
                alt="Morocco Atlas Mountains Hiking 1"
                fill
                className="object-cover"
                sizes="100vw"
                quality={55}
                placeholder="blur"
                priority
                fetchPriority="high"
              />
            </div>
            {heroImages.slice(1).map((image, idx) => (
              <div
                key={idx + 1}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx + 1 === currentHeroIndex ? 'opacity-100' : 'opacity-0'}`}
              >
                <Image
                  src={image}
                  alt={`Morocco Atlas Mountains Hiking ${idx + 2}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  quality={55}
                  placeholder="empty"
                  loading="lazy"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
            <div className="max-w-3xl animate-fade-in-up space-y-8">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-white text-sm font-medium tracking-wide">Premium Atlas Adventures</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[1] drop-shadow-xl">
                DISCOVER <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">THE UNSEEN</span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed max-w-2xl drop-shadow-md">
                Trek through ancient valleys, conquer majestic peaks, and experience the raw beauty of Morocco's high atlas with expert local guides.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Button asChild size="lg" className="bg-white hover:bg-white/90 text-black px-10 h-14 text-lg rounded-full font-bold transition-all shadow-[0_10px_40px_-10px_rgba(255,255,255,0.5)] border-0 hover:scale-105">
                  <Link href="/tours">Start Your Journey</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-black/30 backdrop-blur-sm hover:bg-black/40 text-white border-white/20 px-10 h-14 text-lg rounded-full font-medium transition-all hover:scale-105">
                  <Link href="/#contact">Custom Plan</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Circuits */}
        <section className="py-24 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-secondary/20 text-primary text-xs font-bold uppercase tracking-widest">
                Curated Experiences
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                Popular Adventures
              </h2>
              <p className="text-lg text-muted-foreground font-light">
                Handpicked journeys loved by travelers worldwide
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce mr-1"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce mr-1 delay-75"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-150"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {circuits.map((circuit) => (
                  <Link key={circuit.id} href={`/tours/${circuit.slug}`} className="group block h-full">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col border border-border/40 group-hover:border-primary/20">
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        {circuit.images[0] ? (
                          <Image
                            src={circuit.images[0]}
                            alt={circuit.name}
                            fill
                            sizes="(max-width: 768px) calc(100vw - 32px), (max-width: 1280px) calc(33vw - 32px), 390px"
                            className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="inline-block px-3 py-1 rounded-full bg-white/90 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-sm">
                            {circuit.category}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <div className="flex items-center justify-between text-sm font-medium">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {circuit.duration} Days</span>
                            <span className="font-bold text-lg text-secondary">€{circuit.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                          {circuit.name}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-6 font-light">
                          {circuit.description}
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

            <div className="mt-12 text-center">
              <Button asChild className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                <Link href="/tours">
                  View All Tours
                </Link>
              </Button>
            </div>

          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-secondary/20 text-primary text-xs font-bold uppercase tracking-widest">
                Simple Process
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground font-light">
                From dreaming to experiencing in four seamless steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 relative">
              {[
                {
                  step: "01",
                  title: "Browse",
                  desc: "Explore our collection of handcrafted Morocco adventures.",
                  icon: MousePointerClick
                },
                {
                  step: "02",
                  title: "Customize",
                  desc: "Tailor every aspect with our team, pace and preferences.",
                  icon: Settings2
                },
                {
                  step: "03",
                  title: "Book",
                  desc: "Secure your adventure with flexible options instantly.",
                  icon: CalendarCheck
                },
                {
                  step: "04",
                  title: "Experience",
                  desc: "Relax and immerse yourself while we handle every detail.",
                  icon: Map
                }
              ].map((item, idx) => (
                <div key={idx} className="relative flex flex-col items-center text-center group">
                  <div className="relative w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group-hover:border-primary/20 group-hover:shadow-[0_20px_40px_rgba(var(--primary-rgb),0.08)] transition-all duration-500 transform group-hover:-translate-y-2">
                    <div className="absolute inset-2 rounded-[22px] bg-primary/5" />
                    <item.icon className="w-10 h-10 text-primary" />
                    <div className="absolute -top-3 -right-3 w-9 h-9 bg-primary text-white rounded-2xl flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-gray-500 text-sm font-light leading-relaxed max-w-[200px]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-20">
              <Button asChild size="lg" className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                <Link href="/tours">Start Exploring Now</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Philosophy / Intro */}
        <section id="about" className="py-24 bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-secondary/20 text-primary text-xs font-bold uppercase tracking-widest mb-2">
              About Us
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Travel That Transforms</h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              Timola Adventures was founded by Mustapha Id Ali Ouhammou, a certified tour guide officially recognized by the Moroccan Ministry of Tourism. With deep knowledge of Morocco's landscapes, culture, and history, Mustapha created Timola Adventures to offer authentic, safe, and memorable travel experiences for visitors from around the world.
              Built on a passion for exploration and cultural exchange, Timola Adventures specializes in immersive journeys that showcase the true spirit of Morocco. From majestic mountains and desert landscapes to traditional villages and hidden trails, each adventure is carefully designed to combine discovery, comfort, and authenticity.
              <br />
              <br />
              Our team is committed to professionalism, safety, and responsible tourism. We work closely with local communities to ensure that our tours respect local traditions and contribute positively to the regions we explore. Every experience is guided with care, insight, and a personal touch that reflects our founder's dedication to excellence.
              <br />
              <br />
              At Timola Adventures, we believe that travel is more than visiting places, it's about creating connections, sharing stories, and leaving with unforgettable memories. We invite you to explore Morocco with confidence, curiosity, and a true sense of adventure.
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-gray-50 text-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 0,transparent 20px),repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 0,transparent 20px)', backgroundSize: '20px 20px' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-8 text-center lg:text-left">
              <div className="max-w-2xl mx-auto lg:mx-0">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-secondary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                  The Timola Difference
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight">
                  More Than Just A Trip,<br />It&apos;s Your Story.
                </h2>
              </div>
              <p className="max-w-md text-gray-600 text-lg leading-relaxed mx-auto lg:mx-0">
                We don&apos;t sell packages; we share our home. Experience Morocco with the warmth of family and the expertise of locals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Safety First",
                  desc: "Rigorous standards and 24/7 support throughout your journey.",
                  color: "bg-blue-100 text-blue-600"
                },
                {
                  icon: Heart,
                  title: "Local Heart",
                  desc: "Guides who treat you like family, not just a customer.",
                  color: "bg-red-100 text-red-600"
                },
                {
                  icon: Star,
                  title: "Excellence",
                  desc: "Top-tier accommodations and hand-picked experiences.",
                  color: "bg-yellow-100 text-yellow-600"
                },
                {
                  icon: MapPin,
                  title: "Access",
                  desc: "Exclusive access to hidden gems most tourists never see.",
                  color: "bg-green-100 text-green-600"
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group">
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FAQSection />

        <TestimonialsSection />

        {/* Partners Section */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Trusted Partners</h3>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12">
              <div className="relative h-20 w-48 transition-transform hover:scale-105">
                <Image
                  src="/partners/la-belle-roulotte.jpg"
                  alt="La Belle Roulotte"
                  fill
                  className="object-contain"
                  sizes="192px"
                  quality={70}
                />
              </div>
              {/* Add more partners here as they come */}
            </div>
          </div>
        </section>

        <ContactSection />
      </main >

      <Footer />
    </div >
  )
}
