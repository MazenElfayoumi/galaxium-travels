from pydantic import BaseModel, EmailStr
from typing import Optional, Literal


class FlightOut(BaseModel):
    flight_id: int
    origin: str
    destination: str
    departure_time: str
    arrival_time: str
    base_price: int
    economy_seats: int
    business_seats: int
    galaxium_seats: int

    class Config:
        from_attributes = True

    @property
    def business_price(self) -> int:
        return int(self.base_price * 1.5)
    
    @property
    def galaxium_price(self) -> int:
        return int(self.base_price * 2.5)


class BookingRequest(BaseModel):
    user_id: int
    name: str
    flight_id: int
    seat_class: Literal['economy', 'business', 'galaxium']


class BookingOut(BaseModel):
    booking_id: int
    user_id: int
    flight_id: int
    seat_class: str
    price_paid: int
    status: str
    booking_time: str

    class Config:
        from_attributes = True


class UserRegistration(BaseModel):
    name: str
    email: EmailStr


class UserOut(BaseModel):
    user_id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    error_code: str
    details: Optional[str] = None
