import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


function SeriesPage() {

    const navigate = useNavigate();

    const { seriesId: urlSeriesId } = useParams();

    const [seriesId, setSeriesId] = useState(
        Number(urlSeriesId) || 1
    );
    const [series, setSeries] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /*
     * -------------------------
     * macros
     * -------------------------
     */

    const MAX_SERIES_ID = 40;


    /*
     * -------------------------
     * Current Series
     * -------------------------
     */



    /*
     * -------------------------
     * Animation
     * -------------------------
     */

    const [direction, setDirection] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [nextSeries, setNextSeries] = useState(null);


    /*
     * -------------------------
     * دریافت سری فعلی
     * -------------------------
     */
    useEffect(() => {
        localStorage.setItem(
            "lastShoppingPage",
            window.location.pathname
        );
    }, []);

    useEffect(() => {

        const id = Number(urlSeriesId) || 1;

        setSeriesId(id);

        localStorage.setItem(
            "lastSeriesId",
            id
        );

    }, [urlSeriesId]);


    useEffect(() => {

        async function loadSeries() {

            try {

                setLoading(true);
                setError(null);

                const response = await fetch(
                    `http://localhost:3000/api/series/${seriesId}`
                );

                if (!response.ok) {

                    throw new Error(
                        "خطا در دریافت اطلاعات سری"
                    );

                }

                const data = await response.json();

                setSeries(data);

                setLoading(false);

            } catch (error) {

                console.error(error);

                setError(
                    "خطا در دریافت اطلاعات سری"
                );

                setLoading(false);

            }
        }

        loadSeries();

    }, [seriesId]);


    /*
     * -------------------------
     * تغییر سری
     * -------------------------
     */

    async function changeSeries(
        newId,
        newDirection
    ) {

        /*
         * اگر animation در حال اجراست
         * اجازه کلیک دوباره نمی‌دهیم
         */

        if (isAnimating) {
            return;
        }


        try {

            /*
             * دریافت سری بعدی
             */

            const response = await fetch(
                `http://localhost:3000/api/series/${newId}`
            );

            if (!response.ok) {

                throw new Error(
                    "خطا در دریافت سری جدید"
                );

            }

            const data = await response.json();


            /*
             * آماده کردن صفحه جدید
             */

            setNextSeries(data);


            /*
             * مشخص کردن جهت animation
             */

            setDirection(newDirection);


            /*
             * شروع animation
             */

            setIsAnimating(true);


            /*
             * صبر تا animation تمام شود
             */

            setTimeout(() => {

                /*
                 * صفحه جدید را تبدیل به صفحه اصلی می‌کنیم.
                 *
                 * هنوز nextSeries را پاک نمی‌کنیم.
                 */

                setSeries(data);

                setSeriesId(newId);

                navigate(`/series/${newId}`, {
                    replace: true
                });

                setDirection(null);


                /*
                 * اجازه می‌دهیم React یک فریم
                 * وضعیت جدید را render کند.
                 */

                requestAnimationFrame(() => {

                    /*
                     * حالا صفحه incoming را حذف می‌کنیم.
                     */

                    setNextSeries(null);

                    setIsAnimating(false);

                });

            }, 500);


        } catch (error) {

            console.error(error);

        }
    }


    /*
     * -------------------------
     * Loading
     * -------------------------
     */

    /*
     * در اولین بار که اطلاعات هنوز دریافت نشده،
     * چیزی نمایش نمی‌دهیم.
     *
     * هنگام تغییر سری، صفحه قبلی باقی می‌ماند
     * تا صفحه جدید آماده شود.
     */

    if (!series) {
        return null;
    }


    /*
     * -------------------------
     * Error
     * -------------------------
     */

    if (error) {

        return (
            <div className="error">
                {error}
            </div>
        );

    }


    /*
     * -------------------------
     * Render
     * -------------------------
     */

    return (
        <>




            {/* =========================
                Navigation
            ========================= */}

            <div className="series-navigation">

                {/* سمت چپ */}

                {seriesId > 1 && (

                    <button
                        className="nav-arrow nav-arrow-left"
                        onClick={() =>
                            changeSeries(
                                seriesId - 1,
                                "previous"
                            )
                        }
                    >
                        &gt;
                    </button>

                )}


                {/* سمت راست */}

                {seriesId < MAX_SERIES_ID && (

                    <button
                        className="nav-arrow nav-arrow-right"
                        onClick={() =>
                            changeSeries(
                                seriesId + 1,
                                "next"
                            )
                        }
                    >
                        &lt;
                    </button>

                )}

            </div>


            {/* =========================
                Series Stage
            ========================= */}

            <div className="series-stage">


                {/* =========================
                    صفحه فعلی
                ========================= */}

                <main
                    className={`
                        page
                        series-content
                        ${direction
                            ? `slide-${direction}`
                            : ""
                        }
                    `}
                >

                    <header className="series-header">

                        {/* =========================
                            English Side
                        ========================= */}

                        <div className="series-name-en-container">

                            <div className="series-name-en">

                                <span className="series-name-en-title">
                                    {series.name_en}
                                </span>

                                <span
                                    className="series-name-en-finish"
                                    style={{
                                        color: series.color_code
                                    }}
                                >
                                    {series.finish_en}
                                </span>

                            </div>

                        </div>


                        {/* =========================
                            Persian Side
                        ========================= */}

                        <div className="series-name">

                            <h1>
                                {series.name_fa}
                            </h1>

                            <span
                                className="finish-fa"
                                style={{
                                    color: series.color_code
                                }}
                            >
                                {series.finish_fa}
                            </span>

                        </div>

                    </header>


                    {/* =========================
                        Products
                    ========================= */}

                    <section className="products-grid">

                        {series.products.map(
                            (product) => (

                                <article
                                    className="product-card"
                                    key={product.id}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >

                                    <div className="product-image">

                                        <img
                                            src={`/images/${series.folder_name}/${product.image_path}`}
                                            alt={product.name_fa}
                                        />

                                    </div>


                                    <div className="product-info">

                                        <h2>
                                            {product.name_fa}
                                        </h2>

                                        <p>

                                            {Number(
                                                product.price
                                            ).toLocaleString(
                                                "fa-IR"
                                            )}

                                            <span>
                                                تومان
                                            </span>

                                        </p>

                                    </div>

                                </article>

                            )
                        )}

                    </section>
                    {/* =========================
    Back to Series List
========================= */}

                    <div className="back-to-series-list">
                        <span
                            onClick={() => navigate("/series")}
                        >
                            بازگشت به صفحه لیست سری محصولات
                        </span>
                    </div>

                </main>


                {/* =========================
                    صفحه جدید
                ========================= */}

                {nextSeries && (

                    <div
                        className={`
                            incoming-wrapper
                            ${direction === "next"
                                ? "incoming-from-left"
                                : "incoming-from-right"
                            }
                        `}
                    >

                        <main className="page">

                            <header className="series-header">

                                {/* =========================
                                    English Side
                                ========================= */}

                                <div className="series-name-en-container">

                                    <div className="series-name-en">

                                        <span className="series-name-en-title">
                                            {nextSeries.name_en}
                                        </span>

                                        <span
                                            className="series-name-en-finish"
                                            style={{
                                                color: nextSeries.color_code
                                            }}
                                        >
                                            {nextSeries.finish_en}
                                        </span>

                                    </div>

                                </div>


                                {/* =========================
                                    Persian Side
                                ========================= */}

                                <div className="series-name">

                                    <h1>
                                        {nextSeries.name_fa}
                                    </h1>

                                    <span
                                        className="finish-fa"
                                        style={{
                                            color: nextSeries.color_code
                                        }}
                                    >
                                        {nextSeries.finish_fa}
                                    </span>

                                </div>

                            </header>


                            {/* =========================
                                Products
                            ========================= */}

                            <section className="products-grid">

                                {nextSeries.products.map(
                                    (product) => (

                                        <article
                                            className="product-card"
                                            key={product.id}
                                            onClick={() => navigate(`/product/${product.id}`)}
                                        >

                                            <div className="product-image">

                                                <img
                                                    src={`/images/${nextSeries.folder_name}/${product.image_path}`}
                                                    alt={product.name_fa}
                                                />

                                            </div>


                                            <div className="product-info">

                                                <h2>
                                                    {product.name_fa}
                                                </h2>

                                                <p>

                                                    {Number(
                                                        product.price
                                                    ).toLocaleString(
                                                        "fa-IR"
                                                    )}

                                                    <span>
                                                        تومان
                                                    </span>

                                                </p>

                                            </div>

                                        </article>

                                    )
                                )}

                            </section>

                        </main>

                    </div>

                )}

            </div>

        </>
    );
}

export default SeriesPage;