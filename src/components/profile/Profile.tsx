import { Button, Form, Input, message } from "antd"
// import { UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/app/store";
import { useEffect, useState } from "react";
import { updateProfile } from "../../services/profile";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { getCurrentUser } from "../../services/auth";
import { login } from "../../redux/features/user/userSlide";
import type { UploadFile } from "antd/lib";
import UploadImage from "../../components/airline/test";
import UpdatePassword from "./UpdatePassword";
const MyProfile = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [fileList, setFileList] = useState<UploadFile[]>([]);
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
            await updateProfile({
                profile: values,
                avatar: fileList && fileList.length > 0 ? fileList[0].originFileObj as File : undefined
            });
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
    useEffect(() => {
        setFileList([
            {
                uid: '-1',
                name: 'airline_logo.jpg',
                status: 'done',
                url: myAccount.avatar || '',
            },
        ])
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
                            {/* <Avatar shape="circle" size={164} icon={<UserOutlined />} /> */}
                            <div className="mb-[10px]">
                                <UploadImage
                                    circle={true}
                                    isPending={isPending}
                                    fileList={fileList}
                                    setFileList={setFileList}
                                />
                            </div>
                            <p className="text-[18px] font-bold">{myAccount.fullName}</p>
                            <p>{myAccount.username}</p>
                            <p>{myAccount.role?.roleName}</p>
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
                                <Button type="primary" disabled={isPending} onClick={() => setIsModalOpen(true)}>
                                    Change password
                                </Button>
                                <Button type="primary" onClick={() => form.submit()} disabled={isPending}>
                                    Update profile
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
                <UpdatePassword
                    fetchUserInf={fetchUserInf}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                />
            </div>
        </>
    )
}
export default MyProfile