import { formatDate, formatTime } from "../../../utils/formatDateTime";
import useSelectOptions from "../../../utils/selectOptions";

interface TicketProps {
    item: {
        seatId: number, passengerName: string, passengerPhone: string, passengerEmail: string, passengerIDCard: string
    }
}
const Ticket = ({
    item
}: TicketProps) => {
    const { seatSelectOptions } = useSelectOptions();
    console.log("Seats", seatSelectOptions)
    console.log("seat", item.seatId)
    const seat = seatSelectOptions.find(
        (option: { value: number; label: string }) => option.value === Number(item.seatId)
    )?.label || "Unknown Seat";
    const flight: Flight = JSON.parse(localStorage.getItem("booked_flight") || "{}");
    return (
        <div className=" bg-white relative rounded-xl shadow-md flex w-[800px] overflow-hidden">
            <div className="flex-1 p-6 text-center">
                <div className="text-gray-700 font-semibold text-sm mb-4 ">BOARDING PASS</div>

                <div className="flex justify-between items-center mb-6">

                    <div>
                        <div className="text-blue-700 font-bold text-4xl">{flight.departureAirport.city.cityCode}</div>
                        <div className="text-sm text-gray-600 font-semibold">{flight.departureAirport.city.cityName}</div>
                        <div className="text-sm mt-2">{formatDate(flight.departureDate)}</div>
                        <div className="text-sm text-gray-600">{formatTime(flight.departureTime)}</div>
                    </div>


                    <div className="text-2xl text-gray-400">→</div>


                    <div>
                        <div className="text-blue-700 font-bold text-4xl">{flight.arrivalAirport.city.cityCode}</div>
                        <div className="text-sm text-gray-600 font-semibold">{flight.arrivalAirport.city.cityName}</div>
                        <div className="text-sm mt-2">{formatDate(flight.arrivalDate)}</div>
                        <div className="text-sm text-gray-600">{formatTime(flight.arrivalTime)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left text-sm text-gray-700">
                    <div><span className="font-bold">Passenger:</span> {item.passengerName}</div>
                    <div><span className="font-bold">Flight:</span> {flight.flightCode}</div>
                </div>
            </div>


            <div className="w-64 bg-blue-100 p-6 text-sm text-gray-800">
                <div className="text-center text-gray-500 mb-6">{flight.plane.airline.airlineName}</div>

                <div className="mb-4 text-left">
                    <div><span className="font-semibold">Passenger:</span>{item.passengerName}</div>
                    <div><span className="font-semibold">classNameName:</span>{seat}</div>
                </div>

                <div className="text-left">
                    <div><span className="font-semibold">Date:</span>{formatDate(flight.departureDate)}</div>
                    <div><span className="font-semibold">Boarding:</span>{formatTime(flight.departureTime)}</div>
                </div>
            </div>

        </div>
    )
}
export default Ticket;