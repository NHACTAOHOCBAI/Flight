import { Button, Form, Input, message, Select } from "antd";
import { useCreatePlane } from "../../hooks/usePlanes";

interface Props {
    refetchData: () => Promise<void>;
    airlineSelectOptions: {
        value: number;
        label: string;
    }[]
}

const NewPlane = ({ refetchData, airlineSelectOptions }: Props) => {
    const [form] = Form.useForm();
    const { mutate, isPending } = useCreatePlane();
    const [messageApi, contextHolder] = message.useMessage();

    const handleNew = (value: { planeCode: string; planeName: string; airlineId: number; }) => {
        mutate(value, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Create plane successfully");
                finish()
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };
    const finish = () => {
        form.resetFields()
    }
    return (
        <>
            {contextHolder}
            <div className="bg-white  drop-shadow-xs p-[24px] w-[40%] h-full rounded-[8px]">
                <div className="font-medium text-[16px] mb-[10px]">Create Plane</div>
                <Form form={form} layout="vertical" onFinish={handleNew}>
                    <Form.Item label="Code" name="planeCode" rules={[{ required: true }]}>
                        <Input disabled={isPending} placeholder="Enter plane code" />
                    </Form.Item>
                    <Form.Item label="Name" name="planeName" rules={[{ required: true }]}>
                        <Input disabled={isPending} placeholder="Enter plane name" />
                    </Form.Item>
                    <Form.Item label="Airline" name="airlineId" rules={[{ required: true }]}>
                        <Select disabled={isPending} options={airlineSelectOptions} placeholder="Select airline" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isPending} style={{ width: "100%" }}>
                            Create Plane
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default NewPlane;
