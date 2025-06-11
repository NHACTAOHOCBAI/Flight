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
    console.log("Tickets in SecondStep:", tickets);
    const flight = JSON.parse(localStorage.getItem("booked_flight") || "{}");
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