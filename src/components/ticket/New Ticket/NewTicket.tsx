import { Modal } from "antd";
import AdminBooking from "./booking/AdminBooking";

interface Props {
    refetchData: () => Promise<void>;
    isNewOpen: boolean;
    setIsNewOpen: (value: boolean) => void;
}

const NewTicket = ({ isNewOpen, setIsNewOpen, refetchData }: Props) => {
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
                <AdminBooking
                    refetchData={refetchData}
                    setIsNewOpen={setIsNewOpen}
                />
            </Modal>

        </>
    );
};
export default NewTicket;


