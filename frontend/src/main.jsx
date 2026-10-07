import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/global.css";
import "./styles/home.css";
import "./styles/series.css";
import "./styles/products.css";
import "./styles/navigation.css";
import "./styles/navbar.css";
import "./styles/menu.css";
import "./styles/animations.css";
import "./styles/about.css";
import "./styles/product-detail.css";
import "./styles/login.css";
import "./styles/cart.css";
import "./styles/register.css";
import "./styles/payment.css";

import {
    AuthProvider
} from "./context/AuthContext";


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>

            <App />

        </AuthProvider>
    </React.StrictMode>
);