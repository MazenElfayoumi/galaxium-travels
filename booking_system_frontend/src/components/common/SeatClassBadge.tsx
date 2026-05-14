import type { SeatClass } from '../../types';

interface SeatClassBadgeProps {
  seatClass: SeatClass;
  className?: string;
}

const SeatClassBadge = ({ seatClass, className = '' }: SeatClassBadgeProps) => {
  const getClassStyles = () => {
    switch (seatClass) {
      case 'economy':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'business':
        return 'bg-cosmic-purple/20 text-cosmic-purple border-cosmic-purple/30';
      case 'galaxium':
        return 'bg-gradient-to-r from-alien-green/20 to-solar-orange/20 text-alien-green border-alien-green/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDisplayName = () => {
    return seatClass.charAt(0).toUpperCase() + seatClass.slice(1);
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getClassStyles()} ${className}`}
    >
      {getDisplayName()}
    </span>
  );
};

export default SeatClassBadge;

// Made with Bob