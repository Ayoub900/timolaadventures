import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRateLimit } from "@/lib/limiter"

export async function GET(request: NextRequest) {
    const rateLimitError = await checkRateLimit("general");
    if (rateLimitError) return rateLimitError;

    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "9")
        const tag = searchParams.get("tag")
        const skip = (page - 1) * limit

        const where = {
            published: true,
            ...(tag ? { tags: { has: tag } } : {})
        }

        const blogs = await prisma.blogPost.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        })

        const total = await prisma.blogPost.count({ where })

        return NextResponse.json({
            data: blogs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        })
    } catch (error) {
        console.error("Error fetching blogs:", error)
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
    }
}
