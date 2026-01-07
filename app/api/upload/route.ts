import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/limiter";

export async function POST(request: NextRequest) {
    const rateLimitError = await checkRateLimit("strict");
    if (rateLimitError) return rateLimitError;

    try {
        const formData = await request.formData()
        const files = formData.getAll("files") as File[]

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 })
        }

        const uploadDir = join(process.cwd(), "public", "uploads")

        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (err) {
            // Directory might already exist
        }

        const uploadedUrls: string[] = []

        for (const file of files) {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)

            const timestamp = Date.now()
            const random = Math.random().toString(36).substring(7)
            const ext = file.name.split(".").pop()
            const filename = `${timestamp}-${random}.${ext}`
            const filepath = join(uploadDir, filename)

            await writeFile(filepath, buffer)
            uploadedUrls.push(`/uploads/${filename}`)
        }

        return NextResponse.json({ urls: uploadedUrls }, { status: 200 })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}
