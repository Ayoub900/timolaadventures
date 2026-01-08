import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRateLimit } from "@/lib/limiter";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const rateLimitError = await checkRateLimit("general");
    if (rateLimitError) return rateLimitError;


    try {
        const { slug } = await params

        const tour = await prisma.circuit.findUnique({
            where: {
                slug,
            },
        })

        if (!tour) {
            return NextResponse.json({ error: "Tour not found" }, { status: 404 })
        }

        return NextResponse.json(tour)
    } catch (error) {
        console.error("Error fetching tour:", error)
        return NextResponse.json({ error: "Failed to fetch tour" }, { status: 500 })
    }
}
