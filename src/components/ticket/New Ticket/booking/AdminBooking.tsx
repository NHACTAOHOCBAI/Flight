import React, { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import DetailTicket from '../../../booking/detailTicket/DetailTicket';
import { useCreateTicket } from '../../../../hooks/useTickets';
import FirstStep from './FirstStep';
import SecondStep from '../../../booking/secondStep/SecondStep';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { resetFlight } from '../../../../redux/features/flight/flightSlide';
import Loading from '../../../Loading';

interface Props {
    refetchData: () => Promise<void>;
    setIsNewOpen: (value: boolean) => void;
}
const AdminBooking = ({ setIsNewOpen, refetchData }: Props) => {
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
    const dispath = useAppDispatch();
    const ticketsData = JSON.parse(localStorage.getItem('tickets') as string);
    const tickets: TicketRequest = {
        flightId: flight.id,
        tickets: ticketsData || []
    }
    const { mutate, isPending } = useCreateTicket();
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
        }
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
        mutate(tickets, {
            onSuccess: async () => {
                localStorage.removeItem("booked_flight")
                localStorage.removeItem("tickets")
                messageApi.success("Booking flight success");
                dispath(resetFlight())
                refetchData()
                setCurrent(0)
                setIsNewOpen(false)
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    }
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
                                {current < steps.length - 1 && (
                                    <Button type="primary" onClick={() => next()}>
                                        Next
                                    </Button>
                                )}
                                {current === steps.length - 1 && (
                                    <Button type="primary" onClick={handleBooking}>
                                        Booking
                                    </Button>
                                )}
                                {current > 0 && (
                                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
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

export default AdminBooking;