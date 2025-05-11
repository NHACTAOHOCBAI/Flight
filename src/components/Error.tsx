import { Button, Result } from "antd";

const Error = ({ error }: { error: string }) => (
    <div className="w-full h-full justify-center items-center flex">
        <Result
            status="error"
            title={error}
            extra={
                <Button type="primary" key="console">
                    Go Console
                </Button>
            }
        />
    </div>
)

export default Error