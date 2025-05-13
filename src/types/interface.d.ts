
interface City {
    id: number,
    cityCode: string,
    cityName: string
}

interface Airline {
    id: number,
    airlineCode: string,
    airlineName: string,
    logo: string
}

interface Airport {
    id: number,
    airportCode: string,
    airportName: string,
    city: {
        id: number,
        cityCode: string,
        cityName: string
    }
}

interface Plane {
    id: number,
    planeCode: string,
    planeName: string,
    airline: {
        id: number,
        airlineCode: string,
        airlineName: string,
        logo: string
    }
}

interface Seat {
    id: number,
    seatCode: string,
    seatName: string,
    price: number,
    description: string
}

interface Flight {
    id: number,
    flightCode: string,
    plane: {
        id: number,
        planeCode: string,
        planeName: string,
    }
    departureAirport: {
        id: number,
        airportCode: string,
        airportName: string
    }
    arrivalAirport: {
        id: number,
        airportCode: string,
        airportName: string
    }
    departureDate: string
    arrivalDate: string
    departureTime: string
    arrivalTime: string
    originalPrice: number,
    interAirports: {
        airport: {
            id: number,
            airportCode: string,
            airportName: string
        }
        departureDate: string
        arrivalDate: string
        note: string
    }[]
    seats: {
        seat: {
            id: number,
            seatCode: string,
            seatName: string,
            price: number,
            description: string
        }
        quantity: number,
        remainingTickets: number,
        price: number
    }[]
}

interface FlightRequest {
    flightCode: string;
    planeId: number;
    departureAirportId: number;
    arrivalAirportId: number;
    departureDate: string;
    arrivalDate: string;
    departureTime: string;
    arrivalTime: string;
    originPrice: number;
    interAirports: {
        airportId: number;
        departureDate: string;
        arrivalDate: string;
        departureTime: string;
        arrivalTime: string;
        note: string;
    }[];
    seats: {
        seatId: number;
        quantity: number;
    }[];
}