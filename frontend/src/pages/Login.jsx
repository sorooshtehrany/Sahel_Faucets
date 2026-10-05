
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {

    const {
        login
    } = useAuth();

    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(event) {

        event.preventDefault();

        setError("");

        if (!phone || !password) {

            setError(
                "لطفاً شماره موبایل و رمز عبور را وارد کنید."
            );

            return;
        }

        try {

            setLoading(true);

            await login(
                phone,
                password
            );

            console.log("Login successful");

            navigate("/home");

        }
        catch (error) {

            setError(
                error.message ||
                "خطا در ورود به حساب کاربری."
            );

        }
        finally {

            setLoading(false);

        }
    }


    return (
        <div className="login-page">

            <div className="login-box">

                <h1>
                    ورود
                </h1>


                <form onSubmit={handleSubmit}>

                    
                    <div className="form-group">

                        <label>
                            شماره موبایل
                        </label>

                        <input
                            type="text"
                            value={phone}
                            onChange={(event) =>
                                setPhone(event.target.value)
                            }
                            placeholder="09123456789"
                            dir="ltr"
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            رمز عبور
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="رمز عبور"
                            dir="ltr"
                        />

                    </div>


                    {error && (

                        <div className="login-error">
                            {error}
                        </div>

                    )}


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "در حال ورود..."
                            : "ورود"
                        }
                    </button>

                    <button 
                        type="button" 
                        className="login-forgot-button" 
                        onClick={() => navigate("/forgot-password")} 
                        > 
                        رمز عبور را فراموش کرده‌اید؟ 
                    </button>

                    <button
                        type="button"
                        className="login-register-button"
                        onClick={() => navigate("/register")}
                    >
                        حساب کاربری ندارید؟ ثبت‌نام کنید
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;

