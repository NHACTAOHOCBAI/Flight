import { Button, Result } from 'antd';
import { useNavigate } from 'react-router';
import { IoMdArrowBack } from "react-icons/io";
const ThirdStep = ({ isBookingFlight = true }: { isBookingFlight: boolean }) => {
    const navigate = useNavigate()
    return (
        <div className='bg-white'>
            <Result
                status="success"
                title="Your Booking Is Completed!"
                subTitle="We've sent your ticket and all relevant information to your email address. Please check your inbox (and spam folder)."
                extra={
                    isBookingFlight ?
                        [
                            <Button key="book-another" onClick={() => navigate("/admin/flights")}><IoMdArrowBack /> Go Back Flight Page</Button>,
                        ]
                        :
                        [
                            <Button key="book-another" onClick={() => navigate("/admin/tickets")}><IoMdArrowBack /> Go Back Tickets Page</Button>,
                        ]
                }
            />

        </div>
    )
}

export default ThirdStep;