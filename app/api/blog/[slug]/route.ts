import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRateLimit } from "@/lib/limiter"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const rateLimitError = await checkRateLimit("general");
    if (rateLimitError) return rateLimitError;

    try {
        const { slug } = await params
        const blog = await prisma.blogPost.findUnique({
            where: { slug, published: true },
        })

        if (!blog) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }

        return NextResponse.json(blog)
    } catch (error) {
        console.error("Error fetching blog post:", error)
        return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
    }
}
