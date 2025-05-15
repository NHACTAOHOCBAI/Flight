import { Button, Form, Input, message } from "antd";
import { useCreateAirline } from "../../hooks/useAirlines";
import type { UploadFile } from "antd/lib";
import { useState } from "react";
import UploadImage from "./test";


interface Props {
    refetchData: () => Promise<void>;
}

const NewAirline = ({ refetchData }: Props) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();
    const { mutate, isPending } = useCreateAirline();
    const [messageApi, contextHolder] = message.useMessage();

    const handleNew = (value: Airline) => {
        mutate({
            airline: value,
            ...(fileList && fileList.length > 0 && {
                logo: fileList[0].originFileObj as File,
            })
        }, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Create airline successfully");
                finish();
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };
    const finish = () => {
        setFileList([])
        form.resetFields()
    }
    return (
        <>
            {contextHolder}
            <div className="bg-white  drop-shadow-xs p-[24px] w-[40%] h-full rounded-[8px]">
                <div className="font-medium  text-[16px] mb-[10px]">Create Airline</div>
                <Form form={form} layout="vertical" onFinish={handleNew}>
                    <Form.Item label="Code" name="airlineCode" rules={[{ required: true }]}>
                        <Input disabled={isPending} placeholder="Enter airline code" />
                    </Form.Item>
                    <Form.Item label="Name" name="airlineName" rules={[{ required: true }]}>
                        <Input disabled={isPending} placeholder="Enter airline name" />
                    </Form.Item>
                    <div className="mb-[10px]">
                        <h3 className="mb-[10px]">Logo<span className="text-gray-300">{" (optional)"}</span></h3>
                        <UploadImage
                            isPending={isPending}
                            fileList={fileList}
                            setFileList={setFileList}
                        />
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isPending} style={{ width: "100%" }}>
                            Create Airline
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default NewAirline;
