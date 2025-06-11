import { Button } from "antd";
import Ticket from "../booking/secondStep/Ticket";

const History = () => {
    const myTickets: TicketCard[] = [
        {
            id: 1,
            passengerName: "Nguyen Van A",
            passengerEmail: "vana@example.com",
            passengerPhone: "0912345678",
            passengerIDCard: "012345678",
            seatId: 1,
            flight: {
                id: 101,
                flightCode: "VN123",
                plane: {
                    id: 1,
                    planeCode: "A321",
                    planeName: "Airbus A321",
                    airline: {
                        id: 1,
                        airlineCode: "VN",
                        airlineName: "Vietnam Airlines",
                        logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Vietnam_Airlines_logo.svg"
                    }
                },
                departureAirport: {
                    id: 1,
                    airportCode: "SGN",
                    airportName: "Tan Son Nhat International Airport",
                    city: {
                        id: 1,
                        cityCode: "HCM",
                        cityName: "Ho Chi Minh City"
                    }
                },
                arrivalAirport: {
                    id: 2,
                    airportCode: "HAN",
                    airportName: "Noi Bai International Airport",
                    city: {
                        id: 2,
                        cityCode: "HN",
                        cityName: "Ha Noi"
                    }
                },
                departureDate: "2025-06-15",
                arrivalDate: "2025-06-15",
                departureTime: "08:00",
                arrivalTime: "10:00",
                originalPrice: 150,
                interAirports: [],
                seats: [
                    {
                        seat: {
                            id: 1,
                            seatCode: "ECO",
                            seatName: "Economy",
                            price: 150,
                            description: "Economy class seat"
                        },
                        quantity: 100,
                        remainingTickets: 80,
                        price: 150
                    }
                ]
            }
        },
        {
            id: 1,
            passengerName: "Nguyen Van A",
            passengerEmail: "vana@example.com",
            passengerPhone: "0912345678",
            passengerIDCard: "012345678",
            seatId: 1,
            flight: {
                id: 101,
                flightCode: "VN123",
                plane: {
                    id: 1,
                    planeCode: "A321",
                    planeName: "Airbus A321",
                    airline: {
                        id: 1,
                        airlineCode: "VN",
                        airlineName: "Vietnam Airlines",
                        logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Vietnam_Airlines_logo.svg"
                    }
                },
                departureAirport: {
                    id: 1,
                    airportCode: "SGN",
                    airportName: "Tan Son Nhat International Airport",
                    city: {
                        id: 1,
                        cityCode: "HCM",
                        cityName: "Ho Chi Minh City"
                    }
                },
                arrivalAirport: {
                    id: 2,
                    airportCode: "HAN",
                    airportName: "Noi Bai International Airport",
                    city: {
                        id: 2,
                        cityCode: "HN",
                        cityName: "Ha Noi"
                    }
                },
                departureDate: "2025-06-15",
                arrivalDate: "2025-06-15",
                departureTime: "08:00",
                arrivalTime: "10:00",
                originalPrice: 150,
                interAirports: [],
                seats: [
                    {
                        seat: {
                            id: 1,
                            seatCode: "ECO",
                            seatName: "Economy",
                            price: 150,
                            description: "Economy class seat"
                        },
                        quantity: 100,
                        remainingTickets: 80,
                        price: 150
                    }
                ]
            }
        },
        {
            id: 2,
            passengerName: "Tran Thi B",
            passengerEmail: "thib@example.com",
            passengerPhone: "0987654321",
            passengerIDCard: "876543210",
            seatId: 2,
            flight: {
                id: 102,
                flightCode: "VJ456",
                plane: {
                    id: 2,
                    planeCode: "B737",
                    planeName: "Boeing 737",
                    airline: {
                        id: 2,
                        airlineCode: "VJ",
                        airlineName: "VietJet Air",
                        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/VietJet_Air_logo.svg"
                    }
                },
                departureAirport: {
                    id: 3,
                    airportCode: "DAD",
                    airportName: "Da Nang International Airport",
                    city: {
                        id: 3,
                        cityCode: "DAD",
                        cityName: "Da Nang"
                    }
                },
                arrivalAirport: {
                    id: 1,
                    airportCode: "SGN",
                    airportName: "Tan Son Nhat International Airport",
                    city: {
                        id: 1,
                        cityCode: "HCM",
                        cityName: "Ho Chi Minh City"
                    }
                },
                departureDate: "2025-06-20",
                arrivalDate: "2025-06-20",
                departureTime: "15:00",
                arrivalTime: "17:00",
                originalPrice: 300,
                interAirports: [],
                seats: [
                    {
                        seat: {
                            id: 2,
                            seatCode: "BUS",
                            seatName: "Business",
                            price: 300,
                            description: "Business class seat"
                        },
                        quantity: 20,
                        remainingTickets: 5,
                        price: 300
                    }
                ]
            }
        }
    ];
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <p className="text-xl font-medium gap-[10px]">My tickets</p>
            <div className="gap-[10px] flex flex-col mt-4 max-h-[450px] overflow-y-auto pr-2">
                {
                    myTickets.map((item) => {
                        return (
                            <div className="p-[5px] border-2 flex gap-[10px] border-dashed border-gray-500 rounded-lg bg-amber-100 w-fit" key={item.id}>
                                <Ticket
                                    ticket={{
                                        flight: item.flight,
                                        seatId: item.seatId,
                                        passengerName: item.passengerName,
                                        passengerEmail: item.passengerEmail,
                                        passengerPhone: item.passengerPhone,
                                        passengerIDCard: item.passengerIDCard
                                    }}
                                />
                                <div className="flex flex-col justify-center items-center">
                                    <p className="font-bold">Status:Expired</p>
                                    <Button>
                                        Refund
                                    </Button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
export default History