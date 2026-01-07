import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/limiter";

export async function GET(request: NextRequest) {
    try {
        const rateLimitError = await checkRateLimit("general");
        if (rateLimitError) return rateLimitError;

        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const skip = (page - 1) * limit

        const blogs = await prisma.blogPost.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        })

        const total = await prisma.blogPost.count()

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

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json()
        const blog = await prisma.blogPost.create({
            data: body,
        })

        return NextResponse.json(blog)
    } catch (error) {
        console.error("Error creating blog:", error)
        return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
    }
}
