import { PrismaClient } from '../generated/prisma/client'; // Adjust path based on your output

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Toubkal Ascent tour...')

    const toubkal = await prisma.circuit.upsert({
        where: { slug: 'toubkal-ascent' },
        update: {
            name: 'Toubkal Ascent',
            tagline: 'North Africa\'s Highest Peak',
            duration: 2,
            category: 'Mountain Trek',
            price: 270,
            originalPrice: 295,
            isFrom: true,
            description: 'Mount Toubkal, standing at 4,167 meters, is the highest peak in North Africa and one of Morocco’s most iconic trekking destinations. Located in the High Atlas Mountains and starting from Marrakech, this two-day trek is perfect for travelers with good fitness who want to reach the summit in a short time while enjoying spectacular mountain scenery and Berber culture.\n\nThe trek lasts two days and one night, with accommodation in a mountain refuge. The difficulty level is moderate to challenging, and the best period to climb is from April to October. During winter months, special equipment such as crampons and an ice axe is required.',
            images: [
                'https://images.unsplash.com/photo-1598555815779-1d428135272a?auto=format&fit=crop&q=80', // Snowy mountain
                'https://images.unsplash.com/photo-1539650116455-251d23630742?auto=format&fit=crop&q=80', // Hiker
                'https://images.unsplash.com/photo-1549480336-6db8e99e2f49?auto=format&fit=crop&q=80', // Valley
            ],
            highlights: [
                'Summit Mount Toubkal (4,167m)',
                'Explore High Atlas Mountains',
                'Traditional Berber Villages',
                'Stunning Panoramic Views'
            ],
            included: [
                'Private transport Marrakech ⇄ Imlil',
                'Certified local mountain guide',
                'Mule and muleteer for luggage',
                'Accommodation in mountain refuge (1 night)',
                'Meals during the trek (lunch, dinner, breakfast)',
                'Mineral water during trekking'
            ],
            excluded: [
                'Sleeping bag (can be rented)',
                'Personal trekking equipment',
                'Soft drinks',
                'Tips and personal expenses',
                'Travel insurance'
            ],
            optional: [],
            itineraryGlance: [
                'Day 1: Marrakech – Imlil – Toubkal Refuge',
                'Day 2: Toubkal Summit – Imlil – Marrakech'
            ],
            itineraryDetail: 'Full itinerary below...',

            // New Structured Data
            pricingTiers: [
                { groupSize: '1 person', winterPrice: '295€', summerPrice: '270€' },
                { groupSize: '2 to 3 people', winterPrice: '200€ / Person', summerPrice: '185€ / Person' },
                { groupSize: '4 to 7 people', winterPrice: '185€ / Person', summerPrice: '165€ / Person' },
                { groupSize: '8 to 14 people', winterPrice: '150€ / Person', summerPrice: '130€ / Person' }
            ],
            itinerary: [
                {
                    day: 1,
                    title: 'Marrakech – Imlil – Toubkal Refuge',
                    description: 'In the morning, you are picked up from your accommodation in Marrakech and driven through the High Atlas Mountains to the village of Imlil, a journey of around one and a half to two hours. Upon arrival in Imlil at 1,740 meters, you meet your local certified mountain guide and begin the trek.\n\nThe walk passes through the Berber village of Aroumd, following mule paths and terraced fields with beautiful views of the surrounding peaks. Around midday, you stop for lunch near the spiritual site of Sidi Chamharouch at 2,350 meters. After lunch, the trail continues steadily through the Mizane Valley until reaching the Toubkal Refuge at 3,207 meters.\n\nIn the evening, dinner is served at the refuge and you spend the night there in shared accommodation.',
                    stats: '5-6 hours walk, 1400m ascent'
                },
                {
                    day: 2,
                    title: 'Toubkal Summit – Imlil – Marrakech',
                    description: 'The day starts early with breakfast around five o’clock in the morning, followed by the ascent to the summit of Mount Toubkal. The climb takes three to four hours and is done at a steady pace to ensure safety and acclimatization. From the summit at 4,167 meters, you can enjoy breathtaking panoramic views of the High Atlas Mountains and, on clear days, the distant Sahara.\n\nAfter spending time at the summit, you descend back to the refuge for lunch. In the afternoon, the trek continues downhill to Imlil, where your transport is waiting to take you back to Marrakech.',
                    stats: '6-7 hours walk, 960m ascent, 2400m descent'
                }
            ],
            whatToBring: [
                'Hiking boots (good grip)',
                'Warm clothing (layers)',
                'Waterproof jacket',
                'Backpack (20–30L)',
                'Gloves & hat (even in summer)',
                'Headlamp',
                'Sunscreen & sunglasses',
                'Sleeping bag'
            ],
            difficulty: 'Moderate to challenging. No technical climbing required. Suitable for people in good physical condition. Altitude can be demanding--slow pace & hydration recommended.',
            bestTime: 'April to October: Best trekking season. November to March: Snow conditions – crampons & ice axe required.'
        },
        create: {
            slug: 'toubkal-ascent',
            name: 'Toubkal Ascent',
            tagline: 'North Africa\'s Highest Peak',
            duration: 2,
            category: 'Mountain Trek',
            price: 270,
            originalPrice: 295,
            isFrom: true,
            description: 'Mount Toubkal, standing at 4,167 meters, is the highest peak in North Africa and one of Morocco’s most iconic trekking destinations. Located in the High Atlas Mountains and starting from Marrakech, this two-day trek is perfect for travelers with good fitness who want to reach the summit in a short time while enjoying spectacular mountain scenery and Berber culture.\n\nThe trek lasts two days and one night, with accommodation in a mountain refuge. The difficulty level is moderate to challenging, and the best period to climb is from April to October. During winter months, special equipment such as crampons and an ice axe is required.',
            images: [
                'https://images.unsplash.com/photo-1598555815779-1d428135272a?auto=format&fit=crop&q=80', // Snowy mountain
                'https://images.unsplash.com/photo-1539650116455-251d23630742?auto=format&fit=crop&q=80', // Hiker
                'https://images.unsplash.com/photo-1549480336-6db8e99e2f49?auto=format&fit=crop&q=80', // Valley
            ],
            highlights: [
                'Summit Mount Toubkal (4,167m)',
                'Explore High Atlas Mountains',
                'Traditional Berber Villages',
                'Stunning Panoramic Views'
            ],
            included: [
                'Private transport Marrakech ⇄ Imlil',
                'Certified local mountain guide',
                'Mule and muleteer for luggage',
                'Accommodation in mountain refuge (1 night)',
                'Meals during the trek (lunch, dinner, breakfast)',
                'Mineral water during trekking'
            ],
            excluded: [
                'Sleeping bag (can be rented)',
                'Personal trekking equipment',
                'Soft drinks',
                'Tips and personal expenses',
                'Travel insurance'
            ],
            optional: [],
            itineraryGlance: [
                'Day 1: Marrakech – Imlil – Toubkal Refuge',
                'Day 2: Toubkal Summit – Imlil – Marrakech'
            ],
            itineraryDetail: 'Full itinerary below...',

            // New Structured Data
            pricingTiers: [
                { groupSize: '1 person', winterPrice: '295€', summerPrice: '270€' },
                { groupSize: '2 to 3 people', winterPrice: '200€ / Person', summerPrice: '185€ / Person' },
                { groupSize: '4 to 7 people', winterPrice: '185€ / Person', summerPrice: '165€ / Person' },
                { groupSize: '8 to 14 people', winterPrice: '150€ / Person', summerPrice: '130€ / Person' }
            ],
            itinerary: [
                {
                    day: 1,
                    title: 'Marrakech – Imlil – Toubkal Refuge',
                    description: 'In the morning, you are picked up from your accommodation in Marrakech and driven through the High Atlas Mountains to the village of Imlil, a journey of around one and a half to two hours. Upon arrival in Imlil at 1,740 meters, you meet your local certified mountain guide and begin the trek.\n\nThe walk passes through the Berber village of Aroumd, following mule paths and terraced fields with beautiful views of the surrounding peaks. Around midday, you stop for lunch near the spiritual site of Sidi Chamharouch at 2,350 meters. After lunch, the trail continues steadily through the Mizane Valley until reaching the Toubkal Refuge at 3,207 meters.\n\nIn the evening, dinner is served at the refuge and you spend the night there in shared accommodation.',
                    stats: '5-6 hours walk, 1400m ascent'
                },
                {
                    day: 2,
                    title: 'Toubkal Summit – Imlil – Marrakech',
                    description: 'The day starts early with breakfast around five o’clock in the morning, followed by the ascent to the summit of Mount Toubkal. The climb takes three to four hours and is done at a steady pace to ensure safety and acclimatization. From the summit at 4,167 meters, you can enjoy breathtaking panoramic views of the High Atlas Mountains and, on clear days, the distant Sahara.\n\nAfter spending time at the summit, you descend back to the refuge for lunch. In the afternoon, the trek continues downhill to Imlil, where your transport is waiting to take you back to Marrakech.',
                    stats: '6-7 hours walk, 960m ascent, 2400m descent'
                }
            ],
            whatToBring: [
                'Hiking boots (good grip)',
                'Warm clothing (layers)',
                'Waterproof jacket',
                'Backpack (20–30L)',
                'Gloves & hat (even in summer)',
                'Headlamp',
                'Sunscreen & sunglasses',
                'Sleeping bag'
            ],
            difficulty: 'Moderate to challenging. No technical climbing required. Suitable for people in good physical condition. Altitude can be demanding--slow pace & hydration recommended.',
            bestTime: 'April to October: Best trekking season. November to March: Snow conditions – crampons & ice axe required.'
        }
    })

    console.log({ toubkal })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
