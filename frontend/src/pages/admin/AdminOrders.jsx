import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import "./AdminOrders.css";


const API_BASE_URL =
    "http://localhost:3000/api";


function AdminOrders() {

    const navigate =
        useNavigate();


    const [orders, setOrders] =
        useState([]);

    const [pagination, setPagination] =
        useState(null);

    const [status, setStatus] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const limit = 10;


    async function loadOrders() {

        try {

            setLoading(true);

            setError("");


            const token =
                localStorage.getItem("token");


            const params =
                new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString()
                });


            if (status) {

                params.append(
                    "status",
                    status
                );
            }


            const response =
                await fetch(
                    `${API_BASE_URL}/admin/orders?${params.toString()}`,
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
                    "خطا در دریافت سفارش‌ها"
                );
            }


            setOrders(
                data.data || []
            );


            setPagination(
                data.pagination || null
            );

        }
        catch (error) {

            console.error(
                "Admin orders error:",
                error
            );


            setError(
                error.message ||
                "خطایی در دریافت سفارش‌ها رخ داد."
            );

        }
        finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        loadOrders();

    }, [page, status]);


    function handleStatusChange(event) {

        setStatus(
            event.target.value
        );

        setPage(1);
    }


    function getStatusText(orderStatus) {

        switch (orderStatus) {

            case "paid":
                return "پرداخت‌شده";

            case "pending":
                return "در انتظار پرداخت";

            case "failed":
                return "ناموفق";

            case "cancelled":
                return "لغوشده";

            default:
                return orderStatus || "-";
        }
    }


    function formatPrice(price) {

        return Number(price || 0)
            .toLocaleString("fa-IR");
    }


    function formatDate(date) {

        if (!date) {
            return "-";
        }


        return new Date(date)
            .toLocaleString("fa-IR");
    }


    return (

        <div
            className="admin-orders"
            dir="rtl"
        >

            {/* =========================
                Header
            ========================= */}

            <div className="admin-page-header">

                <div>

                    <h2>
                        سفارش‌ها
                    </h2>

                    <p>
                        مدیریت و مشاهده سفارش‌های ثبت‌شده
                    </p>

                </div>


                <div className="admin-filter">

                    <select
                        value={status}
                        onChange={
                            handleStatusChange
                        }
                    >

                        <option value="">
                            همه سفارش‌ها
                        </option>

                        <option value="paid">
                            پرداخت‌شده
                        </option>

                        <option value="pending">
                            در انتظار پرداخت
                        </option>

                        <option value="failed">
                            ناموفق
                        </option>

                        <option value="cancelled">
                            لغوشده
                        </option>

                    </select>

                </div>

            </div>


            {/* =========================
                Error
            ========================= */}

            {error && (

                <div className="admin-error">

                    {error}

                </div>

            )}


            {/* =========================
                Table
            ========================= */}

            <div className="admin-table-card">

                {loading ? (

                    <div className="admin-table-loading">

                        در حال دریافت سفارش‌ها...

                    </div>

                ) : orders.length === 0 ? (

                    <div className="admin-empty">

                        سفارشی پیدا نشد.

                    </div>

                ) : (

                    <div className="admin-table-wrapper">

                        <table className="admin-table">

                            <thead>

                                <tr>

                                    <th>
                                        شماره
                                    </th>

                                    <th>
                                        مشتری
                                    </th>

                                    <th>
                                        مبلغ
                                    </th>

                                    <th>
                                        وضعیت
                                    </th>

                                    <th>
                                         تاریخ و ساعت 
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {orders.map(
                                    (order) => (

                                        <tr
                                            key={order.id}
                                            className="admin-order-row"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/orders/${order.id}`
                                                )
                                            }
                                        >

                                            <td>

                                                #{order.id}

                                            </td>


                                            <td>

                                                <div className="customer-cell">

                                                    <strong>
                                                        {
                                                            order.first_name
                                                        }{" "}
                                                        {
                                                            order.last_name
                                                        }
                                                    </strong>

                                                    <small>
                                                        {
                                                            order.phone
                                                        }
                                                    </small>

                                                </div>

                                            </td>


                                            <td>

                                                {
                                                    formatPrice(
                                                        order.total_amount
                                                    )
                                                }

                                                <span className="currency">
                                                    تومان
                                                </span>

                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        `order-status ${order.status}`
                                                    }
                                                >
                                                    {
                                                        getStatusText(
                                                            order.status
                                                        )
                                                    }
                                                </span>

                                            </td>


                                            <td>

                                                {
                                                    formatDate(
                                                        order.created_at
                                                    )
                                                }

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* =========================
                Pagination
            ========================= */}

            {pagination &&
                pagination.totalPages > 1 && (

                    <div className="admin-pagination">

                        <button
                            disabled={
                                page <= 1
                            }
                            onClick={() =>
                                setPage(
                                    page - 1
                                )
                            }
                        >
                            قبلی
                        </button>


                        <span>

                            صفحه{" "}

                            <strong>
                                {pagination.page}
                            </strong>

                            {" "}از{" "}

                            <strong>
                                {pagination.totalPages}
                            </strong>

                        </span>


                        <button
                            disabled={
                                page >=
                                pagination.totalPages
                            }
                            onClick={() =>
                                setPage(
                                    page + 1
                                )
                            }
                        >
                            بعدی
                        </button>

                    </div>

                )}

        </div>
    );
}


export default AdminOrders;