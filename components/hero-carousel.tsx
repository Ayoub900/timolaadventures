"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import bg1 from "@/public/bg1.jpeg"
import bg2 from "@/public/bg2.jpeg"
import bg3 from "@/public/bg3.jpeg"
import bg4 from "@/public/bg4.jpeg"
import bg5 from "@/public/bg5.jpeg"
import bg6 from "@/public/bg6.jpeg"

// Overlay images that crossfade on top of the always-visible bg1
const overlayImages = [bg2, bg3, bg4, bg5, bg6]

export function HeroCarousel() {
  // 0 = bg1 visible, 1-5 = overlayImages[current-1] visible on top
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState<Set<number>>(new Set())

  useEffect(() => {
    let currentIdx = 0
    const interval = setInterval(() => {
      const next = (currentIdx + 1) % 6
      const afterNext = (next + 1) % 6
      currentIdx = next
      setCurrent(next)

      // Preload upcoming overlays (skip index 0 since that's bg1, always rendered)
      setMounted((m) => {
        const s = new Set(m)
        if (next > 0) s.add(next - 1)
        if (afterNext > 0) s.add(afterNext - 1)
        return s
      })
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 z-0 bg-[#1a1f2e]">
      {/* Base layer: bg1 — always visible, no transition wrapper */}
      <Image
        src={bg1}
        alt="Morocco Atlas Mountains Hiking 1"
        fill
        className="object-cover"
        sizes="100vw"
        quality={55}
        priority
        fetchPriority="high"
      />

      {/* Overlay carousel: bg2-bg6 fade in on top of bg1 */}
      {overlayImages.map((image, idx) => {
        if (!mounted.has(idx)) return null
        const isVisible = current === idx + 1
        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Morocco Atlas Mountains Hiking ${idx + 2}`}
              fill
              className="object-cover"
              sizes="100vw"
              quality={55}
              loading="lazy"
            />
          </div>
        )
      })}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
    </div>
  )
}