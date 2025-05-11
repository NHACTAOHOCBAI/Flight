import { Button, Form, Input, InputNumber, message } from 'antd';
import { useCreateSeat } from '../../hooks/useSeats';


interface Props {
    refetchData: () => Promise<void>;
}

const NewSeat = ({ refetchData }: Props) => {
    const { mutate, isPending } = useCreateSeat();
    const [messageApi, contextHolder] = message.useMessage();

    const handleNew = (value: Seat) => {
        mutate(value, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Create seat successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };

    return (
        <>
            {contextHolder}
            <div className='bg-white p-[24px] w-[40%] h-full rounded-[8px]'>
                <div className='font-medium text-[16px] mb-[10px]'>Create Seat</div>
                <Form layout="vertical" onFinish={handleNew}>
                    <Form.Item label="Code" name="seatCode" rules={[{ required: true }]}>
                        <Input disabled={isPending} placeholder="please input seat code" />
                    </Form.Item>
                    <Form.Item label="Name" name="seatName" rules={[{ required: true }]}>
                        <Input disabled={isPending} placeholder="please input seat name" />
                    </Form.Item>
                    <Form.Item label="Price" name="price" rules={[{ required: true }]}>
                        <InputNumber addonAfter="%" disabled={isPending} style={{ width: "100%" }} placeholder="please input price rate" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea disabled={isPending} rows={3} placeholder="please input description" />
                    </Form.Item>
                    <Form.Item>
                        <Button style={{ width: '100%', marginTop: 20 }} type="primary" htmlType="submit" loading={isPending} >
                            New Seat
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default NewSeat;
