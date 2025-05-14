import React from "react";



type Props = {
    flight: Flight;
};

function formatTime(datetime: string): string {
    return new Date(datetime).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

function formatDate(datetime: string): string {
    return new Date(datetime).toLocaleDateString("vi-VN");
}

function calculateDuration(startDate: string, startTime: string, endDate: string, endTime: string): string {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 1000 / 60);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    return `${hours}h ${minutes}m`;
}


const FlightCard: React.FC<Props> = ({ flight }) => {
    const duration = calculateDuration(
        flight.departureDate,
        flight.departureTime,
        flight.arrivalDate,
        flight.arrivalTime
    );

    return (
        <div className="drop-shadow-2xl rounded-lg bg-white p-4 flex flex-col gap-[10px]">
            {/* Departure */}
            <div className="flex items-start space-x-3">
                <div className="text-lg font-bold">{flight.departureTime.slice(0, 5)}</div>
                <div className="flex-1">
                    <div className="font-semibold">
                        {flight.departureAirport.airportName} ({flight.departureAirport.airportCode})
                    </div>
                    <div className="text-sm text-gray-600">{formatDate(flight.departureDate)}</div>
                </div>
            </div>

            {/* Inter Airports */}
            {flight.interAirports.map((inter, idx) => (
                <div key={idx} className="border-l-2 border-dashed border-blue-400 ml-3 pl-6 relative">
                    <div className="absolute left-[-10px] top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="font-semibold">
                        {inter.airport.airportName} ({inter.airport.airportCode})
                    </div>
                    <div className="text-sm text-gray-600">
                        To: {formatTime(inter.arrivalDateTime)} -- Leave: {formatTime(inter.departureDateTime)}
                    </div>
                    <div className="text-sm italic text-gray-500">{inter.note}</div>
                </div>
            ))}

            {/* Arrival */}
            <div className="flex items-start space-x-3">
                <div className="text-lg font-bold">{flight.arrivalTime.slice(0, 5)}</div>
                <div className="flex-1">
                    <div className="font-semibold">
                        {flight.arrivalAirport.airportName} ({flight.arrivalAirport.airportCode})
                    </div>
                    <div className="text-sm text-gray-600">{formatDate(flight.arrivalDate)}</div>
                </div>
            </div>

            {/* Duration + Flight Info */}
            <div className="mt-2 border-t pt-3 text-sm text-gray-700">
                <div>Flight Time: {duration}</div>
                <div>Flight Code: <strong>{flight.flightCode}</strong></div>
            </div>
        </div>
    );
};

export default FlightCard;
