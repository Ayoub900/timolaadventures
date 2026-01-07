import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/limiter";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const rateLimitError = await checkRateLimit("general");
    if (rateLimitError) return rateLimitError;

    const { id } = await params
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const favorite = await prisma.favorite.findUnique({
            where: { id: id },
        })

        if (!favorite) {
            return NextResponse.json({ error: "Favorite not found" }, { status: 404 })
        }

        if (favorite.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        await prisma.favorite.delete({
            where: { id: id },
        })

        return NextResponse.json({ message: "Favorite removed" })
    } catch (error) {
        console.error("Error deleting favorite:", error)
        return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
    }
}
