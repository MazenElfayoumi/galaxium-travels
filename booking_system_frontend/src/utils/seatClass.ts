import type { Flight, SeatClass, SeatClassInfo } from '../types';

/**
 * Calculate the price for a specific seat class based on base price
 */
export const calculateClassPrice = (basePrice: number, seatClass: SeatClass): number => {
  const multipliers: Record<SeatClass, number> = {
    economy: 1,
    business: 1.5,
    galaxium: 2.5
  };
  return Math.floor(basePrice * multipliers[seatClass]);
};

/**
 * Get complete information about a seat class for a specific flight
 */
export const getSeatClassInfo = (
  flight: Flight,
  seatClass: SeatClass
): SeatClassInfo => {
  const amenities: Record<SeatClass, string[]> = {
    economy: ['Standard seating', 'Basic meals', 'Standard baggage'],
    business: ['Extra legroom', 'Premium meals', 'Priority boarding', 'Increased baggage'],
    galaxium: ['Luxury suite', 'Gourmet dining', 'VIP lounge access', 'Unlimited baggage', 'Personal concierge']
  };
  
  const seats: Record<SeatClass, number> = {
    economy: flight.economy_seats,
    business: flight.business_seats,
    galaxium: flight.galaxium_seats
  };
  
  const multipliers: Record<SeatClass, number> = { 
    economy: 1, 
    business: 1.5, 
    galaxium: 2.5 
  };
  
  return {
    name: seatClass.charAt(0).toUpperCase() + seatClass.slice(1),
    price: calculateClassPrice(flight.base_price, seatClass),
    available: seats[seatClass],
    amenities: amenities[seatClass],
    multiplier: multipliers[seatClass]
  };
};

/**
 * Get all seat class information for a flight
 */
export const getAllSeatClassInfo = (flight: Flight): Record<SeatClass, SeatClassInfo> => {
  return {
    economy: getSeatClassInfo(flight, 'economy'),
    business: getSeatClassInfo(flight, 'business'),
    galaxium: getSeatClassInfo(flight, 'galaxium')
  };
};

/**
 * Check if a seat class is available for booking
 */
export const isSeatClassAvailable = (flight: Flight, seatClass: SeatClass): boolean => {
  const seats: Record<SeatClass, number> = {
    economy: flight.economy_seats,
    business: flight.business_seats,
    galaxium: flight.galaxium_seats
  };
  return seats[seatClass] > 0;
};

// Made with Bob