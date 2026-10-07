
import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";


const API_BASE_URL =
    "http://localhost:3000/api";


function ForgotPassword() {

    const navigate = useNavigate();


    // =====================================================
    // State
    // =====================================================

    const [step, setStep] = useState(1);

    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [timeLeft, setTimeLeft] =
        useState(0);


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
    // Start Timer
    // =====================================================

    function startTimer() {

        setTimeLeft(5 * 60);

    }


    // =====================================================
    // OTP Countdown
    // =====================================================

    useEffect(() => {

        if (
            step !== 2 ||
            timeLeft <= 0
        ) {
            return;
        }


        const timer = setInterval(() => {

            setTimeLeft((previousTime) => {

                if (previousTime <= 1) {

                    clearInterval(timer);

                    return 0;
                }

                return previousTime - 1;

            });

        }, 1000);


        return () => {

            clearInterval(timer);

        };

    }, [
        step,
        timeLeft
    ]);


    // =====================================================
    // Step 1 - Request OTP
    // =====================================================

    async function handleRequestCode(event) {

        if (event) {

            event.preventDefault();

        }


        setError("");
        setSuccess("");


        if (!phone) {

            setError(
                "لطفاً شماره موبایل را وارد کنید."
            );

            return;

        }


        try {

            setLoading(true);


            const response = await fetch(
                `${API_BASE_URL}/auth/forgot-password`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        phone
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "خطا در ارسال کد بازیابی."
                );

            }


            setSuccess(
                "کد بازیابی ارسال شد."
            );


            setStep(2);

            startTimer();

        }
        catch (error) {

            setError(
                error.message ||
                "خطایی رخ داد."
            );

        }
        finally {

            setLoading(false);

        }

    }


    // =====================================================
    // Step 2 - Verify OTP
    // =====================================================

    async function handleVerifyCode(event) {

        event.preventDefault();


        setError("");
        setSuccess("");


        if (!code) {

            setError(
                "لطفاً کد بازیابی را وارد کنید."
            );

            return;

        }


        try {

            setLoading(true);


            const response = await fetch(
                `${API_BASE_URL}/auth/verify-reset-code`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        phone,
                        code
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "کد بازیابی نامعتبر است."
                );

            }


            setSuccess(
                "کد صحیح است."
            );


            setStep(3);

        }
        catch (error) {

            setError(
                error.message ||
                "خطایی رخ داد."
            );

        }
        finally {

            setLoading(false);

        }

    }


    // =====================================================
    // Step 3 - Reset Password
    // =====================================================

    async function handleResetPassword(event) {

        event.preventDefault();


        setError("");
        setSuccess("");


        if (
            !newPassword ||
            !confirmPassword
        ) {

            setError(
                "لطفاً رمز عبور جدید را وارد کنید."
            );

            return;

        }


        if (
            newPassword.length < 6
        ) {

            setError(
                "رمز عبور باید حداقل ۶ کاراکتر باشد."
            );

            return;

        }


        if (
            newPassword !==
            confirmPassword
        ) {

            setError(
                "رمز عبور و تکرار آن یکسان نیستند."
            );

            return;

        }


        try {

            setLoading(true);


            const response = await fetch(
                `${API_BASE_URL}/auth/reset-password`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        phone,

                        code,

                        new_password:
                            newPassword

                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "خطا در تغییر رمز عبور."
                );

            }


            setSuccess(
                "رمز عبور با موفقیت تغییر کرد."
            );


            setTimeout(() => {

                navigate("/login");

            }, 1200);

        }
        catch (error) {

            setError(
                error.message ||
                "خطایی رخ داد."
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

        <div className="login-page">

            <div className="login-box">

                <h1>
                    بازیابی رمز عبور
                </h1>


                {/* =====================================
                    Step 1
                ===================================== */}

                {step === 1 && (

                    <form
                        onSubmit={
                            handleRequestCode
                        }
                    >

                        <div className="form-group">

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
                            />

                        </div>


                        {error && (

                            <div className="login-error">

                                {error}

                            </div>

                        )}


                        {success && (

                            <div className="login-success">

                                {success}

                            </div>

                        )}


                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "در حال ارسال..."
                                : "دریافت کد بازیابی"
                            }

                        </button>

                    </form>

                )}


                {/* =====================================
                    Step 2
                ===================================== */}

                {step === 2 && (

                    <>

                        <form
                            onSubmit={
                                handleVerifyCode
                            }
                        >

                            <div className="form-group">

                                <label>
                                    کد بازیابی
                                </label>


                                <input
                                    type="text"
                                    value={code}
                                    onChange={(event) =>
                                        setCode(
                                            event.target.value
                                        )
                                    }
                                    placeholder="کد ۶ رقمی"
                                    maxLength={6}
                                    dir="ltr"
                                />

                            </div>


                            <div className="otp-timer">

                                {timeLeft > 0

                                    ? `اعتبار کد: ${formatTime(
                                        timeLeft
                                    )}`

                                    : "کد منقضی شده است."

                                }

                            </div>


                            {error && (

                                <div className="login-error">

                                    {error}

                                </div>

                            )}


                            {success && (

                                <div className="login-success">

                                    {success}

                                </div>

                            )}


                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    timeLeft === 0
                                }
                            >

                                {loading
                                    ? "در حال بررسی..."
                                    : "تأیید کد"
                                }

                            </button>

                        </form>


                        <button
                            type="button"
                            className="otp-resend-button"
                            disabled={
                                timeLeft > 0 ||
                                loading
                            }
                            onClick={
                                handleRequestCode
                            }
                        >

                            ارسال مجدد کد

                        </button>

                    </>

                )}


                {/* =====================================
                    Step 3
                ===================================== */}

                {step === 3 && (

                    <form
                        onSubmit={
                            handleResetPassword
                        }
                    >

                        <div className="form-group">

                            <label>
                                رمز عبور جدید
                            </label>


                            <input
                                type="password"
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="حداقل ۶ کاراکتر"
                                dir="ltr"
                            />

                        </div>


                        <div className="form-group">

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
                            />

                        </div>


                        {error && (

                            <div className="login-error">

                                {error}

                            </div>

                        )}


                        {success && (

                            <div className="login-success">

                                {success}

                            </div>

                        )}


                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "در حال تغییر..."
                                : "تغییر رمز عبور"
                            }

                        </button>

                    </form>

                )}


                {/* =====================================
                    Back To Login
                ===================================== */}

                <button
                    type="button"
                    className="login-register-button"
                    onClick={() =>
                        navigate("/login")
                    }
                >

                    بازگشت به ورود

                </button>

            </div>

        </div>

    );

}


export default ForgotPassword;

