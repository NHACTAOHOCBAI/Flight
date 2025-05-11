
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