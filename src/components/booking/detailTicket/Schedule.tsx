import dayjs from 'dayjs';

import FlightCard from './flightSchedule';
const Schedule = () => {
    const tickets = JSON.parse(localStorage.getItem('tickets') as string);
    if (!tickets)
        return (<></>)
    const flight: Flight = JSON.parse(localStorage.getItem('booked_flight') as string);
    return (
        <div className="drop-shadow-2xl w-full bg-white flex flex-col justify-between p-[10px] rounded-[10px] gap-[10px]">
            <div className="w-full flex justify-between items-center">
                <h3 className='font-medium text-[16px]'>{"Ho Chi Minh (SGN)"}</h3>
                <p>{"----->"}</p>
                <h3 className='font-medium text-[16px]'>{"Ha Noi (HAN)"}</h3>
            </div>
            <div className="flex">
                <h3>{`${dayjs(flight.departureDate).format('MMM DD, YYYY')} - ${tickets.length} passengers`}</h3>
            </div>
            <div className='w-full h-[1px] bg-blue-300'></div>
            <div className='w-full flex flex-col items-center'>
                <FlightCard
                    flight={flight}
                />
            </div>
        </div>
    )
}
export default Schedule