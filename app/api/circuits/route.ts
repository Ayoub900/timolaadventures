import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRateLimit } from "@/lib/limiter";

export async function GET(request: NextRequest) {
    const rateLimitError = await checkRateLimit("general");
    if (rateLimitError) return rateLimitError;


    try {
        const searchParams = request.nextUrl.searchParams
        const category = searchParams.get("category")
        const featured = searchParams.get("featured")

        const where: any = {
            active: true,
        }

        if (category) {
            where.category = category
        }

        if (featured === "true") {
            where.featured = true
        }

        const circuits = await prisma.circuit.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json(circuits)
    } catch (error) {
        console.error("Error fetching circuits:", error)
        return NextResponse.json({ error: "Failed to fetch circuits" }, { status: 500 })
    }
}
