
import AdminTicketInformation from "./AdminTicketInformation"

const FirstStep = () => {
    return (
        <div>
            <div style={{
                lineHeight: 2,

            }}
                className="flex justify-items-start font-medium"
            >
                <span className="text-red-500">Note : </span> Please pay attention to the number of remaining seats in the table on the right to book appropriately.
            </div>
            <AdminTicketInformation />
        </div>
    )
}
export default FirstStep