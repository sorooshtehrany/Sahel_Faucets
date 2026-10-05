import { useEffect } from "react";

function About() {

    useEffect(() => {

        document.body.classList.add("about-active");

        return () => {
            document.body.classList.remove("about-active");
        };

    }, []);

    return (
        <div className="about-page">

            {/* =========================
                Hero
            ========================= */}

            <section className="about-hero">

                <div className="about-overlay"></div>

                <div className="about-hero-content">

                    <h1>
                        درباره شیرآلات بهداشتی ساحل
                    </h1>

                    <div className="about-hero-line"></div>

                    <p>
                        از دل آب، زیبایی جاری شد
                    </p>

                </div>

            </section>


            {/* =========================
                Company Story
            ========================= */}

            <section className="about-story">

                <div className="about-story-container">

                    <h2>
                        داستان ساحل
                    </h2>

                    <p>
                        شرکت شیرآلات بهداشتی ساحل در سال ۱۳۷۸
                        با دریافت گواهینامه فعالیت تولید، گام مهمی
                        در مسیر تولید شیرآلات بهداشتی برداشت.
                    </p>

                    <p>
                        مدیران ارشد این مجموعه با هدف استمرار حرکت
                        رو به جلو، حفظ کیفیت و جلب رضایت مشتریان،
                        با تکیه بر دانش فنی و تلاش مستمر، موفق به
                        دریافت نشان استاندارد ملی ایران و گواهینامه
                        مدیریت کیفیت ISO 9001:2008 شدند.
                    </p>

                    <p>
                        این رویکرد موجب شد محصولات ساحل مورد توجه
                        کارشناسان و فعالان صنعت ساختمان قرار گیرد.
                    </p>

                    <p>
                        شیرآلات ساحل با تمرکز بر عواملی همچون کیفیت،
                        تنوع، طراحی و زیبایی بصری، حفظ محیط زیست و
                        صرفه‌جویی در مصرف آب، همواره تلاش می‌کند
                        فرآیند تولید خود را با استانداردهای کیفی و
                        نیازهای روز بازار هماهنگ سازد و محصولاتی
                        شایسته خانه‌های ایرانی ارائه دهد.
                    </p>

                    <p>
                        هدف ما ارائه محصولاتی با کیفیت، طراحی زیبا
                        و عملکرد قابل اعتماد است؛ محصولاتی که بتوانند
                        بخشی از زیبایی و آرامش خانه‌های ایرانی را
                        شکل دهند.
                    </p>

                </div>
                <div className="about-story-english">

                    <h3>
                        About Sahel Sanitary Faucets
                    </h3>

                    <p>
                        Sahel Sanitary Faucets Company began its manufacturing
                        activities in 1999 after obtaining its production certificate.
                    </p>

                    <p>
                        With the goal of maintaining continuous growth, product
                        quality, and customer satisfaction, the senior management
                        team has relied on technical expertise and continuous effort
                        to achieve the Iranian National Standard certification
                        and ISO 9001:2008 Quality Management certification.
                    </p>

                    <p>
                        These achievements have contributed to establishing
                        Sahel Faucets as a recognized name among professionals
                        in the building and construction industry.
                    </p>

                    <p>
                        By focusing on quality, variety, visual design,
                        environmental responsibility, and water conservation,
                        Sahel Faucets continues to improve its manufacturing
                        processes and develop products that meet the needs
                        of modern homes.
                    </p>

                </div>
            </section>


            {/* =========================
                Factory Gallery
            ========================= */}

            <section className="factory-section">

                <div className="factory-container">

                    <div className="factory-heading">

                        <h2>
                            نگاهی به مجموعه ساحل
                        </h2>

                        <p>
                            بخشی از محیط تولید و فعالیت مجموعه
                            شیرآلات بهداشتی ساحل
                        </p>

                    </div>


                    <div className="factory-gallery">

                        <div className="factory-image-card">

                            <img
                                src="/images/About/1.png"                                
                            />

                        </div>


                        <div className="factory-image-card">

                            <img
                                src="/images/About/2.png"                                
                            />

                        </div>


                        <div className="factory-image-card">

                            <img
                                src="/images/About/3.png"                                
                            />

                        </div>


                        <div className="factory-image-card">

                            <img
                                src="/images/About/4.png"                                
                            />

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
                Closing
            ========================= */}

            <section className="about-closing">

                <div className="about-closing-content">

                    <h2>
                        ساحل؛ جریان زیبایی در خانه شما
                    </h2>

                    <p>
                        کیفیت، طراحی و توجه به نیازهای مشتری،
                        مسیر ما را برای ساخت آینده‌ای بهتر ادامه می‌دهد.
                    </p>

                </div>

            </section>

        </div>
    );
}

export default About;