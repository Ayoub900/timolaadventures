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

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";
        const skip = (page - 1) * limit;

        const where = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' as any } },
                { category: { contains: search, mode: 'insensitive' as any } },
            ]
        } : {};

        // Fetch paginated tours
        const [tours, total] = await Promise.all([
            prisma.circuit.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.circuit.count({ where })
        ]);

        return NextResponse.json({
            tours,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching tours:", error)
        return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 })
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

        // Validate required fields
        if (!body.name || !body.slug || !body.description || !body.duration || !body.price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Create tour
        const tour = await prisma.circuit.create({
            data: {
                slug: body.slug,
                name: body.name,
                tagline: body.tagline,
                description: body.description,
                duration: parseInt(body.duration),
                category: body.category,
                price: parseFloat(body.price),
                originalPrice: body.originalPrice !== undefined && body.originalPrice !== null ? parseFloat(body.originalPrice) : undefined,
                isFrom: body.isFrom || false,
                images: body.images || [],
                highlights: body.highlights || [],
                included: body.included || [],
                excluded: body.excluded || [],
                optional: body.optional || [],
                itineraryGlance: body.itineraryGlance || [],
                itineraryDetail: body.itineraryDetail || "",
                additionalInfo: body.additionalInfo || "",
                mapUrl: body.mapUrl,
                featured: body.featured || false,
                active: body.active !== undefined ? body.active : true,
            },
        })

        return NextResponse.json(tour, { status: 201 })
    } catch (error) {
        console.error("Error creating tour:", error)
        return NextResponse.json({ error: "Failed to create tour" }, { status: 500 })
    }
}
