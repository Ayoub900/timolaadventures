import { checkRateLimit } from "@/lib/limiter";
import prisma from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const rateLimitError = await checkRateLimit("general");
    if (rateLimitError) return rateLimitError;


    try {
        const { id } = await params
        const body = await request.json()
        const { status } = body

        console.log("[v0] Updating contact message status:", id, status)
        const updatedMessage = await prisma.contactMessage.update({
            where: { id },
            data: { status },
        })

        return NextResponse.json(updatedMessage)
    } catch (error) {
        console.error("Failed to update contact message:", error)
        return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const rateLimitError = await checkRateLimit("general");
    if (rateLimitError) return rateLimitError;


    try {
        const { id } = await params

        await prisma.contactMessage.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to delete contact message:", error)
        return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
    }
}
