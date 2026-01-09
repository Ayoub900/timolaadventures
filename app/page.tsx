"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { MapPin, ArrowRight, Star, Shield, Heart, Clock, Mail, Phone, Check, MousePointerClick, Settings2, CalendarCheck, Map, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CountryCodeSelect } from "@/components/ui/country-code-select"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"



const TESTIMONIALS = [
  {
    name: "Sophie Laurent",
    location: "France",
    date: "Nov 2025",
    text: "Our 7-day journey with Timola Adventures exceeded all expectations. Timola adventures's knowledge of the desert was incredible—he knew exactly where to find the best viewpoints and the most peaceful spots for our sunset camp. The organization was flawless, from the comfortable riads to the delicious traditional meals. An unforgettable experience!",
    stars: 5
  },
  {
    name: "James & Emily",
    location: "UK",
    date: "Oct 2025",
    text: "We booked the 10-day grand Morocco tour and it was the trip of a lifetime. Youssef was not just a driver but a true friend who shared his culture with genuine warmth. The attention to detail was remarkable—every hotel was charming, every meal was a feast, and every day brought new adventures. Highly recommend Timola Adventures!",
    stars: 5
  },
  {
    name: "Michael Brennan",
    location: "Australia",
    date: "Sep 2025",
    text: "As a solo traveler, I was looking for a safe and enriching way to explore Morocco. Timola Adventures delivered beyond my hopes. The desert camping experience was magical, and I felt like family from day one. The Berber hospitality is real, and this team lives and breathes it. Will definitely return!",
    stars: 5
  },
  {
    name: "Anna Schmidt",
    location: "Germany",
    date: "Aug 2025",
    text: "The Atlas Mountain trek organized by Timola was breathtaking. Our guide knew every trail, every village, and every story behind these magnificent peaks. The traditional lunch in a local family's home was a highlight—authentic, warm, and incredibly delicious. This was travel at its finest.",
    stars: 5
  },
  {
    name: "David & Maria",
    location: "Spain",
    date: "Jul 2025",
    text: "We've traveled extensively, but Morocco with Timola Adventures was special. The blend of adventure, culture, and relaxation was perfectly balanced. From the chaotic charm of the medinas to the serene silence of the desert, every moment was curated with care. Thank you for the memories!",
    stars: 5
  },
  {
    name: "Lisa Chen",
    location: "Canada",
    date: "Jun 2025",
    text: "Timola Adventures turned my dream Moroccan vacation into reality. The team's responsiveness, the quality of accommodations, and the depth of cultural experiences were exceptional. I particularly loved the cooking class in Fes and the stargazing in the Sahara. Pure magic!",
    stars: 5
  }
]

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white rounded-lg border transition-all duration-300 ${isOpen ? 'border-primary/20 shadow-md ring-1 ring-primary/5' : 'border-gray-100 shadow-sm hover:border-primary/10'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex items-center justify-between gap-4 group"
      >
        <span className={`font-semibold text-lg transition-colors ${isOpen ? 'text-primary' : 'text-foreground group-hover:text-primary/80'}`}>
          {question}
        </span>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

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

  const heroImages = [
    "/bg1.jpeg",
    "/bg2.jpeg",
    "/bg3.jpeg",
    "/bg4.jpeg",
    "/bg5.jpeg",
    "/bg6.jpeg",
  ]
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+212",
    subject: "",
    message: ""
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contactForm,
          phone: `${contactForm.countryCode} ${contactForm.phone}`
        }),
      })

      if (response.ok) {
        setSent(true)
        setContactForm({ name: "", email: "", phone: "", countryCode: "+212", subject: "", message: "" })
        setTimeout(() => setSent(false), 5000)
      } else {
        console.log(response.status)
        if (response.status === 429) alert("Too many requests. Please try again later.")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message.")
    } finally {
      setSending(false)
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
            {heroImages.map((image, index) => (
              <div
                key={image}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <Image
                  src={image}
                  alt={`Morocco Atlas Mountains Hiking ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
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
              Timola Adventures was founded by Mustapha Id Ali Ouhammou, a certified tour guide officially recognized by the Moroccan Ministry of Tourism. With deep knowledge of Morocco’s landscapes, culture, and history, Mustapha created Timola Adventures to offer authentic, safe, and memorable travel experiences for visitors from around the world.
              Built on a passion for exploration and cultural exchange, Timola Adventures specializes in immersive journeys that showcase the true spirit of Morocco. From majestic mountains and desert landscapes to traditional villages and hidden trails, each adventure is carefully designed to combine discovery, comfort, and authenticity.
              <br />
              <br />
              Our team is committed to professionalism, safety, and responsible tourism. We work closely with local communities to ensure that our tours respect local traditions and contribute positively to the regions we explore. Every experience is guided with care, insight, and a personal touch that reflects our founder’s dedication to excellence.
              <br />
              <br />
              At Timola Adventures, we believe that travel is more than visiting places, it’s about creating connections, sharing stories, and leaving with unforgettable memories. We invite you to explore Morocco with confidence, curiosity, and a true sense of adventure.
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-gray-50 text-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />

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

        {/* FAQ Section */}
        <section className="py-24 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-secondary/20 text-primary text-xs font-bold uppercase tracking-widest">
                Questions & Answers
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Planning Your Trip</h2>
              <p className="text-gray-500 font-light text-lg">Everything you need to know before your Moroccan adventure</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "What's the ideal time to visit Morocco?",
                  a: "The best periods are spring (March-May) and autumn (September-November) when temperatures are pleasant across the country. Summer can be hot, especially inland, but coastal areas remain comfortable. Winter offers snow-capped Atlas Mountains and milder desert temperatures—perfect for different kinds of adventures."
                },
                {
                  q: "How safe is traveling in Morocco?",
                  a: "Morocco is one of the safest destinations in Africa for tourists. The country has a strong tourism infrastructure and welcoming culture. Like anywhere, we recommend basic precautions in busy areas. With Timola Adventures, you'll always have local guides who know the lay of the land and ensure your comfort and safety."
                },
                {
                  q: "What's included in your tour packages?",
                  a: "Our packages typically include accommodation, transportation in comfortable vehicles, experienced local guides, most meals, and all activities mentioned in the itinerary. We provide detailed breakdowns for each tour so you know exactly what to expect. Flights and personal expenses are usually not included."
                },
                {
                  q: "Can you accommodate dietary requirements?",
                  a: "Absolutely! Moroccan cuisine offers wonderful variety. Just let us know your dietary needs—vegetarian, vegan, gluten-free, halal, or any allergies—and we'll ensure every meal is prepared with your requirements in mind. Our team and partner restaurants are experienced in catering to diverse needs."
                }
              ].map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-secondary/20 text-primary text-xs font-bold uppercase tracking-widest">
                Happy Travelers
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Stories From Our Adventures</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.slice(0, 3).map((testimonial, idx) => (
                <div key={idx} className="bg-card p-8 rounded-xl shadow-sm border border-border/50 flex flex-col items-center text-center group hover:shadow-md transition-all duration-300">
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <div className="grow flex flex-col">
                    <p className="text-lg font-light leading-relaxed mb-6 italic text-muted-foreground line-clamp-4">
                      &quot;{testimonial.text}&quot;
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-primary text-sm font-medium hover:underline mb-8 self-center">Read More</button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <div className="flex gap-1 mb-2">
                            {[...Array(testimonial.stars)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                            ))}
                          </div>
                          <DialogTitle className="text-2xl">{testimonial.name}</DialogTitle>
                          <DialogDescription>Reviewed on {testimonial.date} • {testimonial.location}</DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-wrap italic">
                          &quot;{testimonial.text}&quot;
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div>
                    <p className="font-bold text-secondary uppercase tracking-wider text-sm">{testimonial.name}</p>
                    <p className="text-white/50 text-xs mt-1">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section >

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
                />
              </div>
              {/* Add more partners here as they come */}
            </div>
          </div>
        </section>

        {/* Contact Section - Redesigned */}
        <section id="contact" className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Contact Info Text */}
              <div className="space-y-8 lg:sticky lg:top-10">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-secondary/20 text-primary text-xs font-bold uppercase tracking-widest">
                  Let&apos;s Talk
                </div>
                <h2 className="text-5xl font-black text-foreground tracking-tight leading-tight">
                  Your Adventure <br /> Starts Here.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  Ready to get lost in the magic of Morocco? Fill out the form, and let&apos;s start planning your dream escape today. We usually respond within 24 hours.
                </p>

                <div className="pt-8 border-t border-gray-100 space-y-6">
                  <a href="mailto:timolaadventures@gmail.com" className="flex items-center group">
                    <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mr-6 group-hover:border-primary group-hover:text-primary transition-colors">
                      <Mail className="w-5 h-5 text-gray-600 group-hover:text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Write to us</p>
                      <p className="text-foreground font-semibold text-lg">timolaadventures@gmail.com</p>
                    </div>
                  </a>
                  <a href="tel:+212623425783" className="flex items-center group">
                    <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mr-6 group-hover:border-primary group-hover:text-primary transition-colors">
                      <Phone className="w-5 h-5 text-gray-600 group-hover:text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Call us 24/7</p>
                      <p className="text-foreground font-semibold text-lg">+212 623 425 783</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Form Card - Solid and Clean */}
              <div className="bg-white rounded-3xl shadow-[0_2px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-8 md:p-12">
                {sent ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-4">Message Received!</h3>
                    <p className="text-muted-foreground text-lg">
                      Shukran! We&apos;ll be in touch shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">Send a Message</h3>
                      <p className="text-muted-foreground text-sm">Tell us about your travel plans or ask us anything.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</Label>
                        <Input
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          required
                          placeholder="Your full name"
                          className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20 h-12 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
                        <Input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          required
                          placeholder="hello@example.com"
                          className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20 h-12 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone</Label>
                      <Input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        required
                        placeholder="Your phone number"
                        className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20 h-12 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</Label>
                      <Textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                        placeholder="How can we help you plan your trip?"
                        className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20 min-h-[140px] resize-none p-4 rounded-lg"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-full text-lg font-bold shadow-lg shadow-primary/20 mt-4 transition-all hover:scale-[1.01]"
                    >
                      {sending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main >

      <Footer />
    </div >
  )
}
