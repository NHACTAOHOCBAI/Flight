import { useAppSelector } from "../../../hooks/useAppSelector"
import FlightCard from "./flightSchedule"
import Price from "./Price"

const DetailTicket = () => {
    // const flight: Flight = JSON.parse(localStorage.getItem('booked_flight') as string);
    const flight = useAppSelector((state) => state.flight).flight
    return (
        <div className="flex flex-col gap-[20px]">
            <Price />
            {
                flight.id !== 0
                &&
                <FlightCard
                    flight={flight}
                />
            }
        </div>
    )
}
export default DetailTicket