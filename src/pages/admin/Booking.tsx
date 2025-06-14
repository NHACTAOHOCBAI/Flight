import React, { useEffect, useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import FirstStep from '../../components/booking/firstStep/FirstStep';
import SecondStep from '../../components/booking/secondStep/SecondStep';
import { useBookingFlight } from '../../hooks/useTickets';
import DetailTicket from '../../components/booking/detailTicket/DetailTicket';
import { useNavigate } from 'react-router';
import ThirdStep from '../../components/booking/thirdStep/ThirdStep';
import Loading from '../../components/Loading';


const Booking = () => {
    // const [isPending, setIsPending] = useState(false)
    const flight: Flight = JSON.parse(localStorage.getItem('booked_flight') || JSON.stringify({
        id: 0,
        flightCode: "",
        plane: {
            id: 0,
            planeCode: "",
            planeName: "",
            description: "",
            airline: {
                id: 0,
                name: "",
                logo: ""
            }
        },
        departureAirport: {
            id: 0,
            name: "",
            city: {
                id: 0,
                name: ""
            }
        },
        arrivalAirport: {
            id: 0,
            name: "",
            city: {
                id: 0,
                name: ""
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
    const navigate = useNavigate();
    const ticketsData = JSON.parse(localStorage.getItem('tickets') as string);
    const tickets: TicketRequest = {
        flightId: flight.id,
        tickets: ticketsData || []
    }
    const { mutate, isPending } = useBookingFlight();
    const [messageApi, contextHolder] = message.useMessage();
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const steps = [
        {
            title: 'Customer Information',
            content: <FirstStep />,
        },
        {
            title: 'Confirm',
            content: <SecondStep />,
        },
        {
            title: 'Complete',
            content: <ThirdStep isBookingFlight={true} />,
        },
    ];
    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
    };
    const handleBooking = () => {
        if (!tickets) {
            messageApi.error("You haven't booked any tickets");
            return;
        }
        // setIsPending(true)
        mutate(tickets, {
            onSuccess: async () => {
                messageApi.success("Booking flight success");
                localStorage.removeItem("booked_flight")
                localStorage.removeItem("tickets")
                next()
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
        // setIsPending(false)
    }
    useEffect(() => {
        if (flight === null) {
            console.log("flight is null, redirecting...");
            navigate("/admin/flights");
        }
    }, [flight, navigate]);
    return (
        <>
            {contextHolder}
            {
                isPending ?
                    <Loading />
                    :
                    <div className='flex gap-[10px]'>
                        <div className='flex-2/3'>
                            <Steps current={current} items={items} />
                            <div style={contentStyle} className='p-[10px]'>{steps[current].content}</div>
                            <div style={{ marginTop: 24 }}>
                                {current < 1 && (
                                    <Button disabled={isPending} type="primary" onClick={() => next()}>
                                        Next
                                    </Button>
                                )}
                                {current === 1 && (
                                    <Button type="primary" onClick={handleBooking} disabled={isPending}>
                                        Booking
                                    </Button>
                                )}
                                {current > 0 && current != 2 && (
                                    <Button disabled={isPending} style={{ margin: '0 8px' }} onClick={() => prev()}>
                                        Previous
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className='flex-1/3'>
                            <DetailTicket />
                        </div>
                    </div>
            }
        </>
    );
};

export default Booking;