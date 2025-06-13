import { Button, message, Modal } from "antd";
import Ticket from "../booking/secondStep/Ticket";
import { useEffect, useState } from "react";
import { getMyTicket, refundMyTicket } from "../../services/ticket";
import icons from "../../assets/icons";
import { notification } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import formatPrice from "../../utils/formatVNprice";

const getTicketStatus = (departureDate?: string): string => {
    if (!departureDate) {
        return "Unknown";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const departure = new Date(departureDate);
    if (isNaN(departure.getTime())) {
        return "Invalid";
    }
    departure.setHours(0, 0, 0, 0);

    if (departure > today) {
        return "Upcoming";
    } else if (departure < today) {
        return "Expired";
    } else {
        return "Today";
    }
};
const History = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [myTickets, setMyTickets] = useState<Ticket[]>([])
    const [ticket, setTicket] = useState<Ticket>()
    const fetchMyTickets = async () => {
        const res = await getMyTicket();
        setMyTickets(res)
    }
    useEffect(() => {
        fetchMyTickets();
    }, [])
    return (
        <>
            <RefundModal
                fetchMyTickets={fetchMyTickets}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                ticket={ticket}
            />
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <p className="text-xl font-medium gap-[10px]">My tickets</p>
                <div className="gap-[10px] flex flex-col mt-4 max-h-[450px] overflow-y-auto pr-2">
                    {
                        myTickets.map((item) => {
                            return (
                                <div className="p-[5px] border-2 flex gap-[10px] border-dashed border-gray-500 rounded-lg bg-amber-100 w-fit" key={item.id}>
                                    <Ticket
                                        ticket={{
                                            flight: item.flight as Flight,
                                            seatId: item.seat?.id as number,
                                            passengerName: item.passengerName,
                                            passengerEmail: item.passengerEmail,
                                            passengerPhone: item.passengerPhone,
                                            passengerIDCard: item.passengerIDCard
                                        }}
                                    />
                                    <div className="flex flex-col justify-center items-center">
                                        <Button
                                            onClick={() => {
                                                setIsOpen(true)
                                                setTicket(item)
                                            }}
                                            disabled={getTicketStatus(item.flight?.departureDate) !== "Upcoming"}
                                        >
                                            {icons.reset} Refund
                                        </Button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

const RefundModal = ({ isOpen, setIsOpen, ticket, fetchMyTickets }: { isOpen: boolean, setIsOpen: (value: boolean) => void, ticket: Ticket | undefined, fetchMyTickets: () => void }) => {
    const [isPending, setIsPending] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const handleCancel = () => {
        setIsOpen(false);
    };

    const handleRefund = async () => {
        setIsPending(true);
        try {
            await refundMyTicket(ticket!.id)
            messageApi.success("Create airport successfully");
            setIsOpen(false)
            fetchMyTickets()
        }
        catch {
            notification.error({
                message: "Error",
                description: "Failed to process refund. Please try again.",
            });
        }
        setIsPending(false);
    };

    const refundAmount = (ticket?.flight?.originalPrice ?? 0) * ((ticket?.seat?.price ?? 0) / 100) * 0.5

    return (
        <>
            {contextHolder}
            <Modal
                loading={isPending}
                title={
                    <div className="flex items-center gap-2">
                        <ExclamationCircleFilled className="text-yellow-500" />
                        <span>Refund Ticket</span>
                    </div>
                }
                open={isOpen}
                onCancel={handleCancel}
                onOk={handleRefund}
                okText="Confirm Refund"
                cancelText="Cancel"
                okButtonProps={{ className: "bg-blue-500 hover:bg-blue-600" }}
                className="rounded-lg"
            >
                <div className="flex flex-col gap-3 p-4 text-gray-800 dark:text-gray-200">
                    <p className="text-base font-medium">
                        Do you want to refund ticket for flight{" "}
                        <span className="font-bold">{ticket?.flight?.flightCode || "N/A"}</span>?
                    </p>
                    <p className="text-base">
                        Refund amount: <span className="font-bold text-green-600 dark:text-green-400">${formatPrice(refundAmount)}</span> (50% of original price).
                    </p>
                    <p className="text-base">
                        This action cannot be undone.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        Please confirm to proceed with the refund.
                    </p>
                </div>
            </Modal>
        </>
    );
};

export default History