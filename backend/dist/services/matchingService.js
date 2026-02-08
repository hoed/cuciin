"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOptimalPartner = void 0;
const prisma_1 = __importDefault(require("../prisma"));
/**
 * AI logic to find the best laundry partner for an order.
 * Criteria: Proximity, Rating, and current load capacity.
 */
const findOptimalPartner = async (customerLat, customerLng) => {
    const partners = await prisma_1.default.partner.findMany({
        where: {
            isVerified: true,
            currentLoad: {
                lt: prisma_1.default.partner.fields.capacity
            }
        }
    });
    if (partners.length === 0)
        return null;
    // Calculate scores (Heuristic AI approach)
    const scoredPartners = partners.map(p => {
        const distance = Math.sqrt(Math.pow(p.lat - customerLat, 2) + Math.pow(p.lng - customerLng, 2));
        // Score = (Rating * 0.4) - (Distance * 0.4) - (CurrentLoad/Capacity * 0.2)
        const loadFactor = p.currentLoad / p.capacity;
        const score = (p.rating * 0.4) - (distance * 100 * 0.4) - (loadFactor * 0.2);
        return { ...p, score };
    });
    // Sort by score descending
    scoredPartners.sort((a, b) => b.score - a.score);
    return scoredPartners[0];
};
exports.findOptimalPartner = findOptimalPartner;
