import { NextRequest, NextResponse } from "next/server"
import { getTours } from "@/lib/tours"
import { checkRateLimit } from "@/lib/limiter"

export async function GET(request: NextRequest) {
    const rateLimitError = await checkRateLimit("general")
    if (rateLimitError) return rateLimitError

    try {
        const searchParams = request.nextUrl.searchParams
        const category = searchParams.get("category") ?? undefined
        const featuredParam = searchParams.get("featured")
        const featured = featuredParam === "true" ? true : undefined

        const tours = await getTours({ category, featured })
        return NextResponse.json(tours)
    } catch (error) {
        console.error("Error fetching tours:", error)
        return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 })
    }
}
