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
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params



        const body = await request.json()
        console.log("Update data:", body)

        const tripRequest = await prisma.tripRequest.update({
            where: { id },
            data: {
                status: body.status,
                adminNotes: body.adminNotes,
            },
        })

        console.log("Trip request updated successfully")
        return NextResponse.json(tripRequest)
    } catch (error) {
        console.error("Error updating trip request:", error)
        return NextResponse.json({
            error: "Failed to update trip request",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
