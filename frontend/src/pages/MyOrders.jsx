import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getMyOrders } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

import {
    gregorianToJalali,
    jalaliToGregorian
} from "../utils/jalaliDate";

import "../styles/MyOrders.css";


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


function MyOrders() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [orders, setOrders] = useState([]);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    const [filters, setFilters] = useState({
        search: "",
        paymentStatus: "",
        deliveryStatus: "",
        dateFrom: "",
        dateTo: "",
        sortBy: "date",
        sortOrder: "desc"
    });

    const [appliedFilters, setAppliedFilters] = useState({
        search: "",
        paymentStatus: "",
        deliveryStatus: "",
        dateFrom: "",
        dateTo: "",
        sortBy: "date",
        sortOrder: "desc"
    });

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // Redirect unauthenticated users to login.
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);


    // Load customer orders.
    useEffect(() => {
        let cancelled = false;

        async function loadOrders() {
            setLoading(true);
            setError("");

            try {
                const params = {
                    page,
                    limit: pagination.limit,
                    sortBy: appliedFilters.sortBy,
                    sortOrder: appliedFilters.sortOrder
                };

                if (appliedFilters.search) {
                    params.search = appliedFilters.search;
                }

                if (appliedFilters.paymentStatus) {
                    params.paymentStatus =
                        appliedFilters.paymentStatus;
                }

                if (appliedFilters.deliveryStatus) {
                    params.deliveryStatus =
                        appliedFilters.deliveryStatus;
                }

                if (appliedFilters.dateFrom) {
                    params.dateFrom = jalaliToGregorian(
                        appliedFilters.dateFrom
                    );
                }

                if (appliedFilters.dateTo) {
                    params.dateTo = jalaliToGregorian(
                        appliedFilters.dateTo
                    );
                }

                const result = await getMyOrders(params);

                if (cancelled) {
                    return;
                }

                setOrders(
                    Array.isArray(result.data)
                        ? result.data
                        : []
                );

                setPagination(
                    result.pagination || {
                        page,
                        limit: 10,
                        total: 0,
                        totalPages: 0
                    }
                );
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message ||
                        "دریافت سوابق خرید با خطا مواجه شد."
                    );

                    setOrders([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        if (user) {
            loadOrders();
        }

        return () => {
            cancelled = true;
        };
    }, [
        user,
        page,
        appliedFilters,
        pagination.limit
    ]);


    function handleFilterChange(event) {
        const { name, value } = event.target;

        setFilters(previous => ({
            ...previous,
            [name]: value
        }));
    }


    function handleSearch(event) {
        event.preventDefault();

        const searchValue = filters.search.trim();

        if (searchValue && !/^\d+$/.test(searchValue)) {
            setError(
                "شماره سفارش باید فقط شامل اعداد باشد."
            );
            return;
        }

        if (
            filters.dateFrom &&
            !/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(filters.dateFrom)
        ) {
            setError(
                "تاریخ شروع را با فرمت 1405/07/01 وارد کن."
            );
            return;
        }

        if (
            filters.dateTo &&
            !/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(filters.dateTo)
        ) {
            setError(
                "تاریخ پایان را با فرمت 1405/07/30 وارد کن."
            );
            return;
        }

        try {
            if (filters.dateFrom) {
                jalaliToGregorian(filters.dateFrom);
            }

            if (filters.dateTo) {
                jalaliToGregorian(filters.dateTo);
            }

            if (filters.dateFrom && filters.dateTo) {
                const fromDate = jalaliToGregorian(
                    filters.dateFrom
                );

                const toDate = jalaliToGregorian(
                    filters.dateTo
                );

                if (fromDate > toDate) {
                    setError(
                        "تاریخ شروع نباید بعد از تاریخ پایان باشد."
                    );
                    return;
                }
            }

            setAppliedFilters({
                ...filters,
                search: searchValue
            });

            setPage(1);
            setError("");
        } catch {
            setError(
                "تاریخ واردشده معتبر نیست."
            );
        }
    }


    function handleResetFilters() {
        const defaultFilters = {
            search: "",
            paymentStatus: "",
            deliveryStatus: "",
            dateFrom: "",
            dateTo: "",
            sortBy: "date",
            sortOrder: "desc"
        };

        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
        setPage(1);
        setError("");
    }


    return (
        <div className="my-orders-page">

            <div className="my-orders-box">

                {/* Page header */}
                <header className="my-orders-header">

                    <div>
                        <h1>سوابق خرید من</h1>

                        <p>
                            تمام سفارش‌های قبلی خود را در این بخش مشاهده کن.
                        </p>
                    </div>

                    <Link
                        to="/cart"
                        className="my-orders-back-button"
                    >
                        بازگشت به سبد خرید
                    </Link>

                </header>


                {/* Filters */}
                <form
                    className="my-orders-filters"
                    onSubmit={handleSearch}
                    noValidate
                >

                    <div className="my-orders-filter-field">

                        <label htmlFor="search">
                            شماره سفارش
                        </label>

                        <input
                            id="search"
                            name="search"
                            type="text"
                            inputMode="numeric"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="مثلاً 68"
                        />

                    </div>


                    <div className="my-orders-filter-field">

                        <label htmlFor="paymentStatus">
                            وضعیت پرداخت
                        </label>

                        <select
                            id="paymentStatus"
                            name="paymentStatus"
                            value={filters.paymentStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="">
                                همه وضعیت‌ها
                            </option>

                            <option value="pending">
                                در انتظار پرداخت
                            </option>

                            <option value="paid">
                                پرداخت‌شده
                            </option>

                            <option value="failed">
                                ناموفق
                            </option>
                        </select>

                    </div>


                    <div className="my-orders-filter-field">

                        <label htmlFor="deliveryStatus">
                            وضعیت تحویل
                        </label>

                        <select
                            id="deliveryStatus"
                            name="deliveryStatus"
                            value={filters.deliveryStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="">
                                همه وضعیت‌ها
                            </option>

                            <option value="pending">
                                در انتظار پردازش
                            </option>

                            <option value="preparing">
                                در حال آماده‌سازی
                            </option>

                            <option value="shipped">
                                ارسال‌شده
                            </option>

                            <option value="delivered">
                                تحویل‌شده
                            </option>

                            <option value="cancelled">
                                لغوشده
                            </option>
                        </select>

                    </div>


                    <div className="my-orders-filter-field">

                        <label htmlFor="dateFrom">
                            از تاریخ شمسی
                        </label>

                        <input
                            id="dateFrom"
                            name="dateFrom"
                            type="text"
                            value={filters.dateFrom}
                            onChange={handleFilterChange}
                            placeholder="1405/07/01"
                        />

                    </div>


                    <div className="my-orders-filter-field">

                        <label htmlFor="dateTo">
                            تا تاریخ شمسی
                        </label>

                        <input
                            id="dateTo"
                            name="dateTo"
                            type="text"
                            value={filters.dateTo}
                            onChange={handleFilterChange}
                            placeholder="1405/07/30"
                        />

                    </div>


                    <div className="my-orders-filter-field">

                        <label htmlFor="sortBy">
                            مرتب‌سازی بر اساس
                        </label>

                        <select
                            id="sortBy"
                            name="sortBy"
                            value={filters.sortBy}
                            onChange={handleFilterChange}
                        >
                            <option value="date">
                                تاریخ سفارش
                            </option>

                            <option value="amount">
                                مبلغ سفارش
                            </option>

                            <option value="paymentStatus">
                                وضعیت پرداخت
                            </option>

                            <option value="deliveryStatus">
                                وضعیت تحویل
                            </option>
                        </select>

                    </div>


                    <div className="my-orders-filter-field">

                        <label htmlFor="sortOrder">
                            ترتیب
                        </label>

                        <select
                            id="sortOrder"
                            name="sortOrder"
                            value={filters.sortOrder}
                            onChange={handleFilterChange}
                        >
                            <option value="desc">
                                نزولی
                            </option>

                            <option value="asc">
                                صعودی
                            </option>
                        </select>

                    </div>


                    <div className="my-orders-filter-actions">

                        <button
                            type="submit"
                            className="my-orders-primary-button"
                        >
                            اعمال فیلترها
                        </button>

                        <button
                            type="button"
                            className="my-orders-reset-button"
                            onClick={handleResetFilters}
                        >
                            پاک کردن فیلترها
                        </button>

                    </div>

                </form>


                {/* Error message */}
                {error && (
                    <div className="my-orders-error">
                        {error}
                    </div>
                )}


                {/* Orders summary */}
                <div className="my-orders-summary">

                    تعداد سفارش‌ها:{" "}

                    <strong>
                        {Number(
                            pagination.total || 0
                        ).toLocaleString("fa-IR")}
                    </strong>

                </div>


                {/* Loading, empty state, or orders table */}
                {loading ? (

                    <div className="my-orders-message">
                        در حال دریافت سوابق خرید...
                    </div>

                ) : orders.length === 0 ? (

                    <div className="my-orders-message">

                        <h2>
                            سفارشی پیدا نشد
                        </h2>

                        <p>
                            هنوز سفارشی ثبت نکرده‌ای یا سفارشی با
                            فیلترهای انتخاب‌شده وجود ندارد.
                        </p>

                        <Link to="/cart">
                            بازگشت به سبد خرید
                        </Link>

                    </div>

                ) : (

                    <div className="my-orders-table-wrapper">

                        <table className="my-orders-table">

                            <thead>
                                <tr>
                                    <th>شماره سفارش</th>
                                    <th>تاریخ ثبت</th>
                                    <th>مبلغ</th>
                                    <th>وضعیت پرداخت</th>
                                    <th>وضعیت تحویل</th>
                                    <th>جزئیات</th>
                                </tr>
                            </thead>

                            <tbody>

                                {orders.map(order => (

                                    <tr key={order.id}>

                                        <td>
                                            <span className="my-orders-number">
                                                {Number(
                                                    order.id
                                                ).toLocaleString("fa-IR")}
                                            </span>
                                        </td>

                                        <td>
                                            {formatDate(
                                                order.created_at
                                            )}
                                        </td>

                                        <td className="my-orders-price">

                                            {formatPrice(
                                                order.total_amount
                                            )}

                                            <span> تومان</span>

                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    `my-orders-status ${
                                                        getStatusClass(
                                                            order.payment_status
                                                        )
                                                    }`
                                                }
                                            >
                                                {
                                                    PAYMENT_STATUS[
                                                        order.payment_status
                                                    ] ||
                                                    order.payment_status ||
                                                    "—"
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    `my-orders-status ${
                                                        getStatusClass(
                                                            order.delivery_status
                                                        )
                                                    }`
                                                }
                                            >
                                                {
                                                    DELIVERY_STATUS[
                                                        order.delivery_status
                                                    ] ||
                                                    order.delivery_status ||
                                                    "—"
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            <Link
                                                to={`/my-orders/${order.id}`}
                                                className="my-orders-details-link"
                                            >
                                                مشاهده جزئیات
                                            </Link>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}


                {/* Pagination */}
                {!loading && pagination.totalPages > 1 && (

                    <div className="my-orders-pagination">

                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => {
                                setPage(current => current - 1);
                            }}
                        >
                            صفحه قبل
                        </button>

                        <span>
                            صفحه{" "}
                            {Number(page).toLocaleString("fa-IR")}

                            {" "}از{" "}

                            {Number(
                                pagination.totalPages
                            ).toLocaleString("fa-IR")}
                        </span>

                        <button
                            type="button"
                            disabled={
                                page >= pagination.totalPages
                            }
                            onClick={() => {
                                setPage(current => current + 1);
                            }}
                        >
                            صفحه بعد
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}


export default MyOrders;