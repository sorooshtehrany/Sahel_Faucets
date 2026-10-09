
import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    gregorianToJalali
} from "../../utils/jalaliDate";

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


    const [deliveryStatus, setDeliveryStatus] =
        useState("");

    const [updatingDeliveryStatus, setUpdatingDeliveryStatus] =
        useState(false);

    const [deliveryError, setDeliveryError] =
        useState("");


    // -------------------------------------------------
    // Load order
    // -------------------------------------------------

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

            setDeliveryStatus(
                data.order.delivery_status || ""
            );

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


    // -------------------------------------------------
    // Update delivery status
    // -------------------------------------------------

    async function updateDeliveryStatus(
        newStatus
    ) {

        if (
            !newStatus ||
            newStatus === deliveryStatus
        ) {
            return;
        }


        try {

            setUpdatingDeliveryStatus(true);

            setDeliveryError("");


            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    `${API_BASE_URL}/admin/orders/${orderId}/delivery-status`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            delivery_status:
                                newStatus
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "خطا در تغییر وضعیت ارسال"
                );
            }


            const updatedStatus =
                data.order.delivery_status;


            setDeliveryStatus(
                updatedStatus
            );


            setOrder(
                (previousOrder) => ({

                    ...previousOrder,

                    order: {

                        ...previousOrder.order,

                        delivery_status:
                            updatedStatus

                    }

                })
            );

        }
        catch (error) {

            console.error(
                "Delivery status update error:",
                error
            );


            setDeliveryError(
                error.message ||
                "خطایی در تغییر وضعیت ارسال رخ داد."
            );

        }
        finally {

            setUpdatingDeliveryStatus(false);
        }
    }


    useEffect(() => {

        loadOrder();

    }, [orderId]);


    // -------------------------------------------------
    // Status text
    // -------------------------------------------------

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


    function getDeliveryStatusText(status) {

        switch (status) {

            case "pending":
                return "در انتظار پردازش";

            case "preparing":
                return "در حال آماده‌سازی";

            case "shipped":
                return "ارسال شده";

            case "delivered":
                return "تحویل شده";

            case "cancelled":
                return "لغو شده";

            default:
                return status || "-";
        }
    }


    // -------------------------------------------------
    // Allowed next delivery statuses
    // -------------------------------------------------

    function getNextDeliveryStatuses(
        status
    ) {

        switch (status) {

            case "pending":
                return [
                    "preparing",
                    "cancelled"
                ];

            case "preparing":
                return [
                    "shipped",
                    "cancelled"
                ];

            case "shipped":
                return [
                    "delivered"
                ];

            default:
                return [];
        }
    }


    // -------------------------------------------------
    // Price
    // -------------------------------------------------

    function formatPrice(price) {

        return Number(price || 0)
            .toLocaleString("fa-IR");
    }


    // -------------------------------------------------
    // Jalali date
    // -------------------------------------------------

    function formatDate(date) {

        if (!date) {
            return "-";
        }


        const datePart =
            String(date)
                .slice(0, 10);


        const timePart =
            String(date)
                .slice(11, 19);


        const jalaliDate =
            gregorianToJalali(
                datePart
            );


        if (!jalaliDate) {
            return "-";
        }


        return `${jalaliDate} - ${timePart}`;
    }


    // -------------------------------------------------
    // Loading
    // -------------------------------------------------

    if (loading) {

        return (
            <div className="admin-order-loading">

                در حال دریافت اطلاعات سفارش...

            </div>
        );
    }


    // -------------------------------------------------
    // Error
    // -------------------------------------------------

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


    const currentDeliveryStatus =
        order.order.delivery_status;


    const nextDeliveryStatuses =
        getNextDeliveryStatuses(
            currentDeliveryStatus
        );


    const deliveryStatusIsFinal =
        currentDeliveryStatus === "delivered" ||
        currentDeliveryStatus === "cancelled";


    const orderIsPaid =
        order.order.payment_status === "paid";


    const deliveryUpdateDisabled =
        updatingDeliveryStatus ||
        deliveryStatusIsFinal ||
        !orderIsPaid;


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
                Customer / Payment
            ========================= */}

            <div className="order-info-grid">

                {/* =========================
                    Customer
                ========================= */}

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
                                    {getStatusText(
                                        order.payment.status
                                    )}
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
                Delivery Address
            ========================= */}

            <div className="order-info-card order-delivery-address-card">

                <h3>
                    آدرس تحویل
                </h3>


                <div className="delivery-address">

                    {order.order.delivery_address || (
                        <span className="empty-delivery-address">
                            آدرس تحویل ثبت نشده است.
                        </span>
                    )}

                </div>

            </div>


            {/* =========================
                Delivery Status
            ========================= */}

            <div className="order-info-card order-delivery-status-card">

                <h3>
                    وضعیت ارسال سفارش
                </h3>


                <div className="order-info-row">

                    <span>
                        وضعیت فعلی
                    </span>

                    <strong
                        className={
                            `delivery-status-text ${currentDeliveryStatus}`
                        }
                    >
                        {getDeliveryStatusText(
                            currentDeliveryStatus
                        )}
                    </strong>

                </div>


                {deliveryStatusIsFinal ? (

                    <div className="delivery-status-final">

                        این سفارش به مرحله نهایی رسیده و
                        وضعیت ارسال آن دیگر قابل تغییر نیست.

                    </div>

                ) : !orderIsPaid ? (

                    <div className="delivery-status-disabled">

                        وضعیت ارسال فقط پس از پرداخت موفق
                        سفارش قابل تغییر است.

                    </div>

                ) : (

                    <div className="delivery-status-control">

                        <label>
                            تغییر وضعیت
                        </label>


                        <select
                            value=""
                            disabled={
                                deliveryUpdateDisabled
                            }
                            onChange={(event) =>
                                updateDeliveryStatus(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                انتخاب وضعیت بعدی
                            </option>


                            {nextDeliveryStatuses.map(
                                (status) => (

                                    <option
                                        key={status}
                                        value={status}
                                    >
                                        {getDeliveryStatusText(
                                            status
                                        )}
                                    </option>

                                )
                            )}

                        </select>


                        {updatingDeliveryStatus && (

                            <span className="delivery-status-loading">
                                در حال بروزرسانی...
                            </span>

                        )}

                    </div>

                )}


                {deliveryError && (

                    <div className="delivery-status-error">

                        {deliveryError}

                    </div>

                )}

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

