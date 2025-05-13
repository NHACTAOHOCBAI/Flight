/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select } from "antd";
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { useUpdateFlight } from "../../hooks/useFlights";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";

interface Props {
    isUpdateOpen: boolean;
    setIsUpdateOpen: (value: boolean) => void;
    refetchData: () => Promise<void>;
    updatedFlight: Flight,
    setUpdateFlight: (value: Flight) => void,
    planeSelectOptions: { value: number, label: React.ReactNode }[],
    airportSelectOptions: { value: number, label: React.ReactNode }[],
    seatSelectOptions: { value: number, label: React.ReactNode }[],
    MIN_FLIGHT_TIME: number,
    MIN_STOP_TIME: number,
    MAX_STOP_TIME: number,
}
const UpdateFlight = ({ isUpdateOpen, setIsUpdateOpen, refetchData, updatedFlight, setUpdateFlight,
    MIN_FLIGHT_TIME, MAX_STOP_TIME, MIN_STOP_TIME,
    planeSelectOptions, airportSelectOptions, seatSelectOptions }: Props) => {
    const [form] = Form.useForm();
    const { mutate, isPending } = useUpdateFlight();
    const [messageApi, contextHolder] = message.useMessage();
    const departureDate = Form.useWatch('departureDate', form);
    const handleCancel = () => {
        setIsUpdateOpen(false);
        form.resetFields();
        setUpdateFlight({
            id: 0,
            flightCode: "",
            plane: {
                id: 0,
                planeCode: "",
                planeName: "",
            },
            departureAirport: {
                id: 0,
                airportCode: "",
                airportName: ""
            },
            arrivalAirport: {
                id: 0,
                airportCode: "",
                airportName: ""
            },
            departureDate: "",
            arrivalDate: "",
            departureTime: "",
            arrivalTime: "",
            originalPrice: 0,
            interAirports: [{
                airport: {
                    id: 0,
                    airportCode: "",
                    airportName: ""
                },
                departureDate: "",
                arrivalDate: "",
                note: ""
            }],
            seats: [{
                seat: {
                    id: 0,
                    seatCode: "",
                    seatName: "",
                    price: 0,
                    description: ""
                },
                quantity: 0,
                remainingTickets: 0,
                price: 0
            }]
        })
    }
    const handleUpdate = (values: any) => {
        const departureDate = dayjs(values.departureDate).format('YYYY-MM-DD');
        const arrivalDate = dayjs(values.arrivalDate).format('YYYY-MM-DD');
        const departureTime = dayjs(values.departureDate).format('HH:mm:ss');
        const arrivalTime = dayjs(values.arrivalDate).format('HH:mm:ss');
        const interAirports = values.interAirports.map((value: any) => {
            const departureDate = dayjs(value.departureDate).format('YYYY-MM-DD');
            const arrivalDate = dayjs(value.arrivalDate).format('YYYY-MM-DD');
            const departureTime = dayjs(value.departureDate).format('HH:mm:ss');
            const arrivalTime = dayjs(value.arrivalDate).format('HH:mm:ss');
            return {
                airportId: value.airportId,
                departureDate,
                arrivalDate,
                departureTime,
                arrivalTime,
                note: value.note
            }
        })
        const updateFlight: FlightRequest = {
            flightCode: values.flightCode,
            planeId: values.planeId,
            departureAirportId: values.departureAirportId,
            arrivalAirportId: values.arrivalAirportId,
            departureDate: departureDate,
            arrivalDate: arrivalDate,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            originPrice: values.originalPrice,
            interAirports: interAirports,
            seats: values.seats
        }
        mutate({ id: updatedFlight.id, updateFlight }, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("update flight successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
            onSettled: () => {
                handleCancel();
            }
        });
    };
    useEffect(() => {
        const format = "YYYY-MM-DD HH:mm";
        const departureDateStr = updatedFlight.departureDate + " " + updatedFlight.departureTime;
        const arrivalDateStr = updatedFlight.arrivalDate + " " + updatedFlight.arrivalTime;
        const interAirports = updatedFlight.interAirports.map((value) => {
            return {
                airportId: value.airport.id,
                arrivalDate: dayjs(value.arrivalDate, "YYYY-MM-DD"),
                departureDate: dayjs(value.departureDate, "YYYY-MM-DD"),
                note: value.note
            }
        })
        const seats = updatedFlight.seats.map((value) => {
            return {
                seatId: value.seat.id,
                quantity: value.quantity
            }
        })
        form.setFieldsValue({
            id: updatedFlight.id,
            flightCode: updatedFlight.flightCode,
            planeId: updatedFlight.plane.id,
            departureAirportId: updatedFlight.departureAirport.id,
            arrivalAirportId: updatedFlight.arrivalAirport.id,
            departureDate: dayjs(departureDateStr, format),
            arrivalDate: dayjs(arrivalDateStr, format),
            interAirports: interAirports,
            seats: seats,
            originalPrice: updatedFlight.originalPrice
        });
    }, [updatedFlight, form])
    return (
        <>
            {contextHolder}
            <Modal
                okText="Create Flight"
                width={1200}
                title="New Flight"
                open={isUpdateOpen}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                confirmLoading={isPending}
            >
                <Form
                    onValuesChange={(changedValues) => {
                        if (changedValues.arrivalDate || changedValues.departureDate) {
                            form.setFieldsValue({ interAirports: [] });
                        }
                        if (changedValues.departureDate) {
                            form.setFieldsValue({ arrivalDate: "" })
                        }
                    }}
                    layout="vertical"
                    form={form}
                    onFinish={handleUpdate}
                    style={{ display: "flex", gap: 20 }}
                >
                    <div style={{ width: '60%' }}>
                        <Form.Item label="ID" name="id">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item label="Code" name="flightCode" rules={[{ required: true, message: "Please enter flight code" }]}>
                            <Input disabled={isPending} placeholder="Enter flight code" />
                        </Form.Item>

                        <Form.Item label="Plane" name="planeId" rules={[{ required: true, message: "Please select a plane" }]}>
                            <Select disabled={isPending} options={planeSelectOptions} placeholder="Select plane" />
                        </Form.Item>

                        <Form.Item label="Departure Airport" name="departureAirportId" rules={[{ required: true, message: "Please select a departure airport" }]}>
                            <Select disabled={isPending} options={airportSelectOptions} placeholder="Select departure airport" />
                        </Form.Item>

                        <Form.Item label="Arrival Airport" name="arrivalAirportId" rules={[{ required: true, message: "Please select an arrival airport" }]}>
                            <Select disabled={isPending} options={airportSelectOptions} placeholder="Select arrival airport" />
                        </Form.Item>

                        <div className="w-full flex justify-between gap-4">
                            <Form.Item
                                label="Departure Date"
                                name="departureDate"
                                rules={[{ required: true, message: 'Please select departure date and time' }]}
                            >
                                <DatePicker
                                    disabled={isPending}
                                    minDate={dayjs()}
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder="Select departure date and time"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Arrival Date"
                                name="arrivalDate"
                                rules={[
                                    { required: true, message: 'Please select arrival date and time' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const departure = getFieldValue('departureDate');
                                            if (!value) return Promise.resolve();
                                            const diffMinutes = value.diff(departure, 'minute');
                                            if (diffMinutes < MIN_FLIGHT_TIME) {
                                                return Promise.reject(new Error('Flight duration must be at least 300 minutes (5 hours)'));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker
                                    disabled={!departureDate || isPending}
                                    minDate={departureDate ? dayjs(departureDate).add(1, 'minute') : undefined}
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder="Select arrival date and time"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </div>

                        <div className="mb-[10px]">Intermediate Airports</div>
                        <Form.List
                            name="interAirports"
                            rules={[
                                {
                                    validator: async (_, value) => {
                                        if (value && value.length > 3) {
                                            return Promise.reject(new Error('You can add up to 3 intermediate airports only.'));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            {(fields, { add, remove }) => {
                                const currentInterAirports = form.getFieldValue("interAirports") || [];
                                const departureDate = form.getFieldValue("departureDate");
                                const arrivalDate = form.getFieldValue("arrivalDate");
                                const allFieldsFilled = currentInterAirports.every(
                                    (item: any) => item?.airportId && item?.arrivalDate && item?.departureDate
                                );

                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {fields.map(({ key, name, ...restField }, index) => {
                                            const prevStop = currentInterAirports[index - 1];

                                            return (
                                                <Row key={key} gutter={[16, 10]} align="middle">
                                                    {/* Airport Select */}
                                                    <Col span={6}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'airportId']}
                                                            rules={[{ required: true, message: 'Select airport' }]}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <Select
                                                                placeholder="Select inter airport"
                                                                disabled={isPending}
                                                                options={airportSelectOptions}
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    {/* Arrival Date at Stop */}
                                                    <Col span={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'arrivalDate']}
                                                            rules={[
                                                                { required: true, message: 'Select stop arrival date' },
                                                                ({ getFieldValue }) => ({
                                                                    validator(_, value) {
                                                                        const stops = getFieldValue('interAirports') || [];
                                                                        const prev = stops[index - 1];
                                                                        const dep = getFieldValue('departureDate');
                                                                        const arr = getFieldValue('arrivalDate');

                                                                        if (!value || !dep || !arr) return Promise.resolve();

                                                                        if (value.isBefore(dayjs(dep))) {
                                                                            return Promise.reject(new Error('Must be after departure date.'));
                                                                        }

                                                                        if (value.isAfter(dayjs(arr))) {
                                                                            return Promise.reject(new Error('Must be before arrival date.'));
                                                                        }

                                                                        if (prev?.departureDate && value.isBefore(dayjs(prev.departureDate))) {
                                                                            return Promise.reject(new Error('Must be after previous stop departure.'));
                                                                        }

                                                                        return Promise.resolve();
                                                                    },
                                                                }),
                                                            ]}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <DatePicker
                                                                disabled={isPending}
                                                                showTime={{ format: 'HH:mm' }}
                                                                format="YYYY-MM-DD HH:mm"
                                                                style={{ width: '100%' }}
                                                                placeholder="Select stop arrival"
                                                                minDate={dayjs(prevStop?.departureDate || departureDate)}
                                                                maxDate={dayjs(arrivalDate)}
                                                                onChange={() => {
                                                                    const updated = [...(form.getFieldValue("interAirports") || [])];
                                                                    if (updated[index]) updated[index].departureDate = undefined;
                                                                    form.setFieldsValue({ interAirports: updated.slice(0, index + 1) });
                                                                }}
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    {/* Departure Date from Stop */}
                                                    <Col span={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'departureDate']}
                                                            rules={[
                                                                { required: true, message: 'Select stop departure date' },
                                                                ({ getFieldValue }) => ({
                                                                    validator(_, value) {
                                                                        const arrival = getFieldValue(['interAirports', name, 'arrivalDate']);
                                                                        if (!value) return Promise.resolve();
                                                                        if (!arrival) return Promise.resolve();

                                                                        const diff = value.diff(arrival, 'minute');
                                                                        if (diff < MIN_STOP_TIME || diff > MAX_STOP_TIME) {
                                                                            return Promise.reject(
                                                                                new Error(`Stop time must be between ${MIN_STOP_TIME} and ${MAX_STOP_TIME} minutes.`)
                                                                            );
                                                                        }

                                                                        return Promise.resolve();
                                                                    },
                                                                }),
                                                            ]}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <DatePicker
                                                                showTime={{ format: 'HH:mm' }}
                                                                format="YYYY-MM-DD HH:mm"
                                                                style={{ width: '100%' }}
                                                                placeholder="Select stop departure"
                                                                disabled={!form.getFieldValue(['interAirports', name, 'arrivalDate']) || isPending}
                                                                minDate={
                                                                    form.getFieldValue(['interAirports', name, 'arrivalDate'])
                                                                        ? dayjs(form.getFieldValue(['interAirports', name, 'arrivalDate'])).add(1, 'minute')
                                                                        : dayjs(departureDate)
                                                                }
                                                                maxDate={dayjs(arrivalDate)}
                                                                onChange={() => {
                                                                    const updated = [...(form.getFieldValue("interAirports") || [])];
                                                                    form.setFieldsValue({ interAirports: updated.slice(0, index + 1) });
                                                                }}
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    {/* Remove Button */}
                                                    <Col span={2} style={{ textAlign: 'center' }}>
                                                        <CloseOutlined
                                                            onClick={() => remove(name)}
                                                            style={{ fontSize: 20, cursor: 'pointer' }}
                                                        />
                                                    </Col>

                                                    {/* Optional Note */}
                                                    <Col span={24}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'note']}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <TextArea disabled={isPending} rows={3} placeholder="Note (optional)" />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            );
                                        })}

                                        {/* Add Button */}
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                block
                                                icon={<PlusOutlined />}
                                                disabled={
                                                    currentInterAirports.length >= 3 ||
                                                    !allFieldsFilled ||
                                                    !departureDate ||
                                                    !arrivalDate ||
                                                    isPending
                                                }
                                            >
                                                Add Intermediate Airport
                                            </Button>
                                        </Form.Item>
                                    </div>
                                );
                            }}
                        </Form.List>

                    </div>

                    <div className="w-[1px] bg-gray-300"></div>

                    <div className="flex-1">
                        <div className="mb-[10px]">Tickets</div>
                        <Form.List
                            name="seats"
                            rules={[
                                {
                                    validator: async (_, value) => {
                                        if (!value || value.length < 1) {
                                            return Promise.reject(new Error('You must add at least 1 seat item.'));
                                        }
                                    },
                                },
                            ]}
                        >
                            {(fields, { add, remove }, { errors }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }, index) => {
                                        return (
                                            <Row key={key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                                                <Col span={11}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'seatId']}
                                                        rules={[{ required: true, message: 'Select a seat' }]}
                                                        style={{ marginBottom: 0 }}
                                                    >
                                                        <Select disabled={isPending} options={seatSelectOptions} placeholder="Select seat" />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={11}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'quantity']}
                                                        rules={[
                                                            { required: true, message: 'Enter quantity' },
                                                            {
                                                                validator: (_, value) => {
                                                                    if (index + 1 > updatedFlight.seats.length)
                                                                        return Promise.resolve();
                                                                    const remaining = updatedFlight.seats[index].remainingTickets;
                                                                    if (value >= remaining) {
                                                                        return Promise.resolve();
                                                                    }
                                                                    return Promise.reject(
                                                                        new Error(`Must be bigger than remaining tickets (${remaining}) `)
                                                                    );
                                                                },
                                                            },
                                                        ]}
                                                        style={{ marginBottom: 0 }}
                                                    >
                                                        <InputNumber min={0} disabled={isPending} placeholder="Enter quantity" addonAfter="Tickets" style={{ width: "100%" }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={2} style={{ textAlign: 'center' }}>
                                                    <CloseOutlined onClick={() => remove(name)} style={{ fontSize: 20, cursor: 'pointer' }} />
                                                </Col>
                                            </Row>
                                        )
                                    }
                                    )}
                                    <Form.Item>
                                        <Button disabled={isPending} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add Ticket
                                        </Button>
                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>

                        <Form.Item
                            label="Original Price"
                            name="originalPrice"
                            rules={[{ required: true, message: "Enter the original price" }]}
                        >
                            <InputNumber
                                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={(v: string | undefined): number => Number(v?.replace(/[^\d]/g, ""))}
                                min={0} disabled={isPending} placeholder="Enter original price" style={{ width: "100%" }} addonAfter="VND" />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateFlight;
