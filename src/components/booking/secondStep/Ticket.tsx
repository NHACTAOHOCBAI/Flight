const Ticket = () => {
    return (
        <div className=" bg-white relative rounded-xl shadow-md flex w-[800px] overflow-hidden">
            <div className="flex-1 p-6 text-center">
                <div className="text-gray-700 font-semibold text-sm mb-4 ">BOARDING PASS</div>

                <div className="flex justify-between items-center mb-6">

                    <div>
                        <div className="text-blue-700 font-bold text-4xl">JFK</div>
                        <div className="text-sm text-gray-600 font-semibold">NEW YORK</div>
                        <div className="text-sm mt-2">Jan 25, 2025</div>
                        <div className="text-sm text-gray-600">05:50 PM</div>
                    </div>


                    <div className="text-2xl text-gray-400">→</div>


                    <div>
                        <div className="text-blue-700 font-bold text-4xl">CDG</div>
                        <div className="text-sm text-gray-600 font-semibold">PARIS</div>
                        <div className="text-sm mt-2">Jan 26, 2025</div>
                        <div className="text-sm text-gray-600">07:20 AM</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left text-sm text-gray-700">
                    <div><span className="font-bold">Passenger:</span> JANE DOE</div>
                    <div><span className="font-bold">Flight:</span> FR 0123</div>
                </div>
            </div>


            <div className="w-64 bg-blue-100 p-6 text-sm text-gray-800">
                <div className="text-center text-gray-500 mb-6">Lorem Airlines</div>

                <div className="mb-4 text-left">
                    <div><span className="font-semibold">Passenger:</span> JANE DOE</div>
                    <div><span className="font-semibold">classNameName:</span> FIRST</div>
                </div>

                <div className="text-left">
                    <div><span className="font-semibold">Date:</span> Jan 25</div>
                    <div><span className="font-semibold">Boarding:</span> 05:20 PM</div>
                    <div><span className="font-semibold">Depart:</span> 05:50 PM</div>
                </div>
            </div>

        </div>
    )
}
export default Ticket;