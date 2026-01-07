import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/limiter";

export async function GET(request: NextRequest) {
    const rateLimitError = await checkRateLimit("general");
    if (rateLimitError) return rateLimitError;

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: session.user.id },
            include: {
                circuit: true,
            },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(favorites)
    } catch (error) {
        console.error("Error fetching favorites:", error)
        return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { circuitId } = await request.json()

        if (!circuitId) {
            return NextResponse.json({ error: "Circuit ID is required" }, { status: 400 })
        }

        // Check if already favorited
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_circuitId: {
                    userId: session.user.id,
                    circuitId: circuitId,
                },
            },
        })

        if (existing) {
            return NextResponse.json({ message: "Already favorited" }, { status: 200 })
        }

        const favorite = await prisma.favorite.create({
            data: {
                userId: session.user.id,
                circuitId: circuitId,
            },
        })

        return NextResponse.json(favorite, { status: 201 })
    } catch (error) {
        console.error("Error creating favorite:", error)
        return NextResponse.json({ error: "Failed to create favorite" }, { status: 500 })
    }
}
