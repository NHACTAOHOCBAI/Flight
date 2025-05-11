import { Button, Form, Input } from 'antd';

const NewCity = () => {
    const [form] = Form.useForm();
    return (
        <div className='bg-white p-[24px] w-[40%] h-full rounded-[8px]'>
            <div className='font-medium text-[16px] mb-[10px]'>Create City</div>
            <Form
                style={{ height: '100%' }}
                layout={"vertical"}
                form={form}
            >

                <Form.Item label="Code"
                    name="cityCode"
                    rules={[{ required: true }]}>
                    <Input placeholder="please input city code" />
                </Form.Item>

                <Form.Item label="City"
                    name="cityName"
                    rules={[{ required: true }]}>
                    <Input placeholder="please input city name" />
                </Form.Item>

                <Form.Item >
                    <Button
                        style={{ width: '100%', marginTop: 20 }}
                        type="primary" htmlType="submit">New City</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default NewCity;