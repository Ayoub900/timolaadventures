"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, MapPin, Phone, Mail, ChevronDown } from "lucide-react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"

export function Header() {
    const [tours, setTours] = useState<any[]>([])
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const categories = [
        "Toubkal",
        "Mgoun",
        "Saghrou",
        "Siroua",
        "Sahara Desert",
        "Day trips"
    ]

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await fetch("/api/tours")
                if (response.ok) {
                    const data = await response.json()
                    setTours(data)
                }
            } catch (error) {
                console.error("Failed to fetch tours:", error)
            }
        }
        fetchTours()
    }, [])

    const navigation = [
        { name: "Home", href: "/" },
        // { name: "Our Tours", href: "/tours" },
        { name: "About Us", href: "/#about" },
        { name: "Contact", href: "/#contact" },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo (Left) */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center group">
                            <Image
                                src="/wide-logo-transparent.PNG"
                                alt="Timola Adventures"
                                width={180}
                                height={60}
                                className="h-12 w-auto object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation (Center) */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors relative"
                        >
                            Home
                        </Link>

                        {categories.map((category) => {
                            const categoryTours = tours.filter(t => t.category === category)
                            return (
                                <div
                                    key={category}
                                    className="relative group"
                                    onMouseEnter={() => setOpenDropdown(category)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <button
                                        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors"
                                    >
                                        {category}
                                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === category ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className={`absolute left-0 mt-0 w-64 bg-white border border-gray-100 shadow-xl rounded-xl py-4 z-50 transition-all duration-200 origin-top-left ${openDropdown === category ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                        <div className="px-4 py-2 border-b border-gray-50 mb-2">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-tighter">Explore {category}</p>
                                        </div>
                                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                                            {categoryTours.length > 0 ? (
                                                categoryTours.map((tour) => (
                                                    <Link
                                                        key={tour.id}
                                                        href={`/tours/${tour.slug}`}
                                                        className="block px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                                                    >
                                                        {tour.name}
                                                    </Link>
                                                ))
                                            ) : (
                                                <p className="px-4 py-2 text-xs text-muted-foreground">Coming soon...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {navigation.slice(1).map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors hover:text-primary/70"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Action (Right) */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Button asChild className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                            <Link href="/#contact">
                                Book Your Trip
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-gray-100 focus:outline-none"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="sr-only">Open menu</span>
                            {mobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl absolute w-full left-0 shadow-xl animate-in slide-in-from-top-2">
                    <div className="space-y-1 px-4 pb-6 pt-4 max-h-[80vh] overflow-y-auto">
                        <Link
                            href="/"
                            className="block rounded-lg px-4 py-3 text-base font-bold text-foreground hover:bg-gray-50 hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>

                        {categories.map((category) => {
                            const categoryTours = tours.filter(t => t.category === category)
                            const isExpanded = mobileOpenDropdown === category
                            return (
                                <div key={category} className="space-y-1">
                                    <button
                                        onClick={() => setMobileOpenDropdown(isExpanded ? null : category)}
                                        className="w-full flex items-center justify-between rounded-lg px-4 py-3 text-base font-bold text-foreground hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="flex items-center">
                                            <span className={`w-1.5 h-6 rounded-full bg-primary/30 mr-3 transition-all ${isExpanded ? 'h-8 bg-primary' : ''}`} />
                                            {category}
                                        </span>
                                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                                        <div className="pl-8 space-y-1 pr-4">
                                            {categoryTours.length > 0 ? (
                                                categoryTours.map((tour) => (
                                                    <Link
                                                        key={tour.id}
                                                        href={`/tours/${tour.slug}`}
                                                        className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors border-l border-gray-100"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {tour.name}
                                                    </Link>
                                                ))
                                            ) : (
                                                <p className="px-4 py-2 text-xs text-muted-foreground italic">Coming soon...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {navigation.slice(1).map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block rounded-lg px-4 py-3 text-base font-bold text-foreground hover:bg-gray-50 hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <Button asChild className="w-full rounded-full font-bold h-12">
                                <Link href="/#contact" onClick={() => setMobileMenuOpen(false)}>
                                    Book Your Trip
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
