import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function AdminRoute({ children }) {

    const {
        user,
        loading,
        isAuthenticated
    } = useAuth();


    // -------------------------
    // هنوز در حال بررسی کاربر
    // -------------------------

    if (loading) {
        return null;
    }


    // -------------------------
    // کاربر وارد نشده
    // -------------------------

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // -------------------------
    // کاربر Admin نیست
    // -------------------------

    if (user?.role !== "admin") {

        return (
            <Navigate
                to="/home"
                replace
            />
        );

    }


    // -------------------------
    // Admin
    // -------------------------

    return children;
}


export default AdminRoute;