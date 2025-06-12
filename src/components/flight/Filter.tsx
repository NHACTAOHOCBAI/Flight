/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Form, Modal, Slider, message } from "antd";
import useSelectOptions from "../../utils/selectOptions";
import formatPrice from "../../utils/formatVNprice";

interface IProps {
    isFilterOpen: boolean;
    setIsFilterOpen: (value: boolean) => void;
    setFlightsData: React.Dispatch<React.SetStateAction<Flight[]>>;
    originalFlightsData: Flight[];
}

const Filter = ({ isFilterOpen, setIsFilterOpen, setFlightsData, originalFlightsData }: IProps) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const { airlineSelectOptions, seatSelectOptions } = useSelectOptions();

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields();
        setFlightsData(originalFlightsData); // Khôi phục dữ liệu gốc
        setIsFilterOpen(false);
    };

    const handleFinish = (values: any) => {
        console.log("Filter values:", values); // Debug giá trị đầu vào
        try {
            // Lọc dữ liệu từ originalFlightsData
            const filteredFlights = originalFlightsData.filter((flight) => {
                // Lọc chuyến bay thẳng
                const matchesStraightFlight = values.straightFlight
                    ? flight.interAirports.length === 0
                    : true;

                // Lọc theo loại ghế
                const matchesSeats = values.seats?.length
                    ? flight.seats.some((seat) =>
                        values.seats.includes(seat.seat.id) // So sánh với seat.id (chuyển thành string)
                    )
                    : true;

                // Lọc theo hãng hàng không
                const matchesAirlines = values.airlines?.length
                    ? values.airlines.includes(flight.plane.airline.id) // So sánh với airline.id
                    : true;

                // Lọc theo giá

                const matchesPrice = values.price && values.price[1] !== 5000000
                    ? flight.originalPrice >= values.price[0] && flight.originalPrice <= values.price[1]
                    : true;

                return matchesStraightFlight && matchesSeats && matchesAirlines && matchesPrice;
            });

            // Cập nhật danh sách chuyến bay
            setFlightsData(filteredFlights);

            if (filteredFlights.length === 0) {
                messageApi.warning("No flights found matching your filter criteria.");
            } else {
                messageApi.success(`Found ${filteredFlights.length} flights.`);
            }

            setIsFilterOpen(false); // Đóng modal sau khi lọc
        } catch (error) {
            messageApi.error("An error occurred while filtering. Please try again.");
            console.error("Filter error:", error);
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title="Filter By"
                open={isFilterOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Filter"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    initialValues={{
                        straightFlight: false,
                        seats: [],
                        airlines: [],
                    }}
                >
                    <Form.Item label="Straight Flight" name="straightFlight" valuePropName="checked">
                        <Checkbox>Straight Flight Only</Checkbox>
                    </Form.Item>
                    <Form.Item label="Seats" name="seats">
                        <Checkbox.Group options={seatSelectOptions} />
                    </Form.Item>
                    <Form.Item label="Airlines" name="airlines">
                        <Checkbox.Group options={airlineSelectOptions} />
                    </Form.Item>
                    <Form.Item label="Price Range (VND)" name="price">
                        <Slider
                            range
                            min={0}
                            max={5000000} // Điều chỉnh max theo giá trị thực tế của originalPrice
                            step={100000} // Bước nhảy 100,000 VND
                            tipFormatter={(value) => formatPrice(value ?? 0)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Filter;