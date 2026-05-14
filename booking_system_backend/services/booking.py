from sqlalchemy.orm import Session
from datetime import datetime
from models import User, Flight, Booking
from schemas import BookingOut, ErrorResponse


def book_flight(db: Session, user_id: int, name: str, flight_id: int, seat_class: str = 'economy') -> BookingOut | ErrorResponse:
    """Book a seat on a specific flight for a user with a specific seat class."""
    # Validate seat class
    valid_classes = ['economy', 'business', 'galaxium']
    if seat_class not in valid_classes:
        return ErrorResponse(
            error="Invalid seat class",
            error_code="INVALID_SEAT_CLASS",
            details=f"Seat class '{seat_class}' is not valid. Must be one of: {', '.join(valid_classes)}"
        )
    
    # Check flight exists
    flight = db.query(Flight).filter(Flight.flight_id == flight_id).first()
    if not flight:
        return ErrorResponse(
            error="Flight not found",
            error_code="FLIGHT_NOT_FOUND",
            details=f"The specified flight_id {flight_id} does not exist in our system. Please check the flight_id or use list_flights to see available flights."
        )

    # Check seats available for specific class
    seats_map = {
        'economy': flight.economy_seats,
        'business': flight.business_seats,
        'galaxium': flight.galaxium_seats
    }
    
    if seats_map[seat_class] < 1:
        return ErrorResponse(
            error=f"No {seat_class} seats available",
            error_code="NO_SEATS_AVAILABLE",
            details=f"The {seat_class} class is fully booked on this flight. Please try a different class or another flight."
        )

    # Check user exists and name matches
    user = db.query(User).filter(User.user_id == user_id, User.name == name).first()
    if not user:
        existing_user = db.query(User).filter(User.user_id == user_id).first()
        if existing_user:
            return ErrorResponse(
                error="Name mismatch",
                error_code="NAME_MISMATCH",
                details=f"User ID {user_id} exists but the name '{name}' does not match the registered name '{existing_user.name}'. Please verify the user's name or use the correct name for this user ID."
            )
        else:
            return ErrorResponse(
                error="User not found",
                error_code="USER_NOT_FOUND",
                details=f"User with ID {user_id} is not registered in our system. The user might need to register first, or you may need to check if the user_id is correct."
            )

    # Calculate price based on class
    price_multipliers = {
        'economy': 1.0,
        'business': 1.5,
        'galaxium': 2.5
    }
    price_paid = int(flight.base_price * price_multipliers[seat_class])

    # Decrement appropriate seat count
    if seat_class == 'economy':
        flight.economy_seats -= 1
    elif seat_class == 'business':
        flight.business_seats -= 1
    elif seat_class == 'galaxium':
        flight.galaxium_seats -= 1

    # Create booking
    new_booking = Booking(
        user_id=user_id,
        flight_id=flight_id,
        seat_class=seat_class,
        price_paid=price_paid,
        status="booked",
        booking_time=datetime.utcnow().isoformat()
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return BookingOut.model_validate(new_booking)


def cancel_booking(db: Session, booking_id: int) -> BookingOut | ErrorResponse:
    """Cancel an existing booking by its booking_id."""
    booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
    if not booking:
        return ErrorResponse(
            error="Booking not found",
            error_code="BOOKING_NOT_FOUND",
            details=f"Booking with ID {booking_id} not found. The booking may have been deleted or the booking_id may be incorrect. Please verify the booking_id or check if the booking exists."
        )

    if booking.status == "cancelled":
        return ErrorResponse(
            error="Booking already cancelled",
            error_code="ALREADY_CANCELLED",
            details=f"Booking {booking_id} is already cancelled and cannot be cancelled again. The booking status is currently '{booking.status}'. If you need to make changes, please contact support."
        )

    # Restore seat to appropriate class
    flight = db.query(Flight).filter(Flight.flight_id == booking.flight_id).first()
    if flight:
        if booking.seat_class == 'economy':
            flight.economy_seats += 1
        elif booking.seat_class == 'business':
            flight.business_seats += 1
        elif booking.seat_class == 'galaxium':
            flight.galaxium_seats += 1

    booking.status = "cancelled"
    db.commit()
    db.refresh(booking)
    return BookingOut.model_validate(booking)


def get_bookings(db: Session, user_id: int) -> list[BookingOut]:
    """Retrieve all bookings for a specific user."""
    bookings = db.query(Booking).filter(Booking.user_id == user_id).all()
    return [BookingOut.model_validate(b) for b in bookings]
