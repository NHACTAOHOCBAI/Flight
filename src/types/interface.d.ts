
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