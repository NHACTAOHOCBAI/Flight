import Ticket from "./Ticket";

const SecondStep = () => {
    const tickets = JSON.parse(localStorage.getItem("tickets") as string)
    return (
        <div className="w-full flex flex-col gap-[10px]">
            {tickets && tickets.map(() => <Ticket />)}
        </div>
    )
}
export default SecondStep;