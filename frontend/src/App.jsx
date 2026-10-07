import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation
} from "react-router-dom";


import Navbar from "./components/Navbar.jsx";

import AdminRoute from "./components/AdminRoute.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails.jsx";
import AdminCustomers from "./pages/admin/AdminCustomers.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminSeries from "./pages/admin/AdminSeries.jsx";
import AdminSeriesProducts from "./pages/admin/AdminSeriesProducts.jsx";

import Home from "./pages/Home.jsx";
import SeriesPage from "./pages/SeriesPage.jsx";
import SeriesListPage from "./pages/SeriesListPage.jsx";
import About from "./pages/About.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Cart from "./pages/Cart.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";


function AppContent() {

    const location =
        useLocation();


    const isAdminRoute =
        location.pathname.startsWith("/admin");


    return (
        <>
            {!isAdminRoute && <Navbar />}


            <Routes>

                {/* =========================
                    Public Routes
                ========================= */}

                <Route
                    path="/cart"
                    element={<Cart />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/product/:id"
                    element={<ProductDetail />}
                />

                <Route
                    path="/home"
                    element={<Home />}
                />

                <Route
                    path="/series"
                    element={<SeriesListPage />}
                />

                <Route
                    path="/series/:seriesId"
                    element={<SeriesPage />}
                />

                <Route
                    path="/about"
                    element={<About />}
                />

                <Route
                    path="/payment/:orderId"
                    element={<PaymentPage />}
                />


                {/* =========================
                    Admin Routes
                ========================= */}

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >

                    <Route
                        index
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="orders/:orderId"
                        element={<AdminOrderDetails />}
                    />

                    <Route
                        path="orders"
                        element={<AdminOrders />}
                    />

                    <Route path="customers" element={<AdminCustomers />} />
                    <Route
                        path="series"
                        element={<AdminSeries />}
                    />
                    <Route
                        path="series/:id"
                        element={<AdminSeriesProducts />}
                    />
                </Route>


                {/* =========================
                    Default
                ========================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/home"
                            replace
                        />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/home"
                            replace
                        />
                    }
                />

            </Routes>
        </>
    );
}


function App() {

    return (
        <BrowserRouter>

            <AppContent />

        </BrowserRouter>
    );
}


export default App;