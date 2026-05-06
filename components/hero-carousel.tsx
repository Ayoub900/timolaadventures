"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { StaticImageData } from "next/image"
import bg1 from "@/public/bg1.jpeg"
import bg2 from "@/public/bg2.jpeg"
import bg3 from "@/public/bg3.jpeg"
import bg4 from "@/public/bg4.jpeg"
import bg5 from "@/public/bg5.jpeg"
import bg6 from "@/public/bg6.jpeg"

const heroImages: StaticImageData[] = [bg1, bg2, bg3, bg4, bg5, bg6]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  // Start with only the LCP image and the next one loaded
  const [mounted, setMounted] = useState<Set<number>>(new Set([0, 1]))

  useEffect(() => {
    let currentIdx = 0
    const interval = setInterval(() => {
      const prev = currentIdx
      const next = (prev + 1) % heroImages.length
      const afterNext = (next + 1) % heroImages.length

      currentIdx = next
      setCurrent(next)
      // Preload next and the image after it while transitioning
      setMounted((m) => new Set([...m, next, afterNext]))

      // Unmount the outgoing image after the 1s CSS transition finishes
      setTimeout(() => {
        setMounted((m) => {
          const s = new Set(m)
          s.delete(prev)
          return s
        })
      }, 1100)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 z-0">
      {heroImages.map((image, idx) => {
        if (!mounted.has(idx)) return null
        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Morocco Atlas Mountains Hiking ${idx + 1}`}
              fill
              className="object-cover"
              sizes="100vw"
              quality={55}
              placeholder={idx === 0 ? "blur" : "empty"}
              priority={idx === 0}
              fetchPriority={idx === 0 ? "high" : "auto"}
            />
          </div>
        )
      })}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
    </div>
  )
}
