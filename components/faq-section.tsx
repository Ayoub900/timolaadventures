"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

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
  )
}

const faqs = [
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
]

export default function FAQSection() {
  return (
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
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </section>
  )
}
