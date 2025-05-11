import { Spin } from "antd"
import { LoadingOutlined } from '@ant-design/icons';
const Loading = () => {
    return (
        <div className="w-full h-full justify-center items-center flex">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
    )
}
export default Loading