import { Spin } from "antd"

export const GlobalLoading = () => {
    return (<div className="h-screen flex items-center justify-center">
        <Spin size="large" tip="Đang tải hệ thống..." />
    </div>);
}