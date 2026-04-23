import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectIsAdmin, selectIsVendor } from '../store/slices/authSlice.js';

export function PrivateRoute() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const location = useLocation();
    return isAuthenticated
        ? <Outlet />
        : <Navigate to="/login" state={{ from: location }} replace />;
}

export function AdminRoute() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isAdmin = useSelector(selectIsAdmin);
    const location = useLocation();

    if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
    if (!isAdmin) return <Navigate to="/" replace />;
    return <Outlet />;
}

export function VendorRoute() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isVendor = useSelector(selectIsVendor);
    const location = useLocation();

    if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
    if (!isVendor) return <Navigate to="/" replace />;
    return <Outlet />;
}
