import { useTicketsContext } from "../../../context/TicketsContext";
import Ticket from "./Ticket";

const SecondStep = () => {
    const { tickets } = useTicketsContext();
    return (
        <div className="w-full flex flex-col gap-[10px]">
            {tickets && tickets.map(() => <Ticket />)}
        </div>
    )
}
export default SecondStep;