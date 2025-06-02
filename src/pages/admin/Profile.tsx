import { Avatar, Button, Form, Input } from "antd"
import { UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/app/store";
import { useEffect, useState } from "react";
// import UploadImage from "../../components/airline/test";
// import type { UploadFile } from "antd/lib";
const MyProfile = () => {
    // const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();
    const isPending = false;
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
        // setFileList([
        //     {
        //         uid: '-1',
        //         name: 'airline_logo.jpg',
        //         status: 'done',
        //         url: myAccount.avatar ?? undefined
        //     },
        // ])
    }, [myAccount])
    return (
        <div className="p-[20px] bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <div className="flex w-full h-full">
                <div className="flex-2 flex items-center justify-center text-center">
                    <div>
                        {/* <UploadImage
                            circle={true}
                            isPending={isPending}
                            fileList={fileList}
                            setFileList={setFileList}
                        /> */}
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
                    // onFinish={handleNew}
                    >
                        <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                            <Input disabled={isPending} />
                        </Form.Item>
                        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
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