import {
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../../context/AuthContext";

import "./AdminLayout.css";


function AdminLayout() {

    const {
        user,
        logout
    } = useAuth();

    const navigate =
        useNavigate();


    function handleLogout() {

        logout();

        navigate("/login");
    }


    return (

        <div
            className="admin-layout"
            dir="rtl"
        >

            {/* =========================
                Sidebar
            ========================= */}

            <aside className="admin-sidebar">

                <div className="admin-sidebar-header">

                    <div className="admin-logo">
                        مدیریت
                    </div>

                    <div className="admin-user">

                        <span>
                            مدیر سیستم
                        </span>

                        <small>
                            {user?.first_name} {user?.last_name}
                        </small>

                    </div>

                </div>


                <nav className="admin-navigation">

                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        <span>▣</span>
                        داشبورد
                    </NavLink>


                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        <span>◫</span>
                        سفارش‌ها
                    </NavLink>


                    <NavLink
                        to="/admin/customers"
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        <span>♙</span>
                        مشتریان
                    </NavLink>


                    <NavLink
                        to="/admin/series"
                        className={({ isActive }) =>
                            isActive
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        <span>□</span>
                        محصولات
                    </NavLink>

                </nav>


                <div className="admin-sidebar-footer">

                    <button
                        className="admin-back-button"
                        onClick={() =>
                            navigate("/home")
                        }
                    >
                        ← بازگشت به سایت
                    </button>


                    <button
                        className="admin-logout-button"
                        onClick={handleLogout}
                    >
                        خروج از حساب
                    </button>

                </div>

            </aside>


            {/* =========================
                Main Content
            ========================= */}

            <main className="admin-main">

                <header className="admin-topbar">

                    <div>

                        <h1>
                            پنل مدیریت
                        </h1>

                        <p>
                            مدیریت فروشگاه و سفارش‌ها
                        </p>

                    </div>

                </header>


                <section className="admin-content">

                    <Outlet />

                </section>

            </main>

        </div>
    );
}


export default AdminLayout;