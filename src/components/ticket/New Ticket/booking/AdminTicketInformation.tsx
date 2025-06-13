/* eslint-disable @typescript-eslint/no-explicit-any */


import { Card, Form, Input, notification, Row, Select, type FormProps } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useEffect } from 'react'
import { useTicketsContext } from '../../../../context/TicketsContext'
import useSelectOptions from '../../../../utils/selectOptions'
import { getFlightById } from '../../../../services/flight'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { setFlight } from '../../../../redux/features/flight/flightSlide'
import { useAppSelector } from '../../../../hooks/useAppSelector'

interface FormValues {
    tickets: TicketRequest[]
}
const AdminTicketInformation = () => {
    const dispath = useAppDispatch()
    const { tickets, setTickets } = useTicketsContext();
    const { flightSelectOptions } = useSelectOptions()
    const [api, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const flight = useAppSelector(state => state.flight).flight
    //     id: 0,
    //     flightCode: "",
    //     plane: {
    //         id: 0,
    //         planeCode: "",
    //         planeName: "",
    //         description: "",
    //         airline: {
    //             id: 0,
    //             name: "",
    //             logo: ""
    //         }
    //     },
    //     departureAirport: {
    //         id: 0,
    //         name: "",
    //         city: {
    //             id: 0,
    //             name: ""
    //         }
    //     },
    //     arrivalAirport: {
    //         id: 0,
    //         name: "",
    //         city: {
    //             id: 0,
    //             name: ""
    //         }
    //     },
    //     departureDate: "",
    //     arrivalDate: "",
    //     departureTime: "",
    //     arrivalTime: "",
    //     originalPrice: 0,
    //     interAirports: [],
    //     seats: [],
    //     hasTickets: false
    // }));
    const seatSelectOptions: { value: number, label: string }[] = flight.seats.map((value) => {
        return ({
            value: value.seat.id,
            label: value.seat.seatName
        }
        )
    })
    const onFinish: FormProps<FormValues>['onFinish'] = ({ tickets }: any) => {
        if (tickets.length === 0) {
            api.error({
                message: `Error booking`,
                description: "You haven't booked any tickets"
            });
        }
        setTickets({
            flightId: flight.id,
            tickets
        })
        localStorage.setItem('tickets', JSON.stringify(tickets));
    }
    const handleOnchange = async (value: number) => {
        const res = await getFlightById(value)
        console.log(res.data)
        localStorage.setItem("booked_flight", JSON.stringify(res.data))
        dispath(setFlight(res.data))
    }
    useEffect(() => {
        const ticket = JSON.parse(localStorage.getItem('tickets') || "[]")
        console.log(ticket)
        if (ticket) {
            form.setFieldsValue({ tickets: ticket });
        }
    }, [form, tickets])
    return (
        <>
            {contextHolder}
            <Form
                form={form}
                onFinish={onFinish}
                autoComplete='off'
                initialValues={{ tickets: [{}] }}
                layout='vertical'
            >
                <div className='flex gap-[10px] items-center mb-[10px] mt-[10px]'>
                    <p>Flight:</p>
                    <Select
                        showSearch
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        onChange={handleOnchange} options={flightSelectOptions} style={{ width: 300 }} />
                </div>
                <Form.List
                    name='tickets'
                >
                    {(fields, { add, remove }) => (
                        <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                            {fields.map((field) => (
                                <Card
                                    size='small'
                                    key={field.key}
                                    extra={
                                        <CloseOutlined
                                            onClick={() => {
                                                remove(field.name)
                                            }}
                                        />
                                    }
                                >
                                    <div className='font-medium text-xl'>
                                        {`Ticket ${field.name + 1}`}
                                    </div>
                                    <Form.Item
                                        label="Seat class"
                                        name={[field.name, 'seatId']}
                                        rules={[{ required: true }]}
                                        style={{ textAlign: 'left' }}
                                    >
                                        <Select placeholder='Select a seat' options={seatSelectOptions} />
                                    </Form.Item>
                                    <Form.Item
                                        label="Name"
                                        name={[field.name, 'passengerName']}
                                        rules={[{ required: true }]}
                                        style={{ textAlign: 'left' }}
                                    >
                                        <Input placeholder='Enter a name' />
                                    </Form.Item>
                                    <Form.Item
                                        label="Phone"
                                        name={[field.name, 'passengerPhone']}
                                        rules={[
                                            {
                                                pattern: /^\d{10,11}$/,
                                                message: 'Phone number must be 10 or 11 digits',
                                            },
                                        ]}
                                        style={{ textAlign: 'left' }}
                                    >
                                        <Input placeholder='Enter a phone' />
                                    </Form.Item>
                                    <Form.Item
                                        label="Email"
                                        name={[field.name, 'passengerEmail']}
                                        rules={[
                                            { required: true },
                                            { type: 'email', message: 'Please enter a valid email address' },
                                        ]}
                                        style={{ textAlign: 'left' }}
                                    >
                                        <Input placeholder='Enter a email' />
                                    </Form.Item>
                                    <Form.Item
                                        label="ID card"
                                        name={[field.name, 'passengerIDCard']}
                                        rules={[{ required: true }]}
                                        style={{ textAlign: 'left' }}
                                    >
                                        <Input placeholder='Enter a ID' />
                                    </Form.Item>
                                </Card>
                            ))}
                            <Row justify='end' style={{ gap: 10 }}>
                                <Button type='dashed' style={{ width: 120 }} onClick={() => add()} block>
                                    + New Ticket
                                </Button>
                                <Button style={{ width: 120, backgroundColor: '#3498db', color: 'white' }} onClick={() => form.submit()}>
                                    Save
                                </Button>
                            </Row>
                        </div>
                    )}
                </Form.List>
            </Form>
        </>
    )
}

export default AdminTicketInformation
