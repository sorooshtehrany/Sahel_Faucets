import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import "./AdminOrderDetails.css";


const API_BASE_URL =
    "http://localhost:3000/api";


function AdminOrderDetails() {

    const {
        orderId
    } = useParams();

    const navigate =
        useNavigate();


    const [order, setOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    async function loadOrder() {

        try {

            setLoading(true);

            setError("");


            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    `${API_BASE_URL}/admin/orders/${orderId}`,
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
                    "خطا در دریافت سفارش"
                );
            }


            setOrder(data);

        }
        catch (error) {

            console.error(
                "Order details error:",
                error
            );

            setError(
                error.message ||
                "خطایی در دریافت سفارش رخ داد."
            );

        }
        finally {

            setLoading(false);
        }
    }


    useEffect(() => {

        loadOrder();

    }, [orderId]);


    function getStatusText(status) {

        switch (status) {

            case "paid":
                return "پرداخت‌شده";

            case "pending":
                return "در انتظار پرداخت";

            case "failed":
                return "ناموفق";

            case "cancelled":
                return "لغوشده";

            default:
                return status || "-";
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


    if (loading) {

        return (
            <div className="admin-order-loading">

                در حال دریافت اطلاعات سفارش...

            </div>
        );
    }


    if (error) {

        return (
            <div
                className="admin-order-error"
                dir="rtl"
            >

                <p>
                    {error}
                </p>

                <button
                    onClick={() =>
                        navigate("/admin/orders")
                    }
                >
                    بازگشت به سفارش‌ها
                </button>

            </div>
        );
    }


    if (!order) {
        return null;
    }


    return (

        <div
            className="admin-order-details"
            dir="rtl"
        >

            {/* =========================
                Header
            ========================= */}

            <div className="order-details-header">

                <div>

                    <button
                        className="back-orders-button"
                        onClick={() =>
                            navigate("/admin/orders")
                        }
                    >
                        ← بازگشت به سفارش‌ها
                    </button>

                    <h2>
                        سفارش #{order.order.id}
                    </h2>

                    <p>
                        ثبت شده در{" "}
                        {formatDate(
                            order.order.created_at
                        )}
                    </p>

                </div>


                <span
                    className={
                        `order-status-large ${order.order.status}`
                    }
                >
                    {getStatusText(
                        order.order.status
                    )}
                </span>

            </div>


            {/* =========================
                Customer
            ========================= */}

            <div className="order-info-grid">

                <div className="order-info-card">

                    <h3>
                        اطلاعات مشتری
                    </h3>

                    <div className="order-info-row">

                        <span>
                            نام و نام خانوادگی
                        </span>

                        <strong>
                            {order.customer.first_name}{" "}
                            {order.customer.last_name}
                        </strong>

                    </div>


                    <div className="order-info-row">

                        <span>
                            شماره تماس
                        </span>

                        <strong>
                            {order.customer.phone}
                        </strong>

                    </div>


                    <div className="order-info-row">

                        <span>
                            شناسه مشتری
                        </span>

                        <strong>
                            #{order.customer.id}
                        </strong>

                    </div>

                </div>


                {/* =========================
                    Payment
                ========================= */}

                <div className="order-info-card">

                    <h3>
                        آخرین پرداخت
                    </h3>

                    {order.payment ? (

                        <>
                            <div className="order-info-row">

                                <span>
                                    وضعیت
                                </span>

                                <strong>
                                    {order.payment.status}
                                </strong>

                            </div>


                            <div className="order-info-row">

                                <span>
                                    مبلغ
                                </span>

                                <strong>
                                    {formatPrice(
                                        order.payment.amount
                                    )}{" "}
                                    تومان
                                </strong>

                            </div>


                            <div className="order-info-row">

                                <span>
                                    درگاه
                                </span>

                                <strong>
                                    {order.payment.gateway || "-"}
                                </strong>

                            </div>

                        </>

                    ) : (

                        <div className="no-payment">
                            پرداختی ثبت نشده است.
                        </div>

                    )}

                </div>

            </div>


            {/* =========================
                Items
            ========================= */}

            <div className="order-items-card">

                <h3>
                    محصولات سفارش
                </h3>


                <div className="order-items-table-wrapper">

                    <table className="order-items-table">

                        <thead>

                            <tr>

                                <th>
                                    محصول
                                </th>

                                <th>
                                    تعداد
                                </th>

                                <th>
                                    قیمت واحد
                                </th>

                                <th>
                                    مبلغ
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {order.items.map(
                                (item) => (

                                    <tr
                                        key={item.id}
                                    >

                                        <td>
                                            {item.product_name}
                                        </td>

                                        <td>
                                            {item.quantity}
                                        </td>

                                        <td>
                                            {formatPrice(
                                                item.unit_price
                                            )}{" "}
                                            تومان
                                        </td>

                                        <td>
                                            {formatPrice(
                                                Number(
                                                    item.unit_price
                                                ) *
                                                Number(
                                                    item.quantity
                                                )
                                            )}{" "}
                                            تومان
                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>


                <div className="order-total">

                    <span>
                        مبلغ کل سفارش
                    </span>

                    <strong>
                        {formatPrice(
                            order.order.total_amount
                        )}{" "}
                        تومان
                    </strong>

                </div>

            </div>

        </div>
    );
}


export default AdminOrderDetails;