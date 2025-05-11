import { Button, Form, Input, message, Select } from "antd";
import { useCreateAirport } from "../../hooks/useAiports";


interface Props {
    refetchData: () => Promise<void>;
    citySelectOptions: {
        value: number,
        label: React.ReactNode
    }[]
}

const NewAirport = ({ refetchData, citySelectOptions }: Props) => {
    const { mutate, isPending } = useCreateAirport();
    const [messageApi, contextHolder] = message.useMessage();

    const handleNew = (value: { airportCode: string; airportName: string; cityId: number; }) => {
        mutate(value, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Create airport successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };
    return (
        <>
            {contextHolder}
            <div className="bg-white p-[24px] w-[40%] h-full rounded-[8px]">
                <div className="font-medium text-[16px] mb-[10px]">Create Airport</div>
                <Form layout="vertical" onFinish={handleNew}>
                    <Form.Item label="Code" name="airportCode" rules={[{ required: true }]}>
                        <Input disabled={isPending} placeholder="Enter airport code" />
                    </Form.Item>
                    <Form.Item label="Name" name="airportName" rules={[{ required: true }]}>
                        <Input disabled={isPending} placeholder="Enter airport name" />
                    </Form.Item>
                    <Form.Item label="Located At" name="cityId" rules={[{ required: true }]}>
                        <Select disabled={isPending} options={citySelectOptions} placeholder="Enter airport name" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isPending} style={{ width: "100%" }}>
                            Create Airport
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default NewAirport;
