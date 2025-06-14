import { useTicketsContext } from "../../../context/TicketsContext";
import Ticket from "./Ticket";
interface Ticket {
    id?: number;
    flight: Flight;
    seat: Seat;
    passengerName: string;
    passengerEmail: string;
    passengerPhone: string;
    passengerIDCard: string;
}
const SecondStep = () => {
    const { tickets } = useTicketsContext();
    const flight = JSON.parse(localStorage.getItem("booked_flight") || JSON.stringify({
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
    }));
    return (
        <div className="w-full flex flex-col gap-[10px]">
            {tickets && tickets.tickets.map((item) => (
                <Ticket
                    ticket={{
                        flight: flight,
                        seatId: item.seatId,
                        passengerName: item.passengerName,
                        passengerEmail: item.passengerEmail,
                        passengerPhone: item.passengerPhone,
                        passengerIDCard: item.passengerIDCard
                    }}
                />
            ))}
        </div>
    )
}
export default SecondStep;