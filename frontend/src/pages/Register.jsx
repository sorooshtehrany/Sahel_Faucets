import React, { useState } from "react";

import {
    useNavigate
} from "react-router-dom";

import "../styles/register.css";


const API_BASE_URL = "http://localhost:3000/api";


function Register() {

    const navigate = useNavigate();


    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (
            !firstName ||
            !lastName ||
            !phone ||
            !password ||
            !confirmPassword
        ) {

            setError(
                "لطفاً تمام فیلدها را پر کنید."
            );

            return;
        }


        if (password.length < 6) {

            setError(
                "رمز عبور باید حداقل ۶ کاراکتر باشد."
            );

            return;
        }


        if (password !== confirmPassword) {

            setError(
                "رمز عبور و تکرار آن یکسان نیستند."
            );

            return;
        }


        try {

            setLoading(true);


            const response = await fetch(
                `${API_BASE_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        phone: phone,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "خطا در ثبت‌نام."
                );

            }


            console.log(
                "Registration successful:",
                data
            );


            setSuccess(
                "ثبت‌نام با موفقیت انجام شد."
            );


            setTimeout(() => {

                navigate("/login");

            }, 1200);

        }
        catch (error) {

            setError(
                error.message ||
                "خطایی در ثبت‌نام رخ داد."
            );

        }
        finally {

            setLoading(false);

        }
    }


    return (
        <div className="register-page">

            <div className="register-box">

                <h1>
                    ایجاد حساب کاربری
                </h1>


                <form onSubmit={handleSubmit}>


                    {/* =========================
                        First Name
                    ========================= */}

                    <div className="register-form-group">

                        <label>
                            نام
                        </label>

                        <input
                            type="text"
                            value={firstName}
                            onChange={(event) =>
                                setFirstName(
                                    event.target.value
                                )
                            }
                            placeholder="نام"
                            autoComplete="given-name"
                        />

                    </div>


                    {/* =========================
                        Last Name
                    ========================= */}

                    <div className="register-form-group">

                        <label>
                            نام خانوادگی
                        </label>

                        <input
                            type="text"
                            value={lastName}
                            onChange={(event) =>
                                setLastName(
                                    event.target.value
                                )
                            }
                            placeholder="نام خانوادگی"
                            autoComplete="family-name"
                        />

                    </div>


                    {/* =========================
                        Phone
                    ========================= */}

                    <div className="register-form-group">

                        <label>
                            شماره موبایل
                        </label>

                        <input
                            type="text"
                            value={phone}
                            onChange={(event) =>
                                setPhone(
                                    event.target.value
                                )
                            }
                            placeholder="09123456789"
                            dir="ltr"
                            inputMode="numeric"
                            autoComplete="tel"
                        />

                    </div>


                    {/* =========================
                        Password
                    ========================= */}

                    <div className="register-form-group">

                        <label>
                            رمز عبور
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="حداقل ۶ کاراکتر"
                            dir="ltr"
                            autoComplete="new-password"
                        />

                    </div>


                    {/* =========================
                        Confirm Password
                    ========================= */}

                    <div className="register-form-group">

                        <label>
                            تکرار رمز عبور
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }
                            placeholder="تکرار رمز عبور"
                            dir="ltr"
                            autoComplete="new-password"
                        />

                    </div>


                    {/* =========================
                        Error
                    ========================= */}

                    {error && (

                        <div className="register-error">
                            {error}
                        </div>

                    )}


                    {/* =========================
                        Success
                    ========================= */}

                    {success && (

                        <div className="register-success">
                            {success}
                        </div>

                    )}


                    {/* =========================
                        Submit
                    ========================= */}

                    <button
                        type="submit"
                        className="register-submit-button"
                        disabled={loading}
                    >

                        {loading
                            ? "در حال ثبت‌نام..."
                            : "ثبت‌نام"
                        }

                    </button>

                </form>


                {/* =========================
                    Login
                ========================= */}

                <button
                    type="button"
                    className="register-login-button"
                    onClick={() => navigate("/login")}
                >
                    قبلاً حساب دارید؟ ورود
                </button>

            </div>

        </div>
    );
}


export default Register;