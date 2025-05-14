import React, { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import FirstStep from '../../components/booking/firstStep/FirstStep';
import SecondStep from '../../components/booking/secondStep/SecondStep';
import { useCreateTicket } from '../../hooks/useTickets';
import DetailTicket from '../../components/booking/detailTicket/DetailTicket';
import { useTicketsContext } from '../../context/TicketsContext';


const Booking = () => {
    const { tickets } = useTicketsContext();
    const { mutate } = useCreateTicket();
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
        const flight: Flight = JSON.parse(localStorage.getItem('booked_flight') as string);
        const ticketRequest: TicketRequest = {
            flightId: flight.id,
            seatId: tickets[0].seatId,
            passengerName: tickets[0].passengerName,
            passengerPhone: tickets[0].passengerPhone,
            passengerIDCard: tickets[0].passengerIDCard,
            passengerEmail: tickets[0].passengerEmail
        }
        console.log({
            flightId: flight.id,
            tickets: tickets
        })
        mutate(ticketRequest, {
            onSuccess: async () => {
                messageApi.success("booking flight successfully");
                localStorage.removeItem("tickets");
                localStorage.removeItem("booked_flight");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    }
    return (
        <>
            {contextHolder}
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
                                Done
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
        </>
    );
};

export default Booking;