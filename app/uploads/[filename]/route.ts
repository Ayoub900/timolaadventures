import { readFile } from "fs/promises"
import { join } from "path"
import { type NextRequest, NextResponse } from "next/server"
import { existsSync } from "fs"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params
        const filePath = join(process.cwd(), "public", "uploads", filename)

        if (!existsSync(filePath)) {
            return new NextResponse("File not found", { status: 404 })
        }

        const fileBuffer = await readFile(filePath)

        // Determine content type based on extension
        const ext = filename.split(".").pop()?.toLowerCase()
        const contentTypes: Record<string, string> = {
            "png": "image/png",
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "gif": "image/gif",
            "webp": "image/webp",
            "svg": "image/svg+xml"
        }

        const contentType = contentTypes[ext || ""] || "application/octet-stream"

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable"
            }
        })
    } catch (error) {
        console.error("Error serving file:", error)
        return new NextResponse("Error serving file", { status: 500 })
    }
}
