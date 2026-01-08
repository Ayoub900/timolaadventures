import type { MetadataRoute } from "next"
import prisma from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://timolaadventures.com"

    // Fetch all active circuits
    const circuits = await prisma.circuit.findMany({
        where: { active: true },
        select: { slug: true, updatedAt: true },
    })

    const circuitEntries = circuits.map((circuit) => ({
        url: `${baseUrl}/tours/${circuit.slug}`,
        lastModified: circuit.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }))

    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/tours`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.9,
        },
    ]

    return [...staticPages, ...circuitEntries]
}
