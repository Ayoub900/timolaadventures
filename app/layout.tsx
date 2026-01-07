import type React from "react"
import type { Metadata } from "next"
import { Quicksand } from "next/font/google"
import "./globals.css"

import { WhatsAppButton } from "@/components/whatsapp-button"

const quicksand = Quicksand({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Timola Adventures | Morocco Tours & Travel",
  description: "Discover the magic of Morocco with expertly guided tours, desert adventures, and authentic local experiences. Your Moroccan adventure starts here.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.className} font-sans antialiased`}>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}
