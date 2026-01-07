import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/limiter";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const rateLimitError = await checkRateLimit("general");
        if (rateLimitError) return rateLimitError;

        const { id } = await params
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const blog = await prisma.blogPost.findUnique({
            where: { id },
        })

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 })
        }

        return NextResponse.json(blog)
    } catch (error) {
        console.error("Error fetching blog:", error)
        return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, createdAt, updatedAt, ...updateData } = body

        const blog = await prisma.blogPost.update({
            where: { id },
            data: updateData,
        })

        return NextResponse.json(blog)
    } catch (error) {
        console.error("Error updating blog:", error)
        return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
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

        await prisma.blogPost.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting blog:", error)
        return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
    }
}
