import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRateLimit } from "@/lib/limiter";

// Validation helper
function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

function validatePhone(phone: string): boolean {
    // Basic phone validation - at least 10 digits
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone)
}

export async function POST(request: NextRequest) {
    const rateLimitError = await checkRateLimit("strict");
    if (rateLimitError) return rateLimitError;

    try {
        const body = await request.json()

        // Validate required fields
        const requiredFields = [
            "fullName",
            "email",
            "phone",
            "travelDates",
        ]

        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                )
            }
        }

        // Validate email format
        if (!validateEmail(body.email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
        }

        // Validate phone format
        if (!validatePhone(body.phone)) {
            return NextResponse.json({ error: "Invalid phone format" }, { status: 400 })
        }

        // Create trip request
        const tripRequest = await prisma.tripRequest.create({
            data: {
                circuitName: body.circuitName,
                travelDates: body.travelDates,
                guests: body.guests || 1,
                message: body.message,
                fullName: body.fullName,
                email: body.email,
                phone: body.phone,
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: "Trip request submitted successfully",
                id: tripRequest.id,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error creating trip request:", error)
        return NextResponse.json(
            { error: "Failed to submit trip request" },
            { status: 500 }
        )
    }
}
