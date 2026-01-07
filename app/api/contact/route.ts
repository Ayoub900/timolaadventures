import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRateLimit } from "@/lib/limiter";

export async function POST(request: NextRequest) {
    const rateLimitError = await checkRateLimit("strict");
    if (rateLimitError) return rateLimitError;

    try {
        const body = await request.json()
        const { name, email, phone, subject, message } = body

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email, and message are required" },
                { status: 400 }
            )
        }

        const contactMessage = await prisma.contactMessage.create({
            data: {
                name,
                email,
                phone,
                subject: subject || "",
                message,
                status: "new",
            },
        })

        return NextResponse.json(contactMessage, { status: 201 })
    } catch (error) {
        console.error("Error creating contact message:", error)
        return NextResponse.json(
            { error: "Failed to submit message" },
            { status: 500 }
        )
    }
}
