import { Avatar, Button, Form, Input, message } from "antd"
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/app/store";
import { useEffect, useState } from "react";
import { updateProfile } from "../../services/profile";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { getCurrentUser } from "../../services/auth";
import { login } from "../../redux/features/user/userSlide";
const MyProfile = () => {
    const [isPending, setIsPending] = useState(false);
    const dispath = useAppDispatch()
    const [messageApi, contextHolder] = message.useMessage();
    const fetchUserInf = async () => {
        const response = await getCurrentUser();
        dispath(login(response));
    }
    const handleUpdateProfile = async (values: { fullName: string; phone: string }) => {
        try {
            setIsPending(true);
            await updateProfile(values);
            await fetchUserInf()
            messageApi.success("Update profile successfully");
        }
        catch (error) {
            if (error && typeof error === "object" && "message" in error) {
                messageApi.error((error as { message: string }).message);
            } else {
                messageApi.error("An error occurred while updating profile");
            }
        }
        setIsPending(false);
    }
    const [form] = Form.useForm();
    const myAccount = useSelector((state: RootState) => state.user).user
    const [infoUser, setInfoUser] = useState({
        fullName: "",
        username: "",
        roleName: ""
    })
    useEffect(() => {
        setInfoUser({
            fullName: myAccount.fullName as string,
            username: myAccount.username as string,
            roleName: myAccount.role?.roleName as string
        })
        form.setFieldsValue({
            fullName: myAccount.fullName,
            phone: myAccount.phone
        });
    }, [myAccount, form])
    return (
        <>
            {contextHolder}
            <div className="p-[20px] bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">My Profile</h1>
                <div className="flex w-full h-full">
                    <div className="flex-2 flex items-center justify-center text-center">
                        <div>
                            <Avatar shape="circle" size={164} icon={<UserOutlined />} />
                            <p className="text-[18px] font-bold">{infoUser.fullName}</p>
                            <p>{infoUser.username}</p>
                            <p>{infoUser.roleName}</p>
                        </div>
                    </div>
                    <div className="flex-3">
                        <Form
                            form={form}
                            style={{ height: '100%' }}
                            layout={"vertical"}
                            onFinish={handleUpdateProfile}
                        >
                            <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                                <Input disabled={isPending} />
                            </Form.Item>
                            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                                <Input disabled={isPending} />
                            </Form.Item>
                            <div className="flex justify-between">
                                <Button type="primary" disabled={isPending}>
                                    Change password
                                </Button>
                                <Button type="primary" onClick={() => form.submit()} disabled={isPending}>
                                    Update profile
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}
export default MyProfile