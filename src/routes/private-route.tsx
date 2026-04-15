import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAppSelector } from '../redux/hooks';

interface PrivateRouteProps {
    element: ReactNode;
}

export const PrivateRoute = ({ element }: PrivateRouteProps) => {
    const { isAuthenticated } = useAppSelector(state => state.auth);


    return isAuthenticated ? <>{element}</> : <Navigate to="/dang-nhap" replace />;
};