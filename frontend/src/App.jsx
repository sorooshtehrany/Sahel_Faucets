import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";

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




function App() {

    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route path="/cart" element={<Cart />} />
                <Route path="/forgot-password" element={<ForgotPassword />}/>  
                <Route path="/register" element={<Register />}/>
                <Route path="/login" element={<Login />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/home" element={<Home />} />
                <Route path="/series" element={<SeriesListPage />} />
                <Route path="/series/:seriesId" element={<SeriesPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/payment/:orderId" element={<PaymentPage />}/>
                <Route path="/" element={ <Navigate to="/home" replace /> } />
                <Route path="*" element={ <Navigate to="/home" replace /> } />
            </Routes>

        </BrowserRouter>
    );
}

export default App;