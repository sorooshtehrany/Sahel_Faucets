import {
    useEffect,
    useState
} from "react";

import "./AdminDashboard.css";


const API_BASE_URL =
    "http://localhost:3000/api";


function AdminDashboard() {

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    async function loadDashboard() {

        try {

            setLoading(true);

            setError("");


            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    `${API_BASE_URL}/admin/dashboard`,
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "خطا در دریافت اطلاعات داشبورد"
                );
            }


            setDashboard(data);

        }
        catch (error) {

            console.error(
                "Dashboard error:",
                error
            );

            setError(
                error.message ||
                "خطایی در دریافت اطلاعات رخ داد."
            );
        }
        finally {

            setLoading(false);
        }
    }


    useEffect(() => {

        loadDashboard();

    }, []);


    if (loading) {

        return (
            <div className="admin-loading">

                در حال دریافت اطلاعات...

            </div>
        );
    }


    if (error) {

        return (
            <div className="admin-error">

                {error}

            </div>
        );
    }


    if (!dashboard) {
        return null;
    }


    return (

        <div
            className="admin-dashboard"
            dir="rtl"
        >

            <div className="admin-dashboard-header">

                <div>

                    <h2>
                        داشبورد
                    </h2>

                    <p>
                        نمای کلی وضعیت فروشگاه
                    </p>

                </div>

            </div>


            <div className="admin-stat-grid">


                {/* =========================
                    Total Orders
                ========================= */}

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        🛒
                    </div>

                    <div className="admin-stat-info">

                        <span>
                            کل سفارش‌ها
                        </span>

                        <strong>
                            {dashboard.orders.total}
                        </strong>

                    </div>

                </div>


                {/* =========================
                    Paid Orders
                ========================= */}

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        ✓
                    </div>

                    <div className="admin-stat-info">

                        <span>
                            سفارش‌های پرداخت‌شده
                        </span>

                        <strong>
                            {dashboard.orders.paid}
                        </strong>

                    </div>

                </div>


                {/* =========================
                    Sales
                ========================= */}

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        💰
                    </div>

                    <div className="admin-stat-info">

                        <span>
                            مجموع فروش
                        </span>

                        <strong>
                            {Number(
                                dashboard.sales.total
                            ).toLocaleString("fa-IR")}
                            <small>
                                {" "}تومان
                            </small>
                        </strong>

                    </div>

                </div>


                {/* =========================
                    Customers
                ========================= */}

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        👤
                    </div>

                    <div className="admin-stat-info">

                        <span>
                            مشتریان
                        </span>

                        <strong>
                            {dashboard.customers.total}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =========================
                Order Status
            ========================= */}

            <div className="admin-section">

                <div className="admin-section-title">

                    وضعیت سفارش‌ها

                </div>


                <div className="admin-order-status">


                    <div className="status-item">

                        <span>
                            پرداخت‌شده
                        </span>

                        <strong>
                            {dashboard.orders.paid}
                        </strong>

                    </div>


                    <div className="status-item">

                        <span>
                            در انتظار پرداخت
                        </span>

                        <strong>
                            {dashboard.orders.pending}
                        </strong>

                    </div>


                    <div className="status-item">

                        <span>
                            ناموفق
                        </span>

                        <strong>
                            {dashboard.orders.failed}
                        </strong>

                    </div>


                    <div className="status-item">

                        <span>
                            لغوشده
                        </span>

                        <strong>
                            {dashboard.orders.cancelled}
                        </strong>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default AdminDashboard;