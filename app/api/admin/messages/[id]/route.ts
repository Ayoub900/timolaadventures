import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/limiter";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const rateLimitError = await checkRateLimit("general");
    if (rateLimitError) return rateLimitError;

    try {

        const { id } = await params
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json()

        const message = await prisma.contactMessage.update({
            where: { id },
            data: { status: body.status },
        })

        return NextResponse.json(message)
    } catch (error) {
        console.error("Error updating message:", error)
        return NextResponse.json(
            { error: "Failed to update message" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.contactMessage.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting message:", error)
        return NextResponse.json(
            { error: "Failed to delete message" },
            { status: 500 }
        )
    }
}
