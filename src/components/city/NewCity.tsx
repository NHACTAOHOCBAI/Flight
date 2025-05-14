import { Button, Form, Input, message } from 'antd';
import { useCreateCity } from '../../hooks/useCities';

interface Prop {
    refetchData: () => Promise<void>
}
const NewCity = ({ refetchData }: Prop) => {
    const [form] = Form.useForm();
    const { mutate, isPending } = useCreateCity();
    const [messageApi, contextHolder] = message.useMessage();
    const handleNew = (value: City) => {
        mutate(value, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Create city successfully");
                finish();
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        })
    }
    const finish = () => {
        form.resetFields()
    }
    return (
        <>
            {contextHolder}
            <div className='bg-white  drop-shadow-xs p-[24px] w-[40%] h-full rounded-[8px]'>
                <div className='font-medium text-[16px] mb-[10px]'>Create City</div>
                <Form
                    form={form}
                    style={{ height: '100%' }}
                    layout={"vertical"}
                    onFinish={handleNew}
                >

                    <Form.Item label="Code"
                        name="cityCode"
                        rules={[{ required: true }]}>
                        <Input
                            disabled={isPending}
                            placeholder="please input city code" />
                    </Form.Item>

                    <Form.Item label="City"
                        name="cityName"
                        rules={[{ required: true }]}>
                        <Input
                            disabled={isPending}
                            placeholder="please input city name" />
                    </Form.Item>

                    <Form.Item >
                        <Button
                            style={{ width: '100%', marginTop: 20 }}
                            type="primary" htmlType="submit"
                            loading={isPending}
                        >New City</Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default NewCity;