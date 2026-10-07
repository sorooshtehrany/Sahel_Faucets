import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    addToCart
} from "../api/cartApi";

import {
    getPendingOrder
} from "../api/orderApi";

import {
    useAuth
} from "../context/AuthContext";


function ProductDetail() {

    const navigate = useNavigate();

    const { id } = useParams();

    const {
        isAuthenticated
    } = useAuth();


    const [product, setProduct] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [quantity, setQuantity] =
        useState(1);

    const [cartLoading, setCartLoading] =
        useState(false);

    const [cartMessage, setCartMessage] =
        useState("");

    const [paymentStarted, setPaymentStarted] =
        useState(false);


    /* =========================
       Load Product
    ========================= */

    useEffect(() => {

        async function loadProduct() {

            try {

                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:3000/api/products/${id}`
                );


                if (!response.ok) {

                    if (response.status === 404) {

                        throw new Error(
                            "محصول مورد نظر پیدا نشد."
                        );

                    }

                    throw new Error(
                        "خطایی در دریافت اطلاعات محصول رخ داد."
                    );

                }


                const data =
                    await response.json();

                setProduct(data);

            }
            catch (error) {

                console.error(
                    "Load product error:",
                    error
                );

                setError(
                    error.message ||
                    "خطا در دریافت اطلاعات محصول."
                );

            }
            finally {

                setLoading(false);

            }

        }


        loadProduct();

    }, [id]);


    /* =========================
       Check Payment Status
    ========================= */

    useEffect(() => {

        async function checkPaymentStatus() {

            if (!isAuthenticated) {

                setPaymentStarted(false);

                return;

            }


            try {

                const data =
                    await getPendingOrder();


                const started =
                    data.payment?.status === "pending";


                setPaymentStarted(
                    started
                );

            }
            catch (error) {

                console.error(
                    "Check payment status error:",
                    error
                );

                setPaymentStarted(false);

            }

        }


        checkPaymentStatus();

    }, [isAuthenticated]);


    /* =========================
       Last Shopping Page
    ========================= */

    useEffect(() => {

        localStorage.setItem(
            "lastShoppingPage",
            window.location.pathname
        );

    }, []);


    /* =========================
       Quantity
    ========================= */

    function increaseQuantity() {

        if (
            !product ||
            paymentStarted
        ) {
            return;
        }


        if (
            quantity >= product.stock
        ) {
            return;
        }


        setQuantity(
            previous =>
                previous + 1
        );

    }


    function decreaseQuantity() {

        if (
            quantity <= 1 ||
            paymentStarted
        ) {
            return;
        }


        setQuantity(
            previous =>
                previous - 1
        );

    }


    /* =========================
       Add To Cart
    ========================= */

    async function handleAddToCart() {

        setCartMessage("");
        setError("");


        if (!isAuthenticated) {

            navigate("/login");

            return;

        }


        /*
         * اگر پرداخت یک سفارش شروع شده باشد،
         * سبد خرید قفل است.
         */

        if (paymentStarted) {

            setCartMessage(
                "پرداخت یک سفارش قبلی آغاز شده است. تا تعیین تکلیف آن، امکان تغییر سبد خرید وجود ندارد."
            );

            return;

        }


        if (!product) {
            return;
        }


        if (product.stock <= 0) {

            setCartMessage(
                "این محصول در حال حاضر ناموجود است."
            );

            return;

        }


        if (
            quantity > product.stock
        ) {

            setCartMessage(
                "تعداد انتخاب شده بیشتر از موجودی محصول است."
            );

            return;

        }


        try {

            setCartLoading(true);


            await addToCart(
                product.id,
                quantity
            );


            setCartMessage(
                "محصول با موفقیت به سبد خرید اضافه شد."
            );


            window.dispatchEvent(
                new Event("cartUpdated")
            );

        }
        catch (error) {

            console.error(
                "Add to cart error:",
                error
            );


            setCartMessage(
                error.message ||
                "خطا در افزودن محصول به سبد خرید."
            );

        }
        finally {

            setCartLoading(false);

        }

    }


    /* =========================
       Loading
    ========================= */

    if (loading) {

        return (
            <div className="product-detail-page">

                <div className="product-detail-message">

                    در حال دریافت اطلاعات محصول...

                </div>

            </div>
        );

    }


    /* =========================
       Error
    ========================= */

    if (error) {

        return (
            <div className="product-detail-page">

                <div className="product-detail-message error">

                    {error}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        بازگشت
                    </button>

                </div>

            </div>
        );

    }


    if (!product) {
        return null;
    }


    const isOutOfStock =
        product.stock <= 0;


    return (

        <div className="product-detail-page">

            <div className="product-detail-container">


                {/* =========================
                   Product Image
                ========================= */}

                <div className="product-detail-image">

                    <img
                        src={
                            `/images/Details/${product.id}.png`
                        }
                        alt={
                            product.name_fa
                        }
                    />

                </div>


                {/* =========================
                   Product Information
                ========================= */}

                <div className="product-detail-info">


                    <div className="product-detail-title">

                        <span>
                            مشخصات محصول
                        </span>

                    </div>


                    {/* =========================
                       Specifications
                    ========================= */}

                    <div className="product-detail-specs">


                        <div className="product-detail-spec">

                            <span className="spec-label">
                                نوع محصول
                            </span>

                            <span className="spec-value">
                                {product.name_fa}
                            </span>

                        </div>


                        <div className="product-detail-spec">

                            <span className="spec-label">
                                سری
                            </span>

                            <span className="spec-value">
                                {product.series_name_fa}
                            </span>

                        </div>


                        <div className="product-detail-spec">

                            <span className="spec-label">
                                رنگ
                            </span>

                            <span className="spec-value">
                                {product.series_finish_fa}
                            </span>

                        </div>


                        <div className="product-detail-spec">

                            <span className="spec-label">
                                قیمت
                            </span>

                            <span className="spec-value product-price">

                                {Number(
                                    product.price
                                ).toLocaleString(
                                    "fa-IR"
                                )}

                                <span className="currency">
                                    تومان
                                </span>

                            </span>

                        </div>


                        <div className="product-detail-spec">

                            <span className="spec-label">
                                موجودی
                            </span>

                            <span
                                className={
                                    `spec-value product-stock ${
                                        isOutOfStock
                                            ? "out-of-stock"
                                            : ""
                                    }`
                                }
                            >

                                {isOutOfStock

                                    ? "ناموجود"

                                    : `${Number(
                                        product.stock
                                    ).toLocaleString(
                                        "fa-IR"
                                    )} عدد`

                                }

                            </span>

                        </div>


                    </div>


                    {/* =========================
                       Description
                    ========================= */}

                    {product.description && (

                        <div className="product-detail-description">

                            <h2>
                                توضیحات
                            </h2>

                            <p>
                                {product.description}
                            </p>

                        </div>

                    )}


                    {/* =========================
                       Payment Lock Message
                    ========================= */}

                    {paymentStarted && (

                        <div className="cart-message error">

                            پرداخت یک سفارش قبلی آغاز شده است.

                            {" "}

                            تا تعیین تکلیف پرداخت،
                            امکان تغییر سبد خرید وجود ندارد.

                        </div>

                    )}


                    {/* =========================
                       Cart Section
                    ========================= */}

                    {!isOutOfStock && (

                        <div className="product-cart-section">


                            <div className="product-quantity">

                                <button
                                    type="button"
                                    onClick={
                                        increaseQuantity
                                    }
                                    disabled={
                                        cartLoading ||
                                        paymentStarted ||
                                        quantity >= product.stock
                                    }
                                    aria-label="افزایش تعداد"
                                >
                                    +
                                </button>


                                <span>
                                    {quantity}
                                </span>


                                <button
                                    type="button"
                                    onClick={
                                        decreaseQuantity
                                    }
                                    disabled={
                                        cartLoading ||
                                        paymentStarted ||
                                        quantity <= 1
                                    }
                                    aria-label="کاهش تعداد"
                                >
                                    −
                                </button>

                            </div>


                            <button
                                type="button"
                                className="add-to-cart-button"
                                onClick={
                                    handleAddToCart
                                }
                                disabled={
                                    cartLoading ||
                                    paymentStarted
                                }
                            >

                                {cartLoading

                                    ? "در حال افزودن..."

                                    : paymentStarted

                                        ? "سبد خرید قفل است"

                                        : "افزودن به سبد خرید"

                                }

                            </button>

                        </div>

                    )}


                    {/* =========================
                       Cart Message
                    ========================= */}

                    {cartMessage && (

                        <div
                            className={
                                `cart-message ${
                                    cartMessage.includes(
                                        "موفقیت"
                                    )
                                        ? "success"
                                        : "error"
                                }`
                            }
                        >
                            {cartMessage}
                        </div>

                    )}


                    {/* =========================
                       Go To Cart
                    ========================= */}

                    {cartMessage &&
                        cartMessage.includes(
                            "موفقیت"
                        ) && (

                        <button
                            type="button"
                            className="go-to-cart-button"
                            onClick={() =>
                                navigate("/cart")
                            }
                        >
                            مشاهده سبد خرید
                        </button>

                    )}


                    {/* =========================
                       Back To Series
                    ========================= */}

                    <button
                        type="button"
                        className="back-to-series-button"
                        onClick={() =>
                            navigate(
                                `/series/${product.series_id}`
                            )
                        }
                    >
                        مشاهده سایر محصولات این سری
                    </button>


                </div>

            </div>

        </div>

    );

}


export default ProductDetail;