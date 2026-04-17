import { Route, Routes } from "react-router-dom";
import { NotFoundPage } from "../../pages/not-found";
import { EpsList } from "./danh-sach";
import { EpsForm } from "./form";

const EpsModule = () => {
    return (
        <Routes>
            <Route path="/" element={<EpsList />}>
                <Route path="/:id" element={<EpsForm />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export { EpsModule };