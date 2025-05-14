import FlightCard from "./flightSchedule"
import Price from "./Price"

const DetailTicket = () => {
    const flight: Flight = JSON.parse(localStorage.getItem('booked_flight') as string);
    return (
        <div className="flex flex-col gap-[20px]">
            <Price />
            <FlightCard
                flight={flight}
            />
        </div>
    )
}
export default DetailTicket