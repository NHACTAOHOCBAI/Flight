/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Form, Modal, Slider } from "antd"
import useSelectOptions from "../../utils/selectOptions";
interface IProps {
    isFilterOpen: boolean,
    setIsFilterOpen: (value: boolean) => void
    refetchData: any
}

const Filter = ({ isFilterOpen, setIsFilterOpen, refetchData }: IProps) => {
    const [form] = Form.useForm();
    const { airlineSelectOptions, seatSelectOptions } = useSelectOptions();
    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        setIsFilterOpen(false);
    };
    const handleFinish = (values: any) => {
        console.log(values);
    };

    return (
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
                    seats: [],
                    airlines: [],
                }}
            >
                <Form.Item label="Straight Flight" name="straightFlight" valuePropName="checked">
                    <Checkbox />
                </Form.Item>
                <Form.Item label="Seats" name="seats">
                    <Checkbox.Group options={seatSelectOptions} />
                </Form.Item>

                <Form.Item label="Airlines" name="airlines">
                    <Checkbox.Group options={airlineSelectOptions} />
                </Form.Item>

                <Form.Item label="Price" name="price">
                    <Slider range max={1000} min={0} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Filter