import type { Flight } from '../../types';
import { Card, Button } from '../common';
import { Plane, Clock, Users } from 'lucide-react';
import { formatCurrency, formatDate, formatTime, calculateDuration } from '../../utils/formatters';
import { getAllSeatClassInfo } from '../../utils/seatClass';
import { motion } from 'framer-motion';

interface FlightCardProps {
  flight: Flight;
  onBook: (flight: Flight) => void;
}

export const FlightCard = ({ flight, onBook }: FlightCardProps) => {
  const seatClasses = getAllSeatClassInfo(flight);
  const totalSeats = flight.economy_seats + flight.business_seats + flight.galaxium_seats;
  const isLowSeats = totalSeats <= 2;
  const isSoldOut = totalSeats === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col">
        {/* Route Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cosmic-gradient">
              <Plane className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-star-white">
                {flight.origin} → {flight.destination}
              </h3>
              <p className="text-sm text-star-white/60">
                Flight #{flight.flight_id}
              </p>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="space-y-3 mb-6 flex-1">
          {/* Departure & Arrival */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-star-white/60 mb-1">Departure</p>
              <p className="text-sm font-medium text-star-white">
                {formatDate(flight.departure_time, 'MMM dd, yyyy')}
              </p>
              <p className="text-lg font-bold text-cosmic-purple">
                {formatTime(flight.departure_time)}
              </p>
            </div>
            <div>
              <p className="text-xs text-star-white/60 mb-1">Arrival</p>
              <p className="text-sm font-medium text-star-white">
                {formatDate(flight.arrival_time, 'MMM dd, yyyy')}
              </p>
              <p className="text-lg font-bold text-cosmic-purple">
                {formatTime(flight.arrival_time)}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-star-white/70">
            <Clock size={16} />
            <span className="text-sm">
              Duration: {calculateDuration(flight.departure_time, flight.arrival_time)}
            </span>
          </div>

          {/* Seat Classes */}
          <div className="space-y-2">
            <p className="text-xs text-star-white/60 font-semibold">Available Classes:</p>
            <div className="grid grid-cols-3 gap-2">
              {/* Economy */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                <p className="text-xs text-blue-400 font-semibold">Economy</p>
                <p className="text-lg font-bold text-star-white">{formatCurrency(seatClasses.economy.price)}</p>
                <p className="text-xs text-star-white/60">{seatClasses.economy.available} seats</p>
              </div>
              {/* Business */}
              <div className="bg-cosmic-purple/10 border border-cosmic-purple/30 rounded-lg p-2">
                <p className="text-xs text-cosmic-purple font-semibold">Business</p>
                <p className="text-lg font-bold text-star-white">{formatCurrency(seatClasses.business.price)}</p>
                <p className="text-xs text-star-white/60">{seatClasses.business.available} seats</p>
              </div>
              {/* Galaxium */}
              <div className="bg-gradient-to-br from-alien-green/10 to-solar-orange/10 border border-alien-green/30 rounded-lg p-2">
                <p className="text-xs text-alien-green font-semibold">Galaxium</p>
                <p className="text-lg font-bold text-star-white">{formatCurrency(seatClasses.galaxium.price)}</p>
                <p className="text-xs text-star-white/60">{seatClasses.galaxium.available} seats</p>
              </div>
            </div>
          </div>

          {/* Total Seats */}
          <div className="flex items-center gap-2">
            <Users size={16} className={isLowSeats ? 'text-solar-orange' : 'text-star-white/70'} />
            <span className={`text-sm ${isLowSeats ? 'text-solar-orange font-semibold' : 'text-star-white/70'}`}>
              {isSoldOut ? 'Sold Out' : `${totalSeats} total seats available`}
            </span>
          </div>
        </div>

        {/* Book Button */}
        <Button
          onClick={() => onBook(flight)}
          disabled={isSoldOut}
          className="w-full"
        >
          {isSoldOut ? 'Sold Out' : 'Book Now'}
        </Button>
      </Card>
    </motion.div>
  );
};

// Made with Bob
