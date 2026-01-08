import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/limiter";

export async function GET(
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

        const tour = await prisma.circuit.findUnique({
            where: { id },
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

export async function PATCH(
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

        const body = await request.json()

        // Remove immutable fields
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, createdAt, updatedAt, ...updateData } = body

        const tour = await prisma.circuit.update({
            where: { id },
            data: updateData,
        })

        return NextResponse.json(tour)
    } catch (error) {
        console.error("Error updating tour:", error)
        return NextResponse.json({ error: "Failed to update tour" }, { status: 500 })
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

        await prisma.circuit.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting tour:", error)
        return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 })
    }
}
