import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalLoading } from "../components/ui/Global";
import { setLoading } from "../redux/slice/authSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../redux/hooks";

export default function LoadingPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useAppSelector(x => x.auth.loading);
    useEffect(() => {
        const init = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                dispatch(setLoading(false));
                navigate("/quan-tri", { replace: true });
            } catch {
                navigate("/dang-nhap", { replace: true });
            }
        };

        init();
    }, []);

    if (loading) return <GlobalLoading />;
}