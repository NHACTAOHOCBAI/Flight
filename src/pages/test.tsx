import React from 'react';
import { Input, Button, Slider, Checkbox, Radio, Select, Card, Tooltip, Form, DatePicker } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, UserOutlined, DollarOutlined, ClockCircleOutlined, StarOutlined } from '@ant-design/icons';
import type { CheckboxOptionType } from 'antd/es/checkbox/Group';
import useSelectOptions from '../utils/selectOptions';
import icons from '../assets/icons';

const FlightCard: React.FC<{ flight: Flight }> = ({ flight }) => {
    const calculateDuration = (departureTime: string, arrivalTime: string): string => {
        const dep = new Date(`2025-01-01T${departureTime}:00`);
        const arr = new Date(`2025-01-01T${arrivalTime}:00`);
        const diffMs = arr.getTime() - dep.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const duration = calculateDuration(flight.departureTime, flight.arrivalTime);
    const stops = flight.interAirports.length;
    const stopLabel = stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`;
    const price = flight.seats.length > 0 ? flight.seats[0].price : flight.originalPrice;

    return (
        <Card
            className="mb-4 border rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
            bodyStyle={{ padding: '16px' }}
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-teal-700 text-white text-xl font-bold shadow-md">
                        {flight.plane.planeName[0]}
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-gray-800">
                            {flight.departureTime} - {flight.arrivalTime}
                        </div>
                        <p className="text-sm text-gray-600">{flight.plane.planeName} • {stopLabel}</p>
                        <p className="text-sm text-gray-600">{duration}</p>
                        <p className="text-sm text-teal-600 font-medium">
                            {flight.departureAirport.airportCode} → {flight.arrivalAirport.airportCode}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <p className="text-xl font-bold text-teal-600">From ${price}</p>
                    <div className="flex gap-2 mt-2">
                        <Button
                            type="default"
                            className="text-teal-600 border-teal-600 hover:bg-teal-50"
                        >
                            Details
                        </Button>
                        <Button
                            type="primary"
                            className="bg-teal-500 hover:bg-teal-600 border-none"
                        >
                            View Deals
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};
const Search = () => {
    const { RangePicker } = DatePicker;
    const { citySelectOptions } = useSelectOptions();
    const [searchForm] = Form.useForm();
    const handleSearch = (value: Flight) => {
        console.log(value)
    }
    return (
        <div className="w-full bg-white p-[20px] rounded-[8px] shadow-xl">
            <Form
                layout={"inline"}
                style={{ height: '100%' }}
                form={searchForm}
                onFinish={handleSearch}
            >
                <Form.Item label="From"
                    name="from">
                    <Select
                        style={{ width: 200 }}
                        options={citySelectOptions} placeholder="Select departure city"
                    />
                </Form.Item>
                <Form.Item label="To"
                    name="to">
                    <Select
                        style={{ width: 200 }}
                        options={citySelectOptions} placeholder="Select departure city"
                    />
                </Form.Item>
                <Form.Item label="Date"
                    style={{ marginLeft: 'auto' }}
                    name="date">
                    <RangePicker style={{ width: 500 }} />
                </Form.Item>
                <Button
                    style={{ marginLeft: 'auto' }}
                    icon={icons.search}
                    type="primary" htmlType="submit">Search</Button>

            </Form>
        </div >
    )
}
const FlightSearchPage: React.FC = () => {
    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Flight Search</h1>

            {/* Search Bar */}
            <Search />

            {/* Filters and Flight List */}
            <div className="flex flex-col lg:flex-row lg:space-x-6">
                {/* Filters */}
                <div className="w-full lg:w-1/4 p-4 sm:p-6 bg-white rounded-xl shadow-lg mb-6 lg:mb-0">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
                    <div className="space-y-6">
                        <div>
                            <Tooltip title="Filter by price">
                                <p className="text-sm font-medium text-gray-700 mb-1">Price</p>
                            </Tooltip>
                            <Slider
                                range
                                defaultValue={[0, 1000]}
                                marks={{ 0: '$0', 1000: '$1000' }}
                                max={1000}
                                className="text-teal-500"
                            />
                        </div>
                        <div>
                            <Tooltip title="Filter by departure time">
                                <p className="text-sm font-medium text-gray-700 mb-1">Departure Time</p>
                            </Tooltip>
                            <Slider
                                range
                                defaultValue={[0, 24]}
                                marks={{ 0: '0h', 24: '24h' }}
                                max={24}
                                className="text-teal-500"
                            />
                        </div>
                        <div>
                            <Tooltip title="Filter by rating">
                                <p className="text-sm font-medium text-gray-700 mb-1">Rating</p>
                            </Tooltip>
                            <Slider
                                range
                                defaultValue={[0, 5]}
                                marks={{ 0: '0★', 5: '5★' }}
                                max={5}
                                className="text-teal-500"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Airlines</p>
                            <Checkbox.Group
                                options={airlineOptions}
                                className="space-y-2 text-gray-700"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Trip Type</p>
                            <Radio.Group className="space-y-2 text-gray-700">
                                {tripOptions.map((option) => (
                                    <Radio key={option.value} value={option.value}>
                                        {option.label}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </div>
                    </div>
                </div>

                {/* Flight List */}
                <div className="w-full lg:w-3/4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                            <span className="text-gray-700 font-medium">Sort by:</span>
                            <Select
                                defaultValue="cheapest"
                                className="w-36"
                                size="large"
                                dropdownClassName="rounded-lg"
                            >
                                <Select.Option value="cheapest">
                                    <DollarOutlined className="mr-2" /> Cheapest
                                </Select.Option>
                                <Select.Option value="best">
                                    <StarOutlined className="mr-2" /> Best
                                </Select.Option>
                                <Select.Option value="quickest">
                                    <ClockCircleOutlined className="mr-2" /> Quickest
                                </Select.Option>
                            </Select>
                        </div>
                        <div className="text-sm text-gray-600">
                            Showing 4 of 27 flights
                        </div>
                    </div>

                    {flights.map((flight) => (
                        <FlightCard key={flight.id} flight={flight} />
                    ))}

                    <Button
                        type="default"
                        size="large"
                        block
                        className="mt-6 bg-teal-500 text-white hover:bg-teal-600 rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
                    >
                        Show more results
                    </Button>
                </div>
            </div>
        </div>
    );
};
const flights: Flight[] = [
    {
        id: 1,
        flightCode: 'EK123',
        plane: { id: 1, planeCode: 'B777', planeName: 'Emirates' },
        departureAirport: { id: 1, airportCode: 'LHE', airportName: 'Lahore' },
        arrivalAirport: { id: 2, airportCode: 'KHI', airportName: 'Karachi' },
        departureDate: '2025-11-07',
        arrivalDate: '2025-11-07',
        departureTime: '12:00',
        arrivalTime: '14:28',
        originalPrice: 104,
        interAirports: [],
        seats: [{ seat: { id: 1, seatCode: 'ECO', seatName: 'Economy', price: 104, description: '' }, quantity: 50, remainingTickets: 10, price: 104 }],
    },
    {
        id: 2,
        flightCode: 'FZ456',
        plane: { id: 2, planeCode: 'A320', planeName: 'flydubai' },
        departureAirport: { id: 1, airportCode: 'LHE', airportName: 'Lahore' },
        arrivalAirport: { id: 2, airportCode: 'KHI', airportName: 'Karachi' },
        departureDate: '2025-11-07',
        arrivalDate: '2025-11-07',
        departureTime: '12:00',
        arrivalTime: '14:28',
        originalPrice: 104,
        interAirports: [],
        seats: [{ seat: { id: 2, seatCode: 'ECO', seatName: 'Economy', price: 104, description: '' }, quantity: 50, remainingTickets: 10, price: 104 }],
    },
    {
        id: 3,
        flightCode: 'QR789',
        plane: { id: 3, planeCode: 'B787', planeName: 'Qatar Airways' },
        departureAirport: { id: 1, airportCode: 'LHE', airportName: 'Lahore' },
        arrivalAirport: { id: 2, airportCode: 'KHI', airportName: 'Karachi' },
        departureDate: '2025-11-07',
        arrivalDate: '2025-11-07',
        departureTime: '12:00',
        arrivalTime: '14:28',
        originalPrice: 104,
        interAirports: [],
        seats: [{ seat: { id: 3, seatCode: 'ECO', seatName: 'Economy', price: 104, description: '' }, quantity: 50, remainingTickets: 10, price: 104 }],
    },
    {
        id: 4,
        flightCode: 'EY101',
        plane: { id: 4, planeCode: 'A350', planeName: 'Etihad' },
        departureAirport: { id: 1, airportCode: 'LHE', airportName: 'Lahore' },
        arrivalAirport: { id: 2, airportCode: 'KHI', airportName: 'Karachi' },
        departureDate: '2025-11-07',
        arrivalDate: '2025-11-07',
        departureTime: '12:00',
        arrivalTime: '14:28',
        originalPrice: 104,
        interAirports: [],
        seats: [{ seat: { id: 4, seatCode: 'ECO', seatName: 'Economy', price: 104, description: '' }, quantity: 50, remainingTickets: 10, price: 104 }],
    },
];

const airlineOptions: CheckboxOptionType[] = [
    { label: 'Emirates', value: 'Emirates' },
    { label: 'flydubai', value: 'flydubai' },
    { label: 'Qatar Airways', value: 'Qatar' },
    { label: 'Etihad', value: 'Etihad' },
];

const tripOptions = [
    { label: 'Round Trip', value: 'round' },
    { label: 'One Way', value: 'oneway' },
    { label: 'Multi-City', value: 'multi' },
    { label: 'Flexible Dates', value: 'flexible' },
];
export default FlightSearchPage;