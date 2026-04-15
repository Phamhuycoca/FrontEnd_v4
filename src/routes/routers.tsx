import App from "../App";
import type { TypeRouter } from "../types/RouterType";
import { DangNhapPage } from "../pages/dang-nhap";
import VaiTroModule from "../modules/dm-vai-tro";
import DanhMucModule from "../modules/dm-danh-muc";
import { AdminLayout } from "../components/layouts";
import LoadingPage from "../pages/loading-page";

const Routers: TypeRouter[] = [
    {
        path: '',
        element: <App />
    },
    {
        path: 'quan-tri',
        element: <AdminLayout />,
        children: [
            {
                path: 'quan-ly-vai-tro/*',
                element: <VaiTroModule />
            },
            {
                path: 'quan-ly-danh-muc/*',
                element: <DanhMucModule />
            }
        ]
    },
    {
        path: 'loading',
        element: <LoadingPage />
    },

    {
        path: 'dang-nhap',
        element: <DangNhapPage />
    },
    // {
    //     path: '/dang-nhap',
    //     element: <PublicRoute />,
    //     children: [
    //         {
    //             path: '',
    //             element: <DangNhapPage />
    //         }
    //     ]
    // },
];
export { Routers };