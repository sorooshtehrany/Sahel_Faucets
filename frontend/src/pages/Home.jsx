import { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductSearch from "../components/ProductSearch.jsx";

function Home() {

    useEffect(() => {

        document.body.classList.add("home-active");

        return () => {
            document.body.classList.remove("home-active");
        };

    }, []);

    return (
        <div className="home-page">

            {/* =========================
                Hero
            ========================= */}

            <section className="home-hero">

                <div className="home-content">

                    <h2>
                        زیبایی خانه، از انتخاب درست آغاز می‌شود  
                    </h2>

                    <h2>
                        طراحی زیبا، کیفیت ماندگار و انتخابی مطمئن برای خانه شما
                    </h2>

                </div>

            </section>


            {/* =========================
                Short Introduction
            ========================= */}
            
            <section className="home-intro">

                <div className="home-intro-container">

                    <h2>
                        درباره شیرآلات بهداشتی ساحل
                    </h2>

                    <p>
                        شرکت شیرآلات بهداشتی ساحل با بیش از دو دهه
                        تجربه در زمینه تولید شیرآلات، همواره کیفیت،
                        طراحی زیبا، رضایت مشتری و صرفه‌جویی در مصرف آب
                        را در اولویت قرار داده است.
                    </p>

                    <p>
                        ما تلاش می‌کنیم با تکیه بر دانش فنی و تجربه،
                        محصولاتی با کیفیت و طراحی مناسب برای خانه‌های
                        امروزی ارائه کنیم.
                    </p>


                    <Link
                        to="/about"
                        className="home-intro-button"
                    >
                        بیشتر درباره ساحل
                    </Link>

                </div>

            </section>

        </div>
    );
}

export default Home;