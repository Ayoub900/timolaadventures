import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Instagram, MessageCircle, Map as MapIcon, Star } from "lucide-react"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-card border-t border-border">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-block w-full">
                            <Image
                                src="/full_logo_transparent.PNG"
                                alt="Timola Adventures"
                                width={150}
                                height={150}
                                className="h-32 mx-auto w-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Embark on unforgettable journeys through Morocco with our expertly guided tours and authentic local experiences.
                        </p>
                        <div className="flex space-x-4 align-center">
                            <Link href="https://www.instagram.com/timola_adventures?igsh=MW52dG4zbWZjeTV2ag==" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="https://wa.me/212623425783" target="_blank" className="text-muted-foreground hover:text-accent transition-colors">
                                <span className="sr-only">Whatsapp</span>
                                <MessageCircle className="h-5 w-5" />
                            </Link>
                            <Link href="https://www.tripadvisor.fr/UserReviewEdit-g488109-d32987585-Timola_Adventures-Imlil_Marrakech_Safi.html" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                                <span className="sr-only">TripAdvisor</span>
                                <Star className="h-5 w-5" />
                            </Link>
                            <Link href="https://maps.app.goo.gl/DXMnq3ASZmdorYgcA" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                                <span className="sr-only">Google Maps</span>
                                <MapIcon className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/tours" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Our Tours
                                </Link>
                            </li>
                            <li>
                                <Link href="/#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Popular Destinations */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Popular Destinations
                        </h3>
                        <ul className="space-y-2">
                            <li className="text-sm text-muted-foreground">Toubkal</li>
                            <li className="text-sm text-muted-foreground">Mgoun</li>
                            <li className="text-sm text-muted-foreground">Saghrou</li>
                            <li className="text-sm text-muted-foreground">Siroua</li>
                            <li className="text-sm text-muted-foreground">Sahara Desert</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Contact Us
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-primary" />
                                <span>Morocco</span>
                            </li>
                            <li className="flex items-center text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
                                <a href="tel:+212623425783" className="hover:text-primary transition-colors">
                                    +212 623 425 783
                                </a>
                            </li>
                            <li className="flex items-center text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
                                <a href="mailto:timolaadventures@gmail.com" className="hover:text-primary transition-colors">
                                    timolaadventures@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-border">
                    <div className="flex justify-center items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} Timola Adventures. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
