const API_BASE_URL = "http://localhost:3000/api";

function getToken() {
    return localStorage.getItem("token");
}

function getAuthHeaders() {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
}


// دریافت سبد خرید
export async function getCart() {
    const response = await fetch(
        `${API_BASE_URL}/cart`,
        {
            method: "GET",
            headers: getAuthHeaders()
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "خطا در دریافت سبد خرید"
        );
    }

    return data;
}


// اضافه کردن محصول
export async function addToCart(
    productId,
    quantity = 1
) {
    const response = await fetch(
        `${API_BASE_URL}/cart/items`,
        {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                product_id: productId,
                quantity: quantity
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "خطا در افزودن محصول به سبد خرید"
        );
    }

    return data;
}


// تغییر تعداد محصول
export async function updateCartItem(
    productId,
    quantity
) {
    const response = await fetch(
        `${API_BASE_URL}/cart/items/${productId}`,
        {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                quantity: quantity
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "خطا در تغییر تعداد محصول"
        );
    }

    return data;
}


// حذف یک محصول
export async function removeCartItem(
    productId
) {
    const response = await fetch(
        `${API_BASE_URL}/cart/items/${productId}`,
        {
            method: "DELETE",
            headers: getAuthHeaders()
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "خطا در حذف محصول"
        );
    }
    else 
    {
        window.dispatchEvent(new Event("cartUpdated"));
    }

    return data;
}


// خالی کردن کل سبد
export async function clearCart() {
    const response = await fetch(
        `${API_BASE_URL}/cart`,
        {
            method: "DELETE",
            headers: getAuthHeaders()
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "خطا در خالی کردن سبد خرید"
        );
    }
    else
    {
        window.dispatchEvent(new Event("cartUpdated"));
    }

    return data;
}


// ایجاد سفارش از روی سبد خرید
export async function createOrder(
    deliveryAddress
) {

    const response = await fetch(
        `${API_BASE_URL}/orders`,
        {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                delivery_address: deliveryAddress
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "خطا در ایجاد سفارش"
        );
    }

    return data;
}