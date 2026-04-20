import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalLoading } from "../components/ui/Global";
import { setLoading } from "../redux/slice/authSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../redux/hooks";
import nguoiDungService from "../utils/services/nguoi-dung-service";
import { setUser } from "../redux/slice/userSlice";

export default function LoadingPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, nguoi_dung_id } = useAppSelector(x => x.auth);
    useEffect(() => {
        const init = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                dispatch(setLoading(false));
                nguoiDungService.getById(nguoi_dung_id).subscribe((res => {
                    dispatch(setUser(res.data));
                    navigate("/quan-tri", { replace: true });
                }), err => {
                    console.log(err);
                });
            } catch {
                navigate("/dang-nhap", { replace: true });
            }
        };
        init();
    }, []);

    if (loading) return <GlobalLoading />;
}