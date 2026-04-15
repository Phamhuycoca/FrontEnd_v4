import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalLoading } from "../components/ui/Global";

export default function LoadingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            try {
                // chỗ này load menu, quyền, user info
                await new Promise((resolve) => setTimeout(resolve, 1000));

                navigate("/quan-tri");
            } catch {
                navigate("/dang-nhap");
            }
        };

        init();
    }, []);

    return <GlobalLoading />;
}