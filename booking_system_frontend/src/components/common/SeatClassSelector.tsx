import type { Flight, SeatClass, SeatClassInfo } from '../../types';
import { getSeatClassInfo } from '../../utils/seatClass';
import { Sparkles, Star, Plane } from 'lucide-react';

interface SeatClassSelectorProps {
  flight: Flight;
  selectedClass: SeatClass;
  onSelectClass: (seatClass: SeatClass) => void;
}

const SeatClassSelector = ({ flight, selectedClass, onSelectClass }: SeatClassSelectorProps) => {
  const seatClasses: SeatClass[] = ['economy', 'business', 'galaxium'];

  const getIcon = (seatClass: SeatClass) => {
    switch (seatClass) {
      case 'economy':
        return <Plane className="w-5 h-5" />;
      case 'business':
        return <Star className="w-5 h-5" />;
      case 'galaxium':
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getCardStyles = (seatClass: SeatClass, info: SeatClassInfo) => {
    const isSelected = selectedClass === seatClass;
    const isAvailable = info.available > 0;

    if (!isAvailable) {
      return 'bg-space-dark/30 border-gray-700 opacity-50 cursor-not-allowed';
    }

    const baseStyles = 'cursor-pointer transition-all duration-200 hover:scale-105';
    
    if (isSelected) {
      switch (seatClass) {
        case 'economy':
          return `${baseStyles} bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/20`;
        case 'business':
          return `${baseStyles} bg-cosmic-purple/20 border-cosmic-purple shadow-lg shadow-cosmic-purple/20`;
        case 'galaxium':
          return `${baseStyles} bg-gradient-to-br from-alien-green/20 to-solar-orange/20 border-alien-green shadow-lg shadow-alien-green/20`;
      }
    }

    return `${baseStyles} bg-space-dark/50 border-gray-700 hover:border-gray-600`;
  };

  const getTextColor = (seatClass: SeatClass) => {
    switch (seatClass) {
      case 'economy':
        return 'text-blue-400';
      case 'business':
        return 'text-cosmic-purple';
      case 'galaxium':
        return 'text-alien-green';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Select Seat Class</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {seatClasses.map((seatClass) => {
          const info = getSeatClassInfo(flight, seatClass);
          const isAvailable = info.available > 0;
          const isSelected = selectedClass === seatClass;

          return (
            <div
              key={seatClass}
              onClick={() => isAvailable && onSelectClass(seatClass)}
              className={`relative border-2 rounded-lg p-4 ${getCardStyles(seatClass, info)}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={getTextColor(seatClass)}>
                    {getIcon(seatClass)}
                  </div>
                  <h4 className={`font-bold text-lg ${getTextColor(seatClass)}`}>
                    {info.name}
                  </h4>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mb-3">
                <div className="text-2xl font-bold text-white">
                  ${info.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">
                  {info.multiplier}x base price
                </div>
              </div>

              {/* Availability */}
              <div className="mb-3">
                {isAvailable ? (
                  <div className="text-sm text-green-400">
                    {info.available} seat{info.available !== 1 ? 's' : ''} available
                  </div>
                ) : (
                  <div className="text-sm text-red-400 font-semibold">
                    Sold Out
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div className="space-y-1">
                {info.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs text-gray-300">
                    <svg className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeatClassSelector;

// Made with Bob