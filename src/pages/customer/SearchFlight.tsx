/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { Button, Slider, Checkbox, Radio, Select, Card, Tooltip, Form, DatePicker } from 'antd';
import { DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { CheckboxOptionType } from 'antd/es/checkbox/Group';
import useSelectOptions from '../../utils/selectOptions';
import icons from '../../assets/icons';
import { useNavigate } from 'react-router';
import { debounce } from 'lodash';
const { RangePicker } = DatePicker;

const FlightCard: React.FC<{ flight: Flight }> = ({ flight }) => {
    const navigate = useNavigate();

    const calculateDuration = (
        departureDate: string,
        departureTime: string,
        arrivalDate: string,
        arrivalTime: string
    ): string => {
        const dep = new Date(`${departureDate}T${departureTime}:00`);
        const arr = new Date(`${arrivalDate}T${arrivalTime}:00`);
        const diffMs = arr.getTime() - dep.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const duration = calculateDuration(
        flight.departureDate,
        flight.departureTime,
        flight.arrivalDate,
        flight.arrivalTime
    );

    const stops = flight.interAirports.length;
    const stopLabel = stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`;

    // Ưu tiên ghế rẻ nhất
    const sortedSeats = [...flight.seats].sort((a, b) => a.price - b.price);
    const price = sortedSeats.length > 0 ? sortedSeats[0].price : flight.originalPrice;

    return (
        <Card
            className="mb-4 border rounded-xl shadow-lg hover:scale-[105%] duration-300 bg-white"
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
                        <p className="text-sm text-gray-600">
                            {flight.plane.planeName} • {stopLabel}
                        </p>
                        <p className="text-sm text-gray-600">{duration}</p>
                        <p className="text-sm text-teal-600 font-medium">
                            {flight.departureAirport.airportCode} → {flight.arrivalAirport.airportCode}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <p className="text-xl font-bold text-teal-600">From ${price.toLocaleString()}</p>
                    <div className="flex gap-2 mt-2">
                        <Button
                            type="default"
                            className="text-teal-600 border-teal-600 hover:bg-teal-50"
                            onClick={() => {
                                localStorage.setItem('booked_flight', JSON.stringify(flight));
                                navigate(`/booking`);
                            }}
                        >
                            Booking
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};


const Search: React.FC<{ onSearch: (values: any) => void }> = ({ onSearch }) => {
    const { citySelectOptions } = useSelectOptions();
    const [form] = Form.useForm();

    const handleSearch = (values: any) => {
        console.log("Search form values:", values);
        onSearch(values);
    };

    return (
        <div className="w-full bg-white p-[20px] rounded-[8px] shadow-md">
            <Form
                layout="inline"
                form={form}
                onFinish={handleSearch}
            >
                <Form.Item label="From" name="from">
                    <Select
                        style={{ width: 200 }}
                        options={citySelectOptions}
                        placeholder="Select departure city"
                    />
                </Form.Item>
                <Form.Item label="To" name="to">
                    <Select
                        style={{ width: 200 }}
                        options={citySelectOptions}
                        placeholder="Select arrival city"
                    />
                </Form.Item>
                <Form.Item label="Date" name="date" style={{ marginLeft: 'auto' }}>
                    <RangePicker style={{ width: 500 }} />
                </Form.Item>
                <Button
                    icon={icons.search}
                    type="primary"
                    htmlType="submit"
                    style={{ marginLeft: 'auto' }}
                >
                    Search
                </Button>
            </Form>
        </div>
    );
};
const Filters: React.FC<{ onFilterChange: (filters: any) => void }> = ({ onFilterChange }) => {
    const { airlineSelectOptions } = useSelectOptions();

    const debounceFilter = useCallback(debounce((filters) => {
        console.log("Debounced filters:", filters);
        onFilterChange(filters);
    }, 500), []);

    const handleChange = (changed: any) => {
        debounceFilter(changed);
    };

    return (
        <div className="w-full lg:w-1/4 p-4 sm:p-6 bg-white rounded-xl shadow-lg mb-6 lg:mb-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
            <div className="space-y-6">
                <div>
                    <Tooltip title="Filter by price">
                        <p className="text-sm font-medium text-gray-700 mb-1">Price</p>
                    </Tooltip>
                    <Slider
                        range
                        defaultValue={[500, 10000]}
                        marks={{ 500: '500k', 10000: '10000k' }}
                        max={10000}
                        min={500}
                        onAfterChange={(value) => handleChange({ price: value })}
                    />
                </div>
                <div>
                    <Tooltip title="Filter by departure time">
                        <p className="text-sm font-medium text-gray-700 mb-1">Departure Time Slot</p>
                    </Tooltip>
                    <Checkbox.Group
                        options={departureTimeSlotOptions}
                        onChange={(value) => handleChange({ departureTimeSlot: value })}
                    />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Airlines</p>
                    <Checkbox.Group
                        options={airlineSelectOptions}
                        onChange={(value) => handleChange({ airlines: value })}
                    />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Trip Type</p>
                    <Radio.Group
                        onChange={(e) => handleChange({ tripType: e.target.value })}
                    >
                        {tripOptions.map((option) => (
                            <Radio key={option.value} value={option.value}>
                                {option.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                </div>
            </div>
        </div>
    );
};
const FlightSearchPage: React.FC = () => {
    // const { airlineSelectOptions } = useSelectOptions();
    const handleSearchSubmit = (values: any) => {
        // Logic search khi user nhấn nút Search
        console.log("Search submitted:", values);
    };

    const handleFilterChange = (filters: any) => {
        // Logic khi người dùng filter, tự động (debounce)
        console.log("Filter changed:", filters);
    };
    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Flight Search</h1>

            {/* Search Bar */}
            <Search onSearch={handleSearchSubmit} />

            {/* Filters and Flight List */}
            <div className="flex flex-col lg:flex-row lg:space-x-6 mt-[10px]">
                {/* Filters */}
                <Filters onFilterChange={handleFilterChange} />
                {/* <div className="w-full lg:w-1/4 p-4 sm:p-6 bg-white rounded-xl shadow-lg mb-6 lg:mb-0">
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
                                <p className="text-sm font-medium text-gray-700 mb-1">Departure Time Slot</p>
                            </Tooltip>
                            <Checkbox.Group
                                options={departureTimeSlotOptions}
                                className="space-y-2 text-gray-700"
                            />

                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Airlines</p>
                            <Checkbox.Group
                                options={airlineSelectOptions}
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
                </div> */}

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
                                onChange={(value) => console.log("Sort by:", value)}
                            >
                                <Select.Option value="cheapest">
                                    <DollarOutlined className="mr-2" /> Cheapest
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
                    <div className='flex flex-col gap-4'>

                        {flights.map((flight) => (
                            <FlightCard key={flight.id} flight={flight} />
                        ))}
                    </div>

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
        flightCode: "VN101",
        plane: {
            id: 1,
            planeCode: "A321",
            planeName: "Airbus A321",
        },
        departureAirport: {
            id: 1,
            airportCode: "SGN",
            airportName: "Tan Son Nhat International Airport",
        },
        arrivalAirport: {
            id: 2,
            airportCode: "HAN",
            airportName: "Noi Bai International Airport",
        },
        departureDate: "2025-06-10",
        arrivalDate: "2025-06-10",
        departureTime: "08:00",
        arrivalTime: "10:00",
        originalPrice: 1200000,
        interAirports: [],
        seats: [
            {
                seat: {
                    id: 1,
                    seatCode: "ECO",
                    seatName: "Economy",
                    price: 1200000,
                    description: "Standard economy class seat",
                },
                quantity: 100,
                remainingTickets: 45,
                price: 1200000,
            },
            {
                seat: {
                    id: 2,
                    seatCode: "BUS",
                    seatName: "Business",
                    price: 2500000,
                    description: "Spacious business class seat",
                },
                quantity: 20,
                remainingTickets: 5,
                price: 2500000,
            },
        ],
    },
    {
        id: 2,
        flightCode: "VN202",
        plane: {
            id: 2,
            planeCode: "B787",
            planeName: "Boeing 787 Dreamliner",
        },
        departureAirport: {
            id: 2,
            airportCode: "HAN",
            airportName: "Noi Bai International Airport",
        },
        arrivalAirport: {
            id: 3,
            airportCode: "DAD",
            airportName: "Da Nang International Airport",
        },
        departureDate: "2025-06-11",
        arrivalDate: "2025-06-11",
        departureTime: "14:30",
        arrivalTime: "16:00",
        originalPrice: 1500000,
        interAirports: [
            {
                airport: {
                    id: 4,
                    airportCode: "HUI",
                    airportName: "Phu Bai Airport",
                },
                departureDateTime: "2025-06-11T15:20:00",
                arrivalDateTime: "2025-06-11T15:00:00",
                note: "Transit stop in Hue",
            },
        ],
        seats: [
            {
                seat: {
                    id: 1,
                    seatCode: "ECO",
                    seatName: "Economy",
                    price: 1500000,
                    description: "Standard economy class seat",
                },
                quantity: 120,
                remainingTickets: 80,
                price: 1500000,
            },
            {
                seat: {
                    id: 2,
                    seatCode: "BUS",
                    seatName: "Business",
                    price: 2800000,
                    description: "Luxury business class",
                },
                quantity: 15,
                remainingTickets: 3,
                price: 2800000,
            },
        ],
    },
    {
        id: 3,
        flightCode: "VN303",
        plane: {
            id: 3,
            planeCode: "A350",
            planeName: "Airbus A350",
        },
        departureAirport: {
            id: 1,
            airportCode: "SGN",
            airportName: "Tan Son Nhat International Airport",
        },
        arrivalAirport: {
            id: 5,
            airportCode: "CXR",
            airportName: "Cam Ranh International Airport",
        },
        departureDate: "2025-06-12",
        arrivalDate: "2025-06-12",
        departureTime: "06:00",
        arrivalTime: "07:30",
        originalPrice: 1000000,
        interAirports: [],
        seats: [
            {
                seat: {
                    id: 1,
                    seatCode: "ECO",
                    seatName: "Economy",
                    price: 1000000,
                    description: "Standard seat with basic amenities",
                },
                quantity: 90,
                remainingTickets: 60,
                price: 1000000,
            },
            {
                seat: {
                    id: 3,
                    seatCode: "PREM",
                    seatName: "Premium Economy",
                    price: 1800000,
                    description: "More space and better food",
                },
                quantity: 20,
                remainingTickets: 10,
                price: 1800000,
            },
        ],
    },
];

const departureTimeSlotOptions: CheckboxOptionType[] = [
    { label: 'Morning Shift (6 AM - 12 PM)', value: 'morning' },
    { label: 'Afternoon Shift (12 PM - 6 PM)', value: 'afternoon' },
    { label: 'Evening Shift (6 PM - 12 AM)', value: 'evening' },
    { label: 'Night Shift (0 AM - 6 AM)', value: 'night' },]

const tripOptions = [
    { label: 'All', value: 'all' },
    { label: "Direct", value: "direct" },
    { label: "Transit", value: "transit" },
];
export default FlightSearchPage;