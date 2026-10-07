import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getPendingOrder,
    startPayment,
    testPaymentSuccess,
    testPaymentFailed
} from "../api/orderApi";

function PaymentPage() {

    const navigate = useNavigate();

    const { orderId } = useParams();


    // -------------------------------------------------
    // State
    // -------------------------------------------------

    const [order, setOrder] =
        useState(null);

    const [payment, setPayment] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // -------------------------------------------------
    // Load order
    // -------------------------------------------------

    useEffect(() => {

        async function loadOrder() {

            try {

                setLoading(true);

                setError("");


                const data =
                    await getPendingOrder();


                // -------------------------------------------------
                // No pending order
                // -------------------------------------------------

                if (!data.order) {

                    navigate(
                        "/cart",
                        {
                            replace: true
                        }
                    );

                    return;
                }


                // -------------------------------------------------
                // Check order id
                // -------------------------------------------------

                if (
                    Number(data.order.id) !==
                    Number(orderId)
                ) {

                    navigate(
                        "/cart",
                        {
                            replace: true
                        }
                    );

                    return;
                }


                // -------------------------------------------------
                // Save order and payment
                // -------------------------------------------------

                setOrder(
                    data.order
                );

                setPayment(
                    data.payment
                );

            }
            catch (error) {

                console.error(
                    "Load payment order error:",
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


        loadOrder();

    }, [
        orderId,
        navigate
    ]);


    // -------------------------------------------------
    // Start payment
    // -------------------------------------------------

    async function handleStartPayment() {

        if (
            !order ||
            actionLoading
        ) {

            return;
        }


        try {

            setActionLoading(true);

            setError("");


            const data =
                await startPayment(
                    order.id
                );


            console.log(
                "Payment started:",
                data
            );


            // -------------------------------------------------
            // Save payment
            // -------------------------------------------------

            setPayment(
                data.payment
            );


        }
        catch (error) {

            console.error(
                "Start payment error:",
                error
            );

            setError(
                error.message ||
                "خطایی در شروع پرداخت رخ داد."
            );

        }
        finally {

            setActionLoading(false);

        }
    }


    // -------------------------------------------------
    // Test payment success
    // -------------------------------------------------

    async function handleTestPaymentSuccess() {

        if (
            !order ||
            actionLoading
        ) {

            return;
        }


        try {

            setActionLoading(true);

            setError("");


            const data =
                await testPaymentSuccess(
                    order.id
                );


            console.log(
                "Payment success:",
                data
            );


            // -------------------------------------------------
            // Notify Navbar and other cart listeners
            // -------------------------------------------------

            window.dispatchEvent(
                new Event("cartUpdated")
            );


            alert(
                "پرداخت با موفقیت انجام شد."
            );


            navigate(
                "/cart",
                {
                    replace: true
                }
            );

        }
        catch (error) {

            console.error(
                "Test payment success error:",
                error
            );

            setError(
                error.message ||
                "خطایی در پرداخت آزمایشی رخ داد."
            );

        }
        finally {

            setActionLoading(false);

        }
    }


    // -------------------------------------------------
    // Test payment failed
    // -------------------------------------------------

    async function handleTestPaymentFailed() {

        if (
            !order ||
            actionLoading
        ) {

            return;
        }


        try {

            setActionLoading(true);

            setError("");


            const data =
                await testPaymentFailed(
                    order.id
                );


            console.log(
                "Payment failed:",
                data
            );


            alert(
                "پرداخت ناموفق بود."
            );


            navigate(
                "/cart",
                {
                    replace: true
                }
            );

        }
        catch (error) {

            console.error(
                "Test payment failed error:",
                error
            );

            setError(
                error.message ||
                "خطایی در ثبت پرداخت ناموفق رخ داد."
            );

        }
        finally {

            setActionLoading(false);

        }
    }


    // -------------------------------------------------
    // Loading
    // -------------------------------------------------

    if (loading) {

        return (

            <div className="payment-page">

                <div className="payment-card">

                    <p>
                        در حال دریافت اطلاعات سفارش...
                    </p>

                </div>

            </div>

        );
    }


    // -------------------------------------------------
    // Error without order
    // -------------------------------------------------

    if (
        error &&
        !order
    ) {

        return (

            <div className="payment-page">

                <div className="payment-card">

                    <p className="payment-error">
                        {error}
                    </p>


                    <button
                        type="button"
                        className="payment-back-button"
                        onClick={() =>
                            navigate("/cart")
                        }
                    >
                        بازگشت به سبد خرید
                    </button>

                </div>

            </div>

        );
    }


    // -------------------------------------------------
    // Render
    // -------------------------------------------------

    return (

        <div className="payment-page">

            <div className="payment-card">

                <h1>
                    پرداخت سفارش
                </h1>


                {/* ----------------------------------------- */}
                {/* Order information */}
                {/* ----------------------------------------- */}

                <div className="payment-info">

                    <div className="payment-info-row">

                        <span>
                            شماره سفارش
                        </span>

                        <strong>
                            {order.id}
                        </strong>

                    </div>


                    <div className="payment-info-row">

                        <span>
                            مبلغ سفارش
                        </span>

                        <strong>
                            {
                                Number(
                                    order.total_amount
                                ).toLocaleString("fa-IR")
                            }

                            {" تومان"}
                        </strong>

                    </div>


                    <div className="payment-info-row">

                        <span>
                            وضعیت سفارش
                        </span>

                        <strong>
                            {
                                order.status === "pending"
                                    ? "در انتظار پرداخت"
                                    : order.status
                            }
                        </strong>

                    </div>


                    <div className="payment-info-row">

                        <span>
                            وضعیت پرداخت
                        </span>

                        <strong>

                            {
                                !payment &&
                                "پرداخت شروع نشده"
                            }

                            {
                                payment?.status === "pending" &&
                                "در حال پرداخت"
                            }

                            {
                                payment?.status === "paid" &&
                                "پرداخت شده"
                            }

                            {
                                payment?.status === "failed" &&
                                "پرداخت ناموفق"
                            }

                        </strong>

                    </div>

                </div>


                {/* ----------------------------------------- */}
                {/* Error */}
                {/* ----------------------------------------- */}

                {
                    error && (

                        <p className="payment-error">
                            {error}
                        </p>

                    )
                }


                {/* ----------------------------------------- */}
                {/* Payment not started */}
                {/* ----------------------------------------- */}

                {
                    !payment && (

                        <button
                            type="button"
                            className="payment-button"
                            onClick={
                                handleStartPayment
                            }
                            disabled={
                                actionLoading
                            }
                        >

                            {
                                actionLoading
                                    ? "در حال پردازش..."
                                    : "پرداخت"
                            }

                        </button>

                    )
                }


                {/* ----------------------------------------- */}
                {/* Payment started */}
                {/* ----------------------------------------- */}

                {
                    payment?.status === "pending" && (

                        <>

                            <p>
                                پرداخت برای این سفارش آغاز شده است.
                            </p>


                            {/* --------------------------------- */}
                            {/* Temporary test buttons */}
                            {/* --------------------------------- */}

                            <button
                                type="button"
                                className="payment-button"
                                onClick={
                                    handleTestPaymentSuccess
                                }
                                disabled={
                                    actionLoading
                                }
                            >

                                {
                                    actionLoading
                                        ? "در حال پردازش..."
                                        : "تست پرداخت موفق"
                                }

                            </button>


                            <button
                                type="button"
                                className="payment-back-button"
                                onClick={
                                    handleTestPaymentFailed
                                }
                                disabled={
                                    actionLoading
                                }
                            >

                                {
                                    actionLoading
                                        ? "در حال پردازش..."
                                        : "تست پرداخت ناموفق"
                                }

                            </button>

                        </>

                    )
                }


                {/* ----------------------------------------- */}
                {/* Back */}
                {/* ----------------------------------------- */}

                <button
                    type="button"
                    className="payment-back-button"
                    onClick={() =>
                        navigate("/cart")
                    }
                    disabled={
                        actionLoading
                    }
                >
                    بازگشت به سبد خرید
                </button>

            </div>

        </div>

    );
}

export default PaymentPage;