import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    getAllSeries
} from "../api/seriesApi";

import "../styles/seriesList.css";


function SeriesListPage() {

    const navigate = useNavigate();


    const [seriesList, setSeriesList] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    /* =====================================================
       Load Series
    ===================================================== */

    useEffect(() => {

        async function loadSeries() {

            try {

                setLoading(true);

                setError(null);


                const data =
                    await getAllSeries();


                setSeriesList(
                    data.series || []
                );

            }
            catch (error) {

                console.error(error);

                setError(
                    "خطا در دریافت لیست سری‌ها"
                );

            }
            finally {

                setLoading(false);

            }
        }


        loadSeries();

    }, []);


    /* =====================================================
       Loading
    ===================================================== */

    if (loading) {

        return (

            <div className="series-list-page">

                <div className="series-list-box series-list-status">

                    <div className="series-list-status-icon">
                        🚿
                    </div>

                    <h1>
                        لیست محصولات
                    </h1>

                    <p>
                        در حال دریافت محصولات...
                    </p>

                </div>

            </div>

        );

    }


    /* =====================================================
       Error
    ===================================================== */

    if (error) {

        return (

            <div className="series-list-page">

                <div className="series-list-box series-list-status">

                    <div className="series-list-status-icon">
                        ⚠
                    </div>

                    <h1>
                        لیست محصولات
                    </h1>

                    <div className="series-list-error">
                        {error}
                    </div>

                </div>

            </div>

        );

    }


    /* =====================================================
       Render
    ===================================================== */

    return (

        <div className="series-list-page">

            <main className="series-list-box">


                {/* =================================================
                   Header
                ================================================= */}

                <header className="series-list-header">

                    <div className="series-list-title-area">

                        <div className="series-list-title-icon">
                            📋
                        </div>

                        <div>

                            <h1>
                                لیست محصولات
                            </h1>

                            <span>
                                مجموعه شیرآلات بهداشتی ساحل
                            </span>

                        </div>

                    </div>


                    <div className="series-list-count">

                        {seriesList.length.toLocaleString("fa-IR")}

                        {" "}

                        سری محصول

                    </div>

                </header>


                {/* =================================================
                   Series Grid
                ================================================= */}

                <section className="series-list-grid">

                    {seriesList.map(
                        (series) => (

                            <article
                                className="series-list-card"
                                key={series.id}
                                onClick={() =>
                                    navigate(
                                        `/series/${series.id}`
                                    )
                                }
                            >

                                {/* Image */}

                                <div className="series-list-image">

                                    {series.preview_image ? (

                                        <img
                                            src={
                                                `/images/${series.folder_name}/${series.preview_image}`
                                            }
                                            alt={
                                                series.name_fa
                                            }
                                        />

                                    ) : (

                                        <div className="series-list-no-image">
                                            بدون تصویر
                                        </div>

                                    )}

                                </div>


                                {/* Information */}

                                <div className="series-list-info">

                                    <h2>
                                        {series.name_fa}
                                    </h2>


                                    {series.name_en && (

                                        <span className="series-list-name-en">
                                            {series.name_en}
                                        </span>

                                    )}


                                    {series.finish_fa?.trim() && (

                                        <span
                                            className="series-list-finish"
                                            style={{
                                                color:
                                                    series.color_code
                                            }}
                                        >
                                            {series.finish_fa}
                                        </span>

                                    )}

                                </div>

                            </article>

                        )
                    )}

                </section>


                {/* =================================================
                   Back Home
                ================================================= */}

                <div className="series-list-back">

                    <span
                        onClick={() =>
                            navigate("/home")
                        }
                    >
                        بازگشت به صفحه اصلی
                    </span>

                </div>

            </main>

        </div>

    );

}


export default SeriesListPage;