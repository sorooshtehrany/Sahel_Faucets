import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    Link
} from "react-router-dom";

import {
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    createOrder
} from "../api/cartApi";

import {
    useAuth
} from "../context/AuthContext";

import "../styles/cart.css";

import {
    getPendingOrder,
    cancelPendingOrder
} from "../api/orderApi";


function Cart() {

    const navigate = useNavigate();

    const {
        isAuthenticated,
        loading: authLoading
    } = useAuth();


    const [cart, setCart] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [checkoutLoading, setCheckoutLoading] =
        useState(false);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [pendingOrder, setPendingOrder] =
        useState(null);

    const [pendingPayment, setPendingPayment] =
        useState(null);


    /* =====================================================
       Load Cart
    ===================================================== */

    async function loadCart() {

        try {

            setError("");


            const data =
                await getCart();


            setCart(
                data.cart
            );


            const pendingOrderData =
                await getPendingOrder();


            setPendingOrder(
                pendingOrderData.order
            );


            setPendingPayment(
                pendingOrderData.payment
            );

        }
        catch (error) {

            console.error(
                "Load cart error:",
                error
            );


            setError(
                error.message ||
                "خطایی در دریافت سبد خرید رخ داد."
            );

        }
        finally {

            setLoading(false);

        }
    }


    /* =====================================================
       Authentication
    ===================================================== */

    useEffect(() => {

        if (authLoading) {
            return;
        }


        if (!isAuthenticated) {

            navigate("/login");

            return;
        }


        loadCart();

    }, [
        authLoading,
        isAuthenticated
    ]);


    /* =====================================================
       Increase
    ===================================================== */

    async function handleIncrease(
        productId,
        currentQuantity
    ) {

        if (
            paymentStarted
        ) {
            return;
        }


        try {

            setActionLoading(true);

            setError("");


            const data =
                await updateCartItem(
                    productId,
                    currentQuantity + 1
                );


            setCart(
                data.cart
            );


            window.dispatchEvent(
                new Event("cartUpdated")
            );

        }
        catch (error) {

            setError(
                error.message ||
                "خطا در تغییر تعداد محصول."
            );

        }
        finally {

            setActionLoading(false);

        }
    }


    /* =====================================================
       Decrease
    ===================================================== */

    async function handleDecrease(
        productId,
        currentQuantity
    ) {

        if (
            currentQuantity <= 1 ||
            paymentStarted
        ) {
            return;
        }


        try {

            setActionLoading(true);

            setError("");


            const data =
                await updateCartItem(
                    productId,
                    currentQuantity - 1
                );


            setCart(
                data.cart
            );


            window.dispatchEvent(
                new Event("cartUpdated")
            );

        }
        catch (error) {

            setError(
                error.message ||
                "خطا در تغییر تعداد محصول."
            );

        }
        finally {

            setActionLoading(false);

        }
    }


    /* =====================================================
       Remove
    ===================================================== */

    async function handleRemove(
        productId
    ) {

        if (
            paymentStarted
        ) {
            return;
        }


        try {

            setActionLoading(true);

            setError("");


            const data =
                await removeCartItem(
                    productId
                );


            setCart(
                data.cart
            );


            window.dispatchEvent(
                new Event("cartUpdated")
            );

        }
        catch (error) {

            setError(
                error.message ||
                "خطا در حذف محصول."
            );

        }
        finally {

            setActionLoading(false);

        }
    }


    /* =====================================================
       Clear Cart
    ===================================================== */

    async function handleClearCart() {

        if (
            paymentStarted
        ) {
            return;
        }


        try {

            setActionLoading(true);

            setError("");


            const data =
                await clearCart();


            setCart(
                data.cart
            );


            window.dispatchEvent(
                new Event("cartUpdated")
            );

        }
        catch (error) {

            setError(
                error.message ||
                "خطا در خالی کردن سبد خرید."
            );

        }
        finally {

            setActionLoading(false);

        }
    }


    /* =====================================================
       Checkout
    ===================================================== */

    async function handleCheckout() {

        if (
            checkoutLoading ||
            actionLoading
        ) {
            return;
        }


        /*
         * اگر پرداخت سفارش شروع شده است،
         * سفارش دیگر نباید دوباره ساخته یا
         * به‌روزرسانی شود.
         *
         * فقط وارد صفحه پرداخت می‌شویم.
         */

        if (
            pendingOrder &&
            paymentStarted
        ) {

            navigate(
                `/payment/${pendingOrder.id}`
            );

            return;
        }


        try {

            setCheckoutLoading(true);

            setError("");


            /*
             * اگر سفارش نیمه‌کاره داریم ولی
             * هنوز پرداخت شروع نشده است،
             * createOrder آن سفارش را با
             * سبد فعلی هماهنگ می‌کند.
             *
             * اگر سفارش وجود نداشته باشد،
             * createOrder سفارش جدید می‌سازد.
             */

            const data =
                await createOrder();


            setPendingOrder(
                data.order
            );


            setPendingPayment(
                null
            );


            navigate(
                `/payment/${data.order.id}`
            );


            if (data.updated) {

                alert(
                    `سفارش شماره ${data.order.id} با مبلغ ${Number(
                        data.order.total_amount
                    ).toLocaleString("fa-IR")} تومان با موفقیت به‌روزرسانی شد.`
                );

            }
            else {

                alert(
                    `سفارش شماره ${data.order.id} با مبلغ ${Number(
                        data.order.total_amount
                    ).toLocaleString("fa-IR")} تومان با موفقیت ثبت شد.`
                );

            }

        }
        catch (error) {

            console.error(
                "Checkout error:",
                error
            );


            setError(
                error.message ||
                "خطایی در ثبت سفارش رخ داد."
            );

        }
        finally {

            setCheckoutLoading(false);

        }
    }


    /* =====================================================
       Continue Payment
    ===================================================== */

    async function handleContinuePayment() {

        if (
            !pendingOrder ||
            actionLoading ||
            checkoutLoading
        ) {
            return;
        }


        /*
         * اگر پرداخت قبلاً شروع شده است،
         * سفارش قفل است و مستقیماً وارد
         * صفحه پرداخت می‌شویم.
         */

        if (
            paymentStarted
        ) {

            navigate(
                `/payment/${pendingOrder.id}`
            );

            return;
        }


        /*
         * اگر پرداخت هنوز شروع نشده،
         * باید سفارش را با سبد فعلی
         * هماهنگ کنیم.
         *
         * این قسمت جلوی نمایش مبلغ قدیمی
         * سفارش را می‌گیرد.
         */

        try {

            setCheckoutLoading(true);

            setError("");


            const data =
                await createOrder();


            setPendingOrder(
                data.order
            );


            setPendingPayment(
                null
            );


            navigate(
                `/payment/${data.order.id}`
            );

        }
        catch (error) {

            console.error(
                "Continue payment error:",
                error
            );


            setError(
                error.message ||
                "خطایی در به‌روزرسانی سفارش رخ داد."
            );

        }
        finally {

            setCheckoutLoading(false);

        }
    }


    /* =====================================================
       Cancel Pending Order
    ===================================================== */

    async function handleCancelPendingOrder() {

        if (
            !pendingOrder ||
            actionLoading ||
            checkoutLoading
        ) {
            return;
        }


        const confirmed =
            window.confirm(
                "آیا مطمئن هستید که می‌خواهید سفارش نیمه‌کاره را لغو کنید؟"
            );


        if (!confirmed) {
            return;
        }


        try {

            setActionLoading(true);

            setError("");


            await cancelPendingOrder();


            /*
             * سفارش نیمه‌کاره دیگر وجود ندارد.
             */

            setPendingOrder(null);

            setPendingPayment(null);


            /*
             * Cart را دوباره از سرور می‌گیریم
             * تا وضعیت کاملاً تازه باشد.
             */

            const data =
                await getCart();


            setCart(
                data.cart
            );


            window.dispatchEvent(
                new Event("cartUpdated")
            );

        }
        catch (error) {

            console.error(
                "Cancel pending order error:",
                error
            );


            setError(
                error.message ||
                "خطایی در لغو سفارش نیمه‌کاره رخ داد."
            );

        }
        finally {

            setActionLoading(false);

        }
    }


    /* =====================================================
       Loading
    ===================================================== */

    if (
        authLoading ||
        loading
    ) {

        return (

            <div className="cart-page">

                <div className="cart-box cart-status-box">

                    <div className="cart-status-icon">
                        🛒
                    </div>

                    <h1>
                        سبد خرید
                    </h1>

                    <div className="cart-loading">
                        در حال دریافت سبد خرید...
                    </div>

                </div>

            </div>

        );
    }


    if (!isAuthenticated) {
        return null;
    }


    /* =====================================================
       Fatal Error
    ===================================================== */

    if (
        error &&
        !cart
    ) {

        return (

            <div className="cart-page">

                <div className="cart-box cart-status-box">

                    <div className="cart-status-icon">
                        ⚠
                    </div>

                    <h1>
                        سبد خرید
                    </h1>

                    <div className="cart-error">
                        {error}
                    </div>

                    <button
                        type="button"
                        className="cart-primary-button"
                        onClick={loadCart}
                    >
                        تلاش مجدد
                    </button>

                </div>

            </div>

        );
    }


    /* =====================================================
       Cart Data
    ===================================================== */

    const items =
        cart?.items || [];


    const total =
        cart?.total || 0;


    /*
     * وقتی payment با موفقیت شروع شده باشد،
     * cart باید قفل شود.
     */

    const paymentStarted =
        pendingPayment?.status === "pending";


    /* =====================================================
       Render
    ===================================================== */

    return (

        <div className="cart-page">

            <div className="cart-box">


                {/* =================================================
                   Header
                ================================================= */}

                <div className="cart-header">

                    <div className="cart-title-area">

                        <div className="cart-title-icon">
                            🛒
                        </div>

                        <div>

                            <h1>
                                سبد خرید من
                            </h1>

                            {items.length > 0 && (

                                <span className="cart-item-count">

                                    {items.length.toLocaleString("fa-IR")}

                                    {" "}
                                    محصول

                                </span>

                            )}

                        </div>

                    </div>


                    {items.length > 0 && (

                        <button
                            type="button"
                            className="cart-clear-button"
                            onClick={
                                handleClearCart
                            }
                            disabled={
                                actionLoading ||
                                checkoutLoading ||
                                paymentStarted
                            }
                        >

                            {actionLoading
                                ? "در حال انجام..."
                                : "خالی کردن سبد"
                            }

                        </button>

                    )}

                </div>


                {/* =================================================
                   Error
                ================================================= */}

                {error && (

                    <div className="cart-error">
                        {error}
                    </div>

                )}


                {/* =================================================
                   Pending Order Notice
                ================================================= */}

                {pendingOrder && (

                    <div className="cart-pending-order">

                        <h2>
                            سفارش نیمه‌کاره دارید
                        </h2>


                        <p>

                            سفارش شماره{" "}

                            <strong>
                                {pendingOrder.id}
                            </strong>

                            {" "}
                            هنوز تکمیل نشده است.

                        </p>


                        <p>

                            وضعیت پرداخت:{" "}

                            <strong>

                                {
                                    pendingPayment?.status === "pending"
                                        ? "در انتظار تکمیل پرداخت"
                                        : "پرداخت هنوز شروع نشده"
                                }

                            </strong>

                        </p>


                        {paymentStarted && (

                            <p className="cart-payment-locked-message">

                                پرداخت این سفارش آغاز شده است.

                                {" "}

                                تغییر سبد خرید تا تعیین تکلیف
                                پرداخت امکان‌پذیر نیست.

                            </p>

                        )}

                    </div>

                )}


                {/* =================================================
                   Empty
                ================================================= */}

                {items.length === 0 ? (

                    <div className="cart-empty">

                        <div className="cart-empty-icon">
                            🛒
                        </div>

                        <h2>
                            سبد خرید شما خالی است
                        </h2>

                        <p>
                            هنوز محصولی به سبد خرید
                            اضافه نکرده‌اید.
                        </p>


                        <Link
                            to="/series"
                            className="cart-products-link"
                        >
                            مشاهده محصولات
                        </Link>

                    </div>

                ) : (

                    <>

                        {/* =========================================
                           Items
                        ========================================= */}

                        <div className="cart-items">

                            {items.map((item) => (

                                <div
                                    className="cart-item"
                                    key={
                                        item.product_id
                                    }
                                >


                                    {/* Image */}

                                    <div className="cart-item-image">

                                        <img
                                            src={
                                                item.image_url
                                            }
                                            alt={
                                                item.name_fa
                                            }
                                        />

                                    </div>


                                    {/* Information */}

                                    <div className="cart-item-info">

                                        <h2>
                                            {item.name_fa}
                                        </h2>


                                        {item.series_name && (

                                            <div className="cart-item-series">

                                                {item.series_name}

                                                {item.series_finish && (
                                                    <>
                                                        {" • "}
                                                        {item.series_finish}
                                                    </>
                                                )}

                                            </div>

                                        )}


                                        <div className="cart-item-unit-price">

                                            قیمت واحد:

                                            <strong>

                                                {Number(
                                                    item.price
                                                ).toLocaleString(
                                                    "fa-IR"
                                                )}

                                                {" "}
                                                تومان

                                            </strong>

                                        </div>

                                    </div>


                                    {/* Quantity */}

                                    <div className="cart-item-quantity-area">

                                        <span className="cart-section-label">
                                            تعداد
                                        </span>

                                        <div className="cart-item-quantity">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleIncrease(
                                                        item.product_id,
                                                        item.quantity
                                                    )
                                                }
                                                disabled={
                                                    actionLoading ||
                                                    checkoutLoading ||
                                                    paymentStarted
                                                }
                                                aria-label="افزایش تعداد"
                                            >
                                                +
                                            </button>


                                            <span>
                                                {Number(
                                                    item.quantity
                                                ).toLocaleString(
                                                    "fa-IR"
                                                )}
                                            </span>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDecrease(
                                                        item.product_id,
                                                        item.quantity
                                                    )
                                                }
                                                disabled={
                                                    actionLoading ||
                                                    checkoutLoading ||
                                                    paymentStarted ||
                                                    item.quantity <= 1
                                                }
                                                aria-label="کاهش تعداد"
                                            >
                                                −
                                            </button>

                                        </div>

                                    </div>


                                    {/* Total */}

                                    <div className="cart-item-total-area">

                                        <span className="cart-section-label">
                                            قیمت کل
                                        </span>

                                        <div className="cart-item-total">

                                            {Number(
                                                item.price *
                                                item.quantity
                                            ).toLocaleString(
                                                "fa-IR"
                                            )}

                                            <span>
                                                تومان
                                            </span>

                                        </div>

                                    </div>


                                    {/* Remove */}

                                    <button
                                        type="button"
                                        className="cart-item-remove"
                                        onClick={() =>
                                            handleRemove(
                                                item.product_id
                                            )
                                        }
                                        disabled={
                                            actionLoading ||
                                            checkoutLoading ||
                                            paymentStarted
                                        }
                                    >
                                        حذف
                                    </button>

                                </div>

                            ))}

                        </div>


                        {/* =========================================
                           Footer
                        ========================================= */}

                        <div className="cart-footer">


                            <div className="cart-total">

                                <span>
                                    مبلغ قابل پرداخت
                                </span>

                                <strong>

                                    {Number(
                                        total
                                    ).toLocaleString(
                                        "fa-IR"
                                    )}

                                    <small>
                                        تومان
                                    </small>

                                </strong>

                            </div>


                            <div className="cart-actions">

{
    paymentStarted ? (

        <>
            {/* ---------------------------------
               Cancel Pending Order
            --------------------------------- */}

            <button
                type="button"
                className="cart-back-button"
                onClick={
                    handleCancelPendingOrder
                }
                disabled={
                    actionLoading ||
                    checkoutLoading
                }
            >

                {
                    actionLoading
                        ? "در حال لغو..."
                        : "لغو سفارش"
                }

            </button>


            {/* ---------------------------------
               Continue Payment
            --------------------------------- */}

            <button
                type="button"
                className="cart-checkout-button"
                onClick={
                    handleContinuePayment
                }
                disabled={
                    actionLoading ||
                    checkoutLoading
                }
            >

                {
                    checkoutLoading
                        ? "در حال پردازش..."
                        : "ادامه پرداخت"
                }

            </button>

        </>

    ) : (

        <>
            {/* ---------------------------------
               Continue Shopping
            --------------------------------- */}

            <button
                type="button"
                className="cart-continue-button"
                onClick={() => {

                    const lastPage =
                        localStorage.getItem(
                            "lastShoppingPage"
                        );

                    navigate(
                        lastPage ||
                        "/series"
                    );

                }}
                disabled={
                    actionLoading ||
                    checkoutLoading
                }
            >
                ادامه خرید
            </button>


            {/* ---------------------------------
               Checkout
            --------------------------------- */}

            <button
                type="button"
                className="cart-checkout-button"
                onClick={
                    handleCheckout
                }
                disabled={
                    actionLoading ||
                    checkoutLoading
                }
            >

                {
                    checkoutLoading

                        ? "در حال پردازش..."

                        : pendingOrder

                            ? "ادامه ثبت سفارش"

                            : "ادامه و ثبت سفارش"
                }

            </button>

        </>

    )
}

</div>

                        </div>

                    </>

                )}

            </div>

        </div>

    );
}


export default Cart;