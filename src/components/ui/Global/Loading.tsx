import { Spin } from "antd"

export const GlobalLoading = () => {
    return (<div
        style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        <Spin size="large" tip="Đang tải dữ liệu..." />
    </div>);
}