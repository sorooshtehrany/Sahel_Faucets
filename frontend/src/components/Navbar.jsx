import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ProductSearch from "./ProductSearch.jsx";
import { useAuth } from "../context/AuthContext";


/* =========================
   Icons
========================= */

function CartSvg() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
            <path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
        </svg>
    );
}


function UserSvg() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle
                cx="12"
                cy="8"
                r="4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}


function LogoutSvg() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M13 8l4 4-4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9 12h8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}


function LocationSvg() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            />
            <circle
                cx="12"
                cy="9"
                r="2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            />
        </svg>
    );
}


function InstagramSvg() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            />
            <circle
                cx="12"
                cy="12"
                r="4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
    );
}


function TelegramSvg() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M21.5 3.5L2.8 10.7c-.9.35-.9 1.1-.16 1.35l4.8 1.5 1.85 5.7c.23.64.12.9.8.9.52 0 .75-.24 1.02-.5l2.33-2.27 4.84 3.58c.9.5 1.55.24 1.78-.83l3.18-15.02c.34-1.32-.5-1.92-1.74-1.52z"
                fill="currentColor"
            />
        </svg>
    );
}


/* =========================
   Navbar
========================= */

const PHONES = [
    { number: "02155428909", icon: "☎" },
    { number: "09126351614", icon: "📱" },
    { number: "09306191839", icon: "📱" }
];


function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);

    const { user, logout, isAuthenticated } = useAuth();

    const navigate = useNavigate();


    /* =========================
       Cart Count
    ========================= */

    useEffect(() => {

        let active = true;

        async function loadCartCount() {

            if (!isAuthenticated) {
                setCartItemCount(0);
                return;
            }

            const token = localStorage.getItem("token");

            if (!token) {
                setCartItemCount(0);
                return;
            }

            try {

                const response = await fetch(
                    "http://localhost:3000/api/cart",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    if (active) setCartItemCount(0);
                    return;
                }

                const data = await response.json();

                const items = Array.isArray(data.cart?.items)
                    ? data.cart.items
                    : [];

                const count = items.reduce((total, item) => {

                    const quantity = Number(item.quantity);

                    return total + (
                        Number.isFinite(quantity) && quantity > 0
                            ? quantity
                            : 0
                    );

                }, 0);

                if (active) setCartItemCount(count);

            } catch (error) {

                console.error("Load cart error:", error);

                if (active) setCartItemCount(0);
            }
        }

        loadCartCount();

        function handleCartUpdated() {
            loadCartCount();
        }

        window.addEventListener("cartUpdated", handleCartUpdated);

        return () => {
            active = false;
            window.removeEventListener("cartUpdated", handleCartUpdated);
        };

    }, [isAuthenticated]);


    function closeMenu() {
        setMenuOpen(false);
    }


    function handleLogout() {
        logout();
        closeMenu();
        navigate("/login");
    }


    return (
        <>
            <nav className="navbar">

                {/* =========================
                    Right Group
                    Topology:
                                  [ auth ]
                        [ cart ]
                        [ menu ]  [ search ]
                ========================= */}

                <div className="navbar-right">

                    <div className="navbar-menu-slot">

                        {/* Cart (top row, above the menu) */}

                        <div className="navbar-cart-slot">

                            {isAuthenticated && (
                                <Link
                                    to="/cart"
                                    className={`navbar-cart ${cartItemCount > 0
                                            ? "has-items"
                                            : "is-empty"
                                        }`}
                                    aria-label="سبد خرید"
                                    title="سبد خرید"
                                >

                                    <CartSvg />

                                    {cartItemCount > 0 && (
                                        <span className="cart-badge">
                                            {cartItemCount > 99
                                                ? "99+"
                                                : cartItemCount}
                                        </span>
                                    )}

                                </Link>
                            )}

                        </div>


                        {/* Menu (bottom row, beside search) */}

                        <div className="navbar-menu-button-slot">

                            <button
                                className="menu-button"
                                onClick={() => setMenuOpen(true)}
                                aria-label="باز کردن منو"
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>

                        </div>

                    </div>


                    <div className="navbar-right-column">

                        <div className="navbar-auth">

                            {isAuthenticated ? (
                                <>
                                    <div
                                        className="navbar-user"
                                        title="حساب کاربری"
                                    >
                                        <span className="user-icon">
                                            <UserSvg />
                                        </span>
                                    </div>

                                    <button
                                        className="navbar-logout"
                                        onClick={handleLogout}
                                        title="خروج از حساب کاربری"
                                        aria-label="خروج از حساب کاربری"
                                    >
                                        <LogoutSvg />
                                    </button>

                                    <span className="user-name">
                                        {user?.first_name} {user?.last_name}
                                    </span>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="navbar-login"
                                    title="ورود به حساب کاربری"
                                    aria-label="ورود به حساب کاربری"
                                >
                                    <UserSvg />
                                </Link>
                            )}

                        </div>

                        <ProductSearch />

                    </div>

                </div>


                {/* =========================
                    Brand
                ========================= */}

                <div className="navbar-brand">
                    <span className="navbar-brand-title">
                        شیرآلات بهداشتی ساحل
                    </span>

                    <span className="navbar-brand-subtitle">
                        زیبایی، کیفیت و اصالت در هر قطره
                    </span>
                </div>


                {/* =========================
                    Info (Location / Phones / Socials)
                ========================= */}

                <div className="navbar-info">

                    <a
                        className="navbar-location"
                        href="https://www.google.com/maps/search/?api=1&query=35.77363145356017,51.426576047945495"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="موقعیت شرکت در تهران"
                    >
                        <span className="location-icon">
                            <LocationSvg />
                        </span>

                        <span className="location-text">تهران</span>
                    </a>


                    <div className="navbar-phones">
                        {PHONES.map((phone) => (
                            <a
                                key={phone.number}
                                href={`tel:${phone.number}`}
                                className="navbar-phone"
                            >
                                <span className="phone-icon">
                                    {phone.icon}
                                </span>

                                <span className="phone-number">
                                    {phone.number}
                                </span>
                            </a>
                        ))}
                    </div>


                    <div className="navbar-socials">
                        <a
                            href="#"
                            className="social-icon instagram"
                            aria-label="Instagram"
                        >
                            <InstagramSvg />
                        </a>

                        <a
                            href="#"
                            className="social-icon telegram"
                            aria-label="Telegram"
                        >
                            <TelegramSvg />
                        </a>
                    </div>

                </div>

            </nav>


            {/* =========================
                Side Menu
            ========================= */}

            {menuOpen && (
                <>
                    <div className="menu-overlay" onClick={closeMenu}></div>

                    <aside className="side-menu">
                        <div className="side-menu-links">

                            <Link to="/home" onClick={closeMenu}>
                                خانه
                            </Link>

                            <Link to="/series" onClick={closeMenu}>
                                محصولات
                            </Link>

                            <Link to="#">کاتالوگ</Link>

                            <Link to="/about" onClick={closeMenu}>
                                درباره ما
                            </Link>

                            <Link to="#">تماس با ما</Link>

                            {isAuthenticated && user?.role === "admin" && (
                                <Link to="/admin" onClick={closeMenu}>
                                    پنل مدیریت
                                </Link>
                            )}

                            {isAuthenticated ? (
                                <Link to="/login" onClick={handleLogout}>
                                    خروج کاربر
                                </Link>
                            ) : (
                                <Link to="/login" onClick={closeMenu}>
                                    ورود کاربر
                                </Link>
                            )}

                        </div>
                    </aside>
                </>
            )}
        </>
    );
}

export default Navbar;