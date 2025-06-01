
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
        departureDateTime: string
        arrivalDateTime: string
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
    canUpdate?: boolean
    canDelete?: boolean
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
        departureDateTime: string;
        arrivalDateTime: string;
        note: string;
    }[];
    seats: {
        seatId: number;
        quantity: number;
    }[];
}

interface Ticket {
    id: number;
    flight?: Flight;
    seat?: Seat;
    passengerName: string;
    passengerEmail: string;
    passengerPhone: string;
    passengerIDCard: string;
}


interface TicketRequest {
    flightId: number
    seatId: number
    passengerName: string
    passengerPhone: string
    passengerIDCard: string
    passengerEmail: string
}

interface Role {
    id: number,
    roleName: string,
    pages: {
        id: number,
        pageName: string
    }[]
}

interface Account {
    id: number,
    username: string,
    password: string
    email: string
    fullName: string
    phone: string
    avatar: string
    role: Role
}

interface AccountRequest {
    username: string,
    password: string
    email: string
    fullName: string
    phone: string
    roleId: number
}

interface Dashboard {
    revenueThisYear: number;
    revenueLastYear: number;
    revenueThisMonth: number;
    revenueLastMonth: number;
    flightCountThisYear: number;
    flightCountLastYear: number;
    flightCountThisMonth: number;
    flightCountLastMonth: number;
    airlineCount: number;
    airportCount: number;
    airlinePopularity: Record<string, number>;
}

interface BookingRate {
    months: {
        month: number,
        maxTickets: number,
        ticketsSold: number
    }[],
    year: number
}

interface AnnualRevenueReport {
    year: number,
    revenue: number,
    flightCount: number,
    months: {
        month: number,
        revenue: number,
        percentage: number,
        flightCount: number
    }
}

interface MonthlyRevenueReport {
    year: number,
    month: number,
    revenue: number,
    percentage: number,
    flightCount: number,
    flights: {
        flightId: number,
        flightCode: string,
        ticketCount: number,
        revenue: number,
        percentage: number,
    }[]
}

interface Page {
    id: number,
    name: string,
    apiPath: string,
    method: string,
    module: string
}