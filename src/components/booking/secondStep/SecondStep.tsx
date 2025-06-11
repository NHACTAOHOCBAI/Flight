import { useTicketsContext } from "../../../context/TicketsContext";
import Ticket from "./Ticket";

const SecondStep = () => {
    const { tickets } = useTicketsContext();
    console.log("Tickets in SecondStep:", tickets);
    return (
        <div className="w-full flex flex-col gap-[10px]">
            {tickets && tickets.tickets.map((item) => (
                <Ticket
                    item={item}
                />
            ))}
        </div>
    )
}
export default SecondStep;