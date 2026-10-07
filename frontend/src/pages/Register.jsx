
import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import "../styles/register.css";


const API_BASE_URL =
    "http://localhost:3000/api";


function Register() {

    const navigate = useNavigate();


    // =====================================================
    // Step
    // =====================================================

    const [step, setStep] =
        useState(1);


    // =====================================================
    // Registration State
    // =====================================================

    const [firstName, setFirstName] =
        useState("");

    const [lastName, setLastName] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");


    // =====================================================
    // OTP State
    // =====================================================

    const [code, setCode] =
        useState("");

    const [timeLeft, setTimeLeft] =
        useState(0);


    const [verificationSuccess, setVerificationSuccess] =
        useState(false);
    // =====================================================
    // General State
    // =====================================================

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // =====================================================
    // Format Timer
    // =====================================================

    function formatTime(seconds) {

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            seconds % 60;


        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;

    }


    // =====================================================
    // Start OTP Timer
    // =====================================================

    function startTimer() {

        setTimeLeft(5 * 60);

    }


    // =====================================================
    // OTP Countdown
    // =====================================================

    useEffect(() => {

        if (step !== 2) {
            return;
        }


        const timer =
            setInterval(() => {

                setTimeLeft(
                    (previousTime) => {

                        if (previousTime <= 1) {
                            return 0;
                        }

                        return previousTime - 1;

                    }
                );

            }, 1000);


        return () => {

            clearInterval(timer);

        };

    }, [step]);


    // =====================================================
    // Step 1 - Register
    // =====================================================

    async function handleSubmit(event) {

        event.preventDefault();


        setError("");
        setSuccess("");


        // -------------------------
        // Validate fields
        // -------------------------

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


        // -------------------------
        // Validate password
        // -------------------------

        if (
            password.length < 6
        ) {

            setError(
                "رمز عبور باید حداقل ۶ کاراکتر باشد."
            );

            return;

        }


        // -------------------------
        // Confirm password
        // -------------------------

        if (
            password !==
            confirmPassword
        ) {

            setError(
                "رمز عبور و تکرار آن یکسان نیستند."
            );

            return;

        }


        try {

            setLoading(true);


            // -------------------------
            // Register request
            // -------------------------

            const response =
                await fetch(
                    `${API_BASE_URL}/auth/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            first_name:
                                firstName,

                            last_name:
                                lastName,

                            phone:
                                phone,

                            password:
                                password

                        })
                    }
                );


            const data =
                await response.json();


            // -------------------------
            // Handle error
            // -------------------------

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


            // -------------------------
            // Registration successful
            // -------------------------

            setSuccess(
                "ثبت‌نام انجام شد. کد تأیید برای شما ارسال شده است."
            );

            setCode("");
            setVerificationSuccess(false);

            setStep(2);

            startTimer();

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


    // =====================================================
    // Step 2 - Verify Registration OTP
    // =====================================================

    async function handleVerifyCode(event) {

        event.preventDefault();


        setError("");
        setSuccess("");


        // -------------------------
        // Validate code
        // -------------------------

        if (!code) {

            setError(
                "لطفاً کد تأیید را وارد کنید."
            );

            return;

        }


        if (code.length !== 6) {

            setError(
                "کد تأیید باید ۶ رقمی باشد."
            );

            return;

        }


        // -------------------------
        // Check expiration
        // -------------------------

        try {

            setLoading(true);


            // -------------------------
            // Verify request
            // -------------------------

            const response =
                await fetch(
                    `${API_BASE_URL}/auth/verify-register-code`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            phone:
                                phone,

                            code:
                                code

                        })
                    }
                );


            const data =
                await response.json();


            // -------------------------
            // Handle error
            // -------------------------

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "کد تأیید نامعتبر است."
                );

            }


            console.log(
                "Registration verification successful:",
                data
            );


            // -------------------------
            // Success
            // -------------------------

            setSuccess(
                "شماره موبایل با موفقیت تأیید شد."
            );

            setVerificationSuccess(true);

            setTimeLeft(0);


            // -------------------------
            // Go to Login
            // -------------------------

            setTimeout(() => {

                navigate("/login");

            }, 1200);

        }
        catch (error) {

            setError(
                error.message ||
                "خطایی در تأیید شماره موبایل رخ داد."
            );

        }
        finally {

            setLoading(false);

        }

    }


    // =====================================================
    // Step 2 - Resend OTP
    // =====================================================

    async function handleResendCode() {

        setError("");
        setSuccess("");


        try {

            setLoading(true);


            // -------------------------
            // Register again
            // -------------------------
            // Backend register flow
            // creates a new registration OTP.

            const response =
                await fetch(
                    `${API_BASE_URL}/auth/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            first_name:
                                firstName,

                            last_name:
                                lastName,

                            phone:
                                phone,

                            password:
                                password

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "خطا در ارسال مجدد کد."
                );

            }


            setCode("");
            setVerificationSuccess(false);
            setSuccess(
                "کد تأیید جدید ارسال شد."
            );
            startTimer();

        }
        catch (error) {

            setError(
                error.message ||
                "خطایی در ارسال مجدد کد رخ داد."
            );

        }
        finally {

            setLoading(false);

        }

    }


    // =====================================================
    // Render
    // =====================================================

    return (

        <div className="register-page">

            <div className="register-box">

                <h1>
                    ایجاد حساب کاربری
                </h1>


                {/* =================================================
                    STEP 1
                ================================================= */}

                {step === 1 && (

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >


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
                                value={
                                    confirmPassword
                                }
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

                )}


                {/* =================================================
                    STEP 2 - OTP
                ================================================= */}

                {step === 2 && (

                    <>

                        <div className="register-otp-message">

                            کد تأیید به شماره

                            <strong>
                                {" "}
                                {phone}
                                {" "}
                            </strong>

                            ارسال شد.

                        </div>


                        <form
                            onSubmit={
                                handleVerifyCode
                            }
                        >


                            {/* =========================
                                OTP
                            ========================= */}

                            <div className="register-form-group">

                                <label>
                                    کد تأیید
                                </label>

                                <input
                                    type="text"
                                    value={code}
                                    onChange={(event) => {

                                        const value =
                                            event.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 6);

                                        setCode(value);

                                    }}
                                    placeholder="کد ۶ رقمی"
                                    maxLength={6}
                                    dir="ltr"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                />

                            </div>


                            {/* =========================
                                Timer
                            ========================= */}

                            <div className="register-otp-timer">

                                {verificationSuccess

                                    ? "کد با موفقیت تأیید شد."

                                    : timeLeft > 0

                                        ? `اعتبار کد: ${formatTime(
                                            timeLeft
                                        )}`

                                        : "کد منقضی شده است."

                                }

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
                                Verify
                            ========================= */}

                            <button
                                type="submit"
                                className="register-submit-button"
                                disabled={loading}

                            >

                                {loading

                                    ? "در حال بررسی..."

                                    : "تأیید شماره موبایل"

                                }

                            </button>

                        </form>


                        {/* =========================
                            Resend
                        ========================= */}

                        <button
                            type="button"
                            className="register-login-button"
                            disabled={
                                timeLeft > 0 ||
                                loading
                            }
                            onClick={
                                handleResendCode
                            }
                        >

                            {loading

                                ? "در حال ارسال..."

                                : "ارسال مجدد کد"

                            }

                        </button>

                    </>

                )}


                {/* =================================================
                    Login
                ================================================= */}

                <button
                    type="button"
                    className="register-login-button"
                    onClick={() =>
                        navigate("/login")
                    }
                    disabled={loading}
                >

                    قبلاً حساب دارید؟ ورود

                </button>

            </div>

        </div>

    );

}


export default Register;

