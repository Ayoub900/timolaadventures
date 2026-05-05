"use client"

import { Star } from "lucide-react"
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

export default function TestimonialsSection() {
  return (
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
    </section>
  )
}
