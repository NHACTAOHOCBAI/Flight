import { createSlice, type PayloadAction } from '@reduxjs/toolkit'


interface FlightState {
    flight: Flight
}
const initialState: FlightState = {
    flight: {
        id: 0,
        flightCode: "",
        plane: {
            id: 0,
            planeCode: "",
            planeName: "",
            airline: {
                id: 0,
                airlineCode: "",
                airlineName: "",
                logo: ""
            }
        },
        departureAirport: {
            id: 0,
            airportCode: "",
            airportName: "",
            city: {
                id: 0,
                cityCode: "",
                cityName: ""
            }
        },
        arrivalAirport: {
            id: 0,
            airportCode: "",
            airportName: "",
            city: {
                id: 0,
                cityCode: "",
                cityName: ""
            }
        },
        departureDate: "",
        arrivalDate: "",
        departureTime: "",
        arrivalTime: "",
        originalPrice: 0,
        interAirports: [],
        seats: [],
        hasTickets: false
    }
}

const flightSilce = createSlice({
    name: 'flights',
    initialState,
    reducers: {
        setFlight(state, action: PayloadAction<Flight>) {
            state.flight = action.payload
        },
        resetFlight(state) {
            state.flight = initialState.flight
        }
    },
})

export const { setFlight, resetFlight } = flightSilce.actions
export default flightSilce.reducer

