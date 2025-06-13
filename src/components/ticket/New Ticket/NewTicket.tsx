import { Modal } from "antd";
import AdminBooking from "./booking/AdminBooking";

interface Props {
    refetchData: () => Promise<void>;
    isNewOpen: boolean;
    setIsNewOpen: (value: boolean) => void;
}

const NewTicket = ({ isNewOpen, setIsNewOpen }: Props) => {
    const handleCancel = () => {
        setIsNewOpen(false)
    };
    return (
        <>
            <Modal
                width={1200}
                title="New Account"
                open={isNewOpen}
                onCancel={handleCancel}
                footer={null} // Ẩn cả OK và Cancel
            >
                <AdminBooking />
            </Modal>

        </>
    );
};
export default NewTicket;


