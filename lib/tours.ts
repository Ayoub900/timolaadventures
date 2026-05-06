import prisma from "@/lib/prisma"

export interface Circuit {
  id: string
  slug: string
  name: string
  description: string
  duration: number
  price: number
  images: string[]
  category: string
}

interface GetToursOptions {
  category?: string
  featured?: boolean
}

export async function getTours({ category, featured }: GetToursOptions = {}): Promise<Circuit[]> {
  const where: Record<string, unknown> = { active: true }
  if (category) where.category = category
  if (featured !== undefined) where.featured = featured

  const tours = await prisma.circuit.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  return tours as unknown as Circuit[]
}

export async function getFeaturedTours(): Promise<Circuit[]> {
  return getTours({ featured: true })
}
