import { Descriptions, Drawer } from "antd"
import type { DescriptionsProps } from "antd/lib"

interface Props {
    isDetailOpen: boolean
    setIsDetailOpen: (value: boolean) => void
    detailSeat: Seat
}
const DetailSeat = ({ isDetailOpen, setIsDetailOpen, detailSeat }: Props) => {
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'ID',
            children: detailSeat.id,
        },
        {
            key: '2',
            label: 'Seat Code',
            children: detailSeat.seatCode,
        },
        {
            key: '3',
            label: 'Seat Class',
            children: detailSeat.seatName,
        },
        {
            key: '4',
            label: 'Price',
            children: detailSeat.price + "%",
        },
        {
            key: '5',
            label: 'Description',
            children: detailSeat.description || <div className="text-rose-300">No desc...</div>,
        }
    ];

    return (
        <Drawer
            title="Seat View"
            closable={{ 'aria-label': 'Close Button' }}
            onClose={() => setIsDetailOpen(false)}
            open={isDetailOpen}
        >
            <Descriptions bordered items={items} column={1} />
        </Drawer>
    );

}
export default DetailSeat;