import { Avatar, Button, Form, Input } from "antd"
import { UserOutlined } from '@ant-design/icons';
const MyProfile = () => {
    const [form] = Form.useForm();
    const isPending = false; // Replace with actual pending state if needed
    return (
        <div className="p-[20px] bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <div className="flex w-full h-full">
                <div className="flex-2 flex items-center justify-center text-center">
                    <div>
                        <Avatar shape="circle" size={164} icon={<UserOutlined />} />
                        <p className="text-[18px] font-bold">Nguyen Dang Phuc</p>
                        <p>dangphucnguyen20112005@gmail.com</p>
                        <p>Admin</p>
                    </div>
                </div>
                <div className="flex-3">
                    <Form
                        form={form}
                        style={{ height: '100%' }}
                        layout={"vertical"}
                    // onFinish={handleNew}
                    >
                        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                            <Input disabled={isPending} />
                        </Form.Item>
                        <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                            <Input disabled={isPending} />
                        </Form.Item>
                        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                            <Input disabled={isPending} />
                        </Form.Item>
                        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                            <Input disabled={isPending} />
                        </Form.Item>
                        <div className="flex justify-between">
                            <Button type="primary" >
                                Change password
                            </Button>
                            <Button type="primary" >
                                Update profile
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}
export default MyProfile