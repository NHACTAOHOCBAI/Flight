import { Form, Input, message, Modal } from "antd";
import { useEffect, useState } from "react";
import { useUpdateAirline } from "../../hooks/useAirlines";
import type { UploadFile } from "antd/lib";
import UploadImage from "./test";


interface Props {
    updatedAirline: Airline;
    isUpdateOpen: boolean;
    setIsUpdateOpen: (value: boolean) => void;
    refetchData: () => Promise<void>;
    setUpdateAirline: (value: Airline) => void
}

const UpdateAirline = ({ setUpdateAirline, updatedAirline, isUpdateOpen, setIsUpdateOpen, refetchData }: Props) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();
    const { mutate, isPending } = useUpdateAirline();
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = (value: Airline) => {
        mutate({
            id: updatedAirline.id,
            airline: value,
            ...(fileList && fileList.length > 0 && {
                logo: fileList[0].originFileObj as File,
            })
        }, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Update airline successfully");
                handleCancel();
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };

    const handleCancel = () => {
        setIsUpdateOpen(false);
        form.resetFields();
        setFileList([
            {
                uid: '-1',
                name: 'airline_logo.jpg',
                status: 'done',
                url: updatedAirline.logo
            },
        ])
        setUpdateAirline({
            id: 0,
            airlineCode: '',
            airlineName: '',
            logo: ''
        });
    };

    useEffect(() => {
        form.setFieldsValue(updatedAirline);
        setFileList([
            {
                uid: '-1',
                name: 'airline_logo.jpg',
                status: 'done',
                url: updatedAirline.logo
            },
        ])
    }, [updatedAirline, form]);

    return (
        <>
            {contextHolder}
            <Modal
                title="Update Airline"
                open={isUpdateOpen}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                confirmLoading={isPending}
            >
                <Form layout="vertical" form={form} onFinish={handleOk}>
                    <Form.Item label="ID" name="id">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Code" name="airlineCode" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item label="Name" name="airlineName" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <div className="mb-[10px]">
                        <h3 className="mb-[10px]">Logo<span className="text-gray-300">{" (optional)"}</span></h3>
                        <UploadImage
                            isPending={isPending}
                            fileList={fileList}
                            setFileList={setFileList}
                        />
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateAirline;
