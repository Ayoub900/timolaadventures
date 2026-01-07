"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, MapPin, Phone, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navigation = [
        { name: "Home", href: "/" },
        { name: "Our Tours", href: "/circuits" },
        { name: "About Us", href: "/#about" },
        { name: "Contact", href: "/#contact" },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo (Left) */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
                                    TIMOLA
                                </span>
                                <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground -mt-1 group-hover:text-primary/70 transition-colors">
                                    Adventures
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation (Center) */}
                    <nav className="hidden md:flex items-center space-x-10">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors relative hover:text-primary/70"
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
                    <div className="space-y-1 px-4 pb-6 pt-4">
                        {navigation.map((item) => (
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
