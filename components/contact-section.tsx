"use client"

import { useState, type FormEvent } from "react"
import { Mail, Phone, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactSection() {
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

  const handleContactSubmit = async (e: FormEvent) => {
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
  )
}
