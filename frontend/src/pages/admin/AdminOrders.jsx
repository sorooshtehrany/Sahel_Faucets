import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    gregorianToJalali,
    jalaliToGregorian
} from "../../utils/jalaliDate";

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


    // -------------------------------------------------
    // Filter inputs
    // -------------------------------------------------

    const [searchInput, setSearchInput] =
        useState("");

    const [paymentStatusInput, setPaymentStatusInput] =
        useState("");

    const [deliveryStatusInput, setDeliveryStatusInput] =
        useState("");

    const [dateFromInput, setDateFromInput] =
        useState("");

    const [dateToInput, setDateToInput] =
        useState("");


    // -------------------------------------------------
    // Applied filters
    // -------------------------------------------------

    const [search, setSearch] =
        useState("");

    const [paymentStatus, setPaymentStatus] =
        useState("");

    const [deliveryStatus, setDeliveryStatus] =
        useState("");

    const [dateFrom, setDateFrom] =
        useState("");

    const [dateTo, setDateTo] =
        useState("");


    const [page, setPage] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const limit = 10;


    // -------------------------------------------------
    // Load orders
    // -------------------------------------------------

    async function loadOrders() {

        try {

            setLoading(true);

            setError("");


            const token =
                localStorage.getItem("token");


            const params =
                new URLSearchParams({
                    page:
                        page.toString(),

                    limit:
                        limit.toString()
                });


            // Search
            if (search) {

                params.append(
                    "search",
                    search
                );
            }


            // Payment status
            if (paymentStatus) {

                params.append(
                    "paymentStatus",
                    paymentStatus
                );
            }


            // Delivery status
            if (deliveryStatus) {

                params.append(
                    "deliveryStatus",
                    deliveryStatus
                );
            }


            // Date from
            if (dateFrom) {

                params.append(
                    "dateFrom",
                    dateFrom
                );
            }


            // Date to
            if (dateTo) {

                params.append(
                    "dateTo",
                    dateTo
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


    // -------------------------------------------------
    // Load when filters or page change
    // -------------------------------------------------

    useEffect(() => {

        loadOrders();

    }, [
        page,
        search,
        paymentStatus,
        deliveryStatus,
        dateFrom,
        dateTo
    ]);


    // -------------------------------------------------
    // Apply filters
    // -------------------------------------------------

    function handleApplyFilters() {

        if (
            dateFromInput &&
            dateToInput &&
            dateFromInput > dateToInput
        ) {

            setError(
                "تاریخ شروع نمی‌تواند بعد از تاریخ پایان باشد."
            );

            return;
        }


        // Validate Jalali dates

        if (
            dateFromInput &&
            !jalaliToGregorian(
                dateFromInput
            )
        ) {

            setError(
                "تاریخ شروع نامعتبر است."
            );

            return;
        }


        if (
            dateToInput &&
            !jalaliToGregorian(
                dateToInput
            )
        ) {

            setError(
                "تاریخ پایان نامعتبر است."
            );

            return;
        }


        setError("");


        // Convert Jalali → Gregorian
        const gregorianFrom =
            jalaliToGregorian(
                dateFromInput
            );

        const gregorianTo =
            jalaliToGregorian(
                dateToInput
            );


        // Apply filters

        setSearch(
            searchInput.trim()
        );

        setPaymentStatus(
            paymentStatusInput
        );

        setDeliveryStatus(
            deliveryStatusInput
        );

        setDateFrom(
            gregorianFrom
        );

        setDateTo(
            gregorianTo
        );


        setPage(1);
    }


    // -------------------------------------------------
    // Clear filters
    // -------------------------------------------------

    function handleClearFilters() {

        setSearchInput("");

        setPaymentStatusInput("");

        setDeliveryStatusInput("");

        setDateFromInput("");

        setDateToInput("");


        setSearch("");

        setPaymentStatus("");

        setDeliveryStatus("");

        setDateFrom("");

        setDateTo("");


        setError("");

        setPage(1);
    }


    // -------------------------------------------------
    // Payment status text
    // -------------------------------------------------

    function getPaymentStatusText(status) {

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


    // -------------------------------------------------
    // Delivery status text
    // -------------------------------------------------

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
    // Format price
    // -------------------------------------------------

    function formatPrice(price) {

        return Number(price || 0)
            .toLocaleString("fa-IR");
    }


    // -------------------------------------------------
    // Format date
    // -------------------------------------------------

    function formatDate(date) {

        if (!date) {
            return "-";
        }


        try {

            return gregorianToJalali(
                date
            );

        }
        catch (error) {

            console.error(
                "Date formatting error:",
                error
            );

            return "-";
        }
    }


    // -------------------------------------------------
    // Render
    // -------------------------------------------------

    return (

        <div
            className="admin-orders"
            dir="rtl"
        >


            {/* ----------------------------------------- */}
            {/* Header */}
            {/* ----------------------------------------- */}

            <div className="admin-page-header">

                <div>

                    <h2>
                        سفارش‌ها
                    </h2>

                    <p>
                        مدیریت و مشاهده سفارش‌های ثبت‌شده
                    </p>

                </div>

            </div>


            {/* ----------------------------------------- */}
            {/* Filters */}
            {/* ----------------------------------------- */}

            <div className="admin-orders-filters">


                {/* Search */}

                <div
                    className={
                        "admin-filter-group search-filter"
                    }
                >

                    <label>
                        جستجو
                    </label>

                    <input
                        type="text"
                        value={searchInput}
                        onChange={(event) =>
                            setSearchInput(
                                event.target.value
                            )
                        }
                        onKeyDown={(event) => {

                            if (
                                event.key === "Enter"
                            ) {

                                handleApplyFilters();
                            }
                        }}
                        placeholder={
                            "نام، نام خانوادگی، تلفن یا شماره سفارش"
                        }
                    />

                </div>


                {/* Payment status */}

                <div className="admin-filter-group">

                    <label>
                        وضعیت پرداخت
                    </label>

                    <select
                        value={paymentStatusInput}
                        onChange={(event) =>
                            setPaymentStatusInput(
                                event.target.value
                            )
                        }
                    >

                        <option value="">
                            همه
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


                {/* Delivery status */}

                <div className="admin-filter-group">

                    <label>
                        وضعیت ارسال
                    </label>

                    <select
                        value={deliveryStatusInput}
                        onChange={(event) =>
                            setDeliveryStatusInput(
                                event.target.value
                            )
                        }
                    >

                        <option value="">
                            همه
                        </option>

                        <option value="pending">
                            در انتظار پردازش
                        </option>

                        <option value="preparing">
                            در حال آماده‌سازی
                        </option>

                        <option value="shipped">
                            ارسال شده
                        </option>

                        <option value="delivered">
                            تحویل شده
                        </option>

                        <option value="cancelled">
                            لغو شده
                        </option>

                    </select>

                </div>


                {/* From Jalali date */}

                <div className="admin-filter-group">

                    <label>
                        از تاریخ
                    </label>

                    <input
                        type="text"
                        value={dateFromInput}
                        onChange={(event) =>
                            setDateFromInput(
                                event.target.value
                            )
                        }
                        placeholder="1405/07/01"
                        dir="ltr"
                    />

                </div>


                {/* To Jalali date */}

                <div className="admin-filter-group">

                    <label>
                        تا تاریخ
                    </label>

                    <input
                        type="text"
                        value={dateToInput}
                        onChange={(event) =>
                            setDateToInput(
                                event.target.value
                            )
                        }
                        placeholder="1405/07/09"
                        dir="ltr"
                    />

                </div>


                {/* Filter buttons */}

                <div className="admin-filter-actions">

                    <button
                        className={
                            "admin-apply-filter-button"
                        }
                        onClick={
                            handleApplyFilters
                        }
                    >
                        اعمال فیلتر
                    </button>


                    <button
                        className={
                            "admin-clear-filter-button"
                        }
                        onClick={
                            handleClearFilters
                        }
                    >
                        پاک کردن
                    </button>

                </div>

            </div>


            {/* ----------------------------------------- */}
            {/* Error */}
            {/* ----------------------------------------- */}

            {error && (

                <div className="admin-error">

                    {error}

                </div>

            )}


            {/* ----------------------------------------- */}
            {/* Orders */}
            {/* ----------------------------------------- */}

            <div className="admin-table-card">

                {loading ? (

                    <div className="admin-table-loading">

                        در حال دریافت سفارش‌ها...

                    </div>

                ) : orders.length === 0 ? (

                    <div className="admin-empty">

                        سفارشی با این مشخصات پیدا نشد.

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
                                        پرداخت
                                    </th>

                                    <th>
                                        ارسال
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
                                            key={
                                                order.id
                                            }

                                            className={
                                                "admin-order-row"
                                            }

                                            onClick={() =>
                                                navigate(
                                                    `/admin/orders/${order.id}`
                                                )
                                            }
                                        >

                                            {/* Order number */}

                                            <td>

                                                <strong>
                                                    #{order.id}
                                                </strong>

                                            </td>


                                            {/* Customer */}

                                            <td>

                                                <div className="customer-cell">

                                                    <strong>

                                                        {
                                                            order.first_name
                                                        }

                                                        {" "}

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


                                            {/* Amount */}

                                            <td>

                                                <span>

                                                    {
                                                        formatPrice(
                                                            order.total_amount
                                                        )
                                                    }

                                                </span>

                                                <span className="currency">

                                                    {" "}تومان

                                                </span>

                                            </td>


                                            {/* Payment status */}

                                            <td>

                                                <span
                                                    className={
                                                        `order-status ${order.payment_status}`
                                                    }
                                                >

                                                    {
                                                        getPaymentStatusText(
                                                            order.payment_status
                                                        )
                                                    }

                                                </span>

                                            </td>


                                            {/* Delivery status */}

                                            <td>

                                                <span
                                                    className={
                                                        `delivery-status ${order.delivery_status}`
                                                    }
                                                >

                                                    {
                                                        getDeliveryStatusText(
                                                            order.delivery_status
                                                        )
                                                    }

                                                </span>

                                            </td>


                                            {/* Date */}

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


            {/* ----------------------------------------- */}
            {/* Pagination */}
            {/* ----------------------------------------- */}

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
                                {
                                    pagination.page
                                }
                            </strong>

                            {" "}از{" "}

                            <strong>
                                {
                                    pagination.totalPages
                                }
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