import prisma from "../prisma";

/**
 * AI logic to find the best laundry partner for an order.
 * Criteria: Proximity, Rating, and current load capacity.
 */
export const findOptimalPartner = async (customerLat: number, customerLng: number) => {
    const partners = await prisma.partner.findMany({
        where: {
            isVerified: true,
            currentLoad: {
                lt: prisma.partner.fields.capacity
            }
        }
    });

    if (partners.length === 0) return null;

    // Calculate match score based on common tags
    const scoredPartners = partners.map((p: any) => {
        const distance = Math.sqrt(
            Math.pow(p.lat - customerLat, 2) + Math.pow(p.lng - customerLng, 2)
        );

        // Score = (Rating * 0.4) - (Distance * 0.4) - (CurrentLoad/Capacity * 0.2)
        const loadFactor = p.currentLoad / p.capacity;
        const score = (p.rating * 0.4) - (distance * 100 * 0.4) - (loadFactor * 0.2);

        return { ...p, score };
    });

    // Sort by score descending
    scoredPartners.sort((a: any, b: any) => b.score - a.score);

    return scoredPartners[0];
};
