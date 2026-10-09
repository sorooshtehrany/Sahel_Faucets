const API_BASE_URL =
    "http://localhost:3000/api";


function getToken() {

    return localStorage.getItem("token");
}


function getAuthHeaders() {

    const token =
        getToken();

    return {
        "Content-Type": "application/json",
        Authorization:
            `Bearer ${token}`
    };
}


// =====================================================
// Get Pending Order
// =====================================================

export async function getPendingOrder() {

    const response =
        await fetch(
            `${API_BASE_URL}/orders/pending`,
            {
                method: "GET",
                headers:
                    getAuthHeaders()
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "خطا در دریافت سفارش در حال تکمیل"
        );
    }


    return data;
}

export async function cancelPendingOrder() {

    const response =
        await fetch(
            `${API_BASE_URL}/orders/pending/cancel`,
            {
                method: "POST",
                headers: getAuthHeaders()
            }
        );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "خطا در لغو سفارش نیمه‌کاره"
        );
    }

    return data;
}

export async function startPayment(orderId) {

    const response =
        await fetch(
            `${API_BASE_URL}/orders/${orderId}/payment/start`,
            {
                method: "POST",
                headers:
                    getAuthHeaders()
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "خطا در شروع پرداخت"
        );
    }


    return data;
}

export async function testPaymentSuccess(orderId) {

    const response =
        await fetch(
            `${API_BASE_URL}/orders/${orderId}/payment/test-success`,
            {
                method: "POST",
                headers: getAuthHeaders()
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "خطا در پرداخت آزمایشی"
        );
    }


    return data;
}

export async function testPaymentFailed(orderId) {

    const response =
        await fetch(
            `${API_BASE_URL}/orders/${orderId}/payment/test-failed`,
            {
                method: "POST",
                headers: getAuthHeaders()
            }
        );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "خطا در ثبت پرداخت ناموفق"
        );
    }

    return data;
}

// =====================================================
// Get My Orders
// =====================================================

export async function getMyOrders(filters = {}) {

    const params = new URLSearchParams();

    Object.entries(filters).forEach(
        ([key, value]) => {

            if (
                value !== undefined &&
                value !== null &&
                value !== ""
            ) {
                params.append(
                    key,
                    String(value)
                );
            }

        }
    );


    const queryString =
        params.toString();


    const response =
        await fetch(
            `${API_BASE_URL}/orders/history${
                queryString
                    ? `?${queryString}`
                    : ""
            }`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "خطا در دریافت سوابق خرید"
        );

    }


    return data;
}


// =====================================================
// Get My Order Details
// =====================================================

export async function getMyOrderById(orderId) {

    const response =
        await fetch(
            `${API_BASE_URL}/orders/history/${encodeURIComponent(orderId)}`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "خطا در دریافت جزئیات سفارش"
        );

    }


    return data;
}