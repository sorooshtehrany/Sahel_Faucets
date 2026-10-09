import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getMyOrderById } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

import { gregorianToJalali } from "../utils/jalaliDate";

import "../styles/MyOrderDetails.css";


const PAYMENT_STATUS = {
    pending: "در انتظار پرداخت",
    paid: "پرداخت‌شده",
    failed: "ناموفق"
};


const DELIVERY_STATUS = {
    pending: "در انتظار پردازش",
    preparing: "در حال آماده‌سازی",
    shipped: "ارسال‌شده",
    delivered: "تحویل‌شده",
    cancelled: "لغوشده"
};


function formatPrice(price) {
    return Number(price || 0).toLocaleString("fa-IR");
}


function formatDate(dateValue) {
    if (!dateValue) {
        return "—";
    }

    const value = String(dateValue);
    const datePart = value.substring(0, 10);
    const timePart = value.substring(11, 19);

    try {
        const jalaliDate = gregorianToJalali(datePart);

        return timePart
            ? `${jalaliDate} - ${timePart}`
            : jalaliDate;
    } catch {
        return datePart;
    }
}


function getStatusClass(status) {
    switch (status) {
        case "paid":
        case "delivered":
            return "success";

        case "pending":
        case "preparing":
        case "shipped":
            return "waiting";

        case "failed":
        case "cancelled":
            return "danger";

        default:
            return "default";
    }
}


function formatAddress(address) {
    if (!address) {
        return "آدرسی برای این سفارش ثبت نشده است.";
    }

    if (typeof address === "string") {
        try {
            const parsedAddress = JSON.parse(address);

            if (
                parsedAddress &&
                typeof parsedAddress === "object"
            ) {
                return Object.values(parsedAddress)
                    .filter(value =>
                        value !== null &&
                        value !== undefined &&
                        String(value).trim() !== ""
                    )
                    .join("، ");
            }
        } catch {
            return address;
        }

        return address;
    }

    if (typeof address === "object") {
        return Object.values(address)
            .filter(value =>
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ""
            )
            .join("، ");
    }

    return String(address);
}


function MyOrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();

    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [payment, setPayment] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);


    useEffect(() => {
        let cancelled = false;

        async function loadOrderDetails() {
            setLoading(true);
            setError("");

            try {
                const result = await getMyOrderById(orderId);

                if (cancelled) {
                    return;
                }

                setOrder(result.order || null);
                setItems(result.items || []);
                setPayment(result.payment || null);

                if (!result.order) {
                    setError("اطلاعات سفارش پیدا نشد.");
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message ||
                        "دریافت جزئیات سفارش با خطا مواجه شد."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        if (user && orderId) {
            loadOrderDetails();
        }

        return () => {
            cancelled = true;
        };
    }, [user, orderId]);


    if (!user) {
        return null;
    }


    if (loading) {
        return (
            <div className="my-order-details-page">
                <div className="my-order-details-box">
                    <div className="my-order-details-message">
                        در حال دریافت جزئیات سفارش...
                    </div>
                </div>
            </div>
        );
    }


    if (error || !order) {
        return (
            <div className="my-order-details-page">
                <div className="my-order-details-box">

                    <header className="my-order-details-header">
                        <h1>جزئیات سفارش</h1>

                        <Link
                            to="/my-orders"
                            className="my-order-details-back"
                        >
                            بازگشت به سوابق خرید
                        </Link>
                    </header>

                    <div className="my-order-details-error">
                        {error || "سفارش موردنظر پیدا نشد."}
                    </div>

                </div>
            </div>
        );
    }


    return (
        <div className="my-order-details-page">

            <div className="my-order-details-box">

                {/* Header */}

                <header className="my-order-details-header">

                    <div>
                        <h1>جزئیات سفارش</h1>

                        <p>
                            شماره سفارش:{" "}
                            <strong>
                                {Number(order.id).toLocaleString("fa-IR")}
                            </strong>
                        </p>
                    </div>

                    <Link
                        to="/my-orders"
                        className="my-order-details-back"
                    >
                        بازگشت به سوابق خرید
                    </Link>

                </header>


                {/* Order overview */}

                <section className="my-order-details-section">

                    <h2>اطلاعات سفارش</h2>

                    <div className="my-order-details-grid">

                        <div className="my-order-details-info">
                            <span>شماره سفارش</span>

                            <strong>
                                {Number(order.id).toLocaleString("fa-IR")}
                            </strong>
                        </div>

                        <div className="my-order-details-info">
                            <span>تاریخ ثبت سفارش</span>

                            <strong>
                                {formatDate(order.created_at)}
                            </strong>
                        </div>

                        <div className="my-order-details-info">
                            <span>وضعیت پرداخت</span>

                            <strong>
                                <span
                                    className={`my-order-details-status ${getStatusClass(order.payment_status)}`}
                                >
                                    {PAYMENT_STATUS[order.payment_status] || order.payment_status || "—"}
                                </span>
                            </strong>
                        </div>

                        <div className="my-order-details-info">
                            <span>وضعیت تحویل</span>

                            <strong>
                                <span
                                    className={`my-order-details-status ${getStatusClass(order.delivery_status)}`}
                                >
                                    {DELIVERY_STATUS[order.delivery_status] || order.delivery_status || "—"}
                                </span>
                            </strong>
                        </div>

                        {order.paid_at && (
                            <div className="my-order-details-info">
                                <span>تاریخ پرداخت</span>

                                <strong>
                                    {formatDate(order.paid_at)}
                                </strong>
                            </div>
                        )}

                    </div>

                </section>


                {/* Delivery address */}

                <section className="my-order-details-section">

                    <h2>اطلاعات تحویل</h2>

                    <div className="my-order-details-address">
                        {formatAddress(order.delivery_address)}
                    </div>

                </section>


                {/* Payment details */}

                <section className="my-order-details-section">

                    <h2>اطلاعات پرداخت</h2>

                    {payment ? (

                        <div className="my-order-details-grid">

                            <div className="my-order-details-info">
                                <span>شماره پرداخت</span>

                                <strong>
                                    {payment.id
                                        ? Number(payment.id).toLocaleString("fa-IR")
                                        : "—"}
                                </strong>
                            </div>

                            <div className="my-order-details-info">
                                <span>مبلغ پرداخت</span>

                                <strong>
                                    {formatPrice(payment.amount)} تومان
                                </strong>
                            </div>

                            <div className="my-order-details-info">
                                <span>وضعیت پرداخت</span>

                                <strong>
                                    <span
                                        className={`my-order-details-status ${getStatusClass(payment.status)}`}
                                    >
                                        {PAYMENT_STATUS[payment.status] || payment.status || "—"}
                                    </span>
                                </strong>
                            </div>

                            {payment.gateway && (
                                <div className="my-order-details-info">
                                    <span>درگاه پرداخت</span>

                                    <strong>
                                        {payment.gateway}
                                    </strong>
                                </div>
                            )}

                            {payment.reference_id && (
                                <div className="my-order-details-info">
                                    <span>شناسه پیگیری</span>

                                    <strong>
                                        {payment.reference_id}
                                    </strong>
                                </div>
                            )}

                            {payment.paid_at && (
                                <div className="my-order-details-info">
                                    <span>تاریخ پرداخت</span>

                                    <strong>
                                        {formatDate(payment.paid_at)}
                                    </strong>
                                </div>
                            )}

                        </div>

                    ) : (

                        <div className="my-order-details-muted">
                            اطلاعات پرداختی برای این سفارش ثبت نشده است.
                        </div>

                    )}

                </section>


                {/* Order items */}

                <section className="my-order-details-section">

                    <h2>اقلام سفارش</h2>

                    {items.length === 0 ? (

                        <div className="my-order-details-muted">
                            کالایی برای این سفارش ثبت نشده است.
                        </div>

                    ) : (

                        <div className="my-order-details-table-wrapper">

                            <table className="my-order-details-table">

                                <thead>
                                    <tr>
                                        <th>ردیف</th>
                                        <th>نام محصول</th>
                                        <th>قیمت واحد</th>
                                        <th>تعداد</th>
                                        <th>مبلغ کل</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {items.map((item, index) => (

                                        <tr key={item.id || index}>

                                            <td>
                                                {(index + 1).toLocaleString("fa-IR")}
                                            </td>

                                            <td className="my-order-details-product">
                                                {item.product_name || "محصول"}
                                            </td>

                                            <td>
                                                {formatPrice(item.unit_price)}
                                                {" تومان"}
                                            </td>

                                            <td>
                                                {Number(item.quantity || 0).toLocaleString("fa-IR")}
                                            </td>

                                            <td className="my-order-details-price">
                                                {formatPrice(item.total_price)}
                                                {" تومان"}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


                {/* Total */}

                <section className="my-order-details-total">

                    <span>مبلغ نهایی سفارش</span>

                    <strong>
                        {formatPrice(order.total_amount)}
                        <span> تومان</span>
                    </strong>

                </section>


                {/* Footer */}

                <footer className="my-order-details-footer">

                    <Link
                        to="/my-orders"
                        className="my-order-details-back"
                    >
                        بازگشت به سوابق خرید
                    </Link>

                    <button
                        type="button"
                        className="my-order-details-print"
                        onClick={() => window.print()}
                    >
                        چاپ جزئیات سفارش
                    </button>

                </footer>

            </div>

        </div>
    );
}


export default MyOrderDetails;