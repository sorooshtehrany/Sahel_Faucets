const API_BASE_URL =
    "http://localhost:3000/api";


// =========================
// Get token
// =========================

function getToken() {

    return localStorage.getItem("token");

}


// =========================
// Get all series
// =========================

export async function getAdminSeries() {

    const token =
        getToken();


    const response =
        await fetch(
            `${API_BASE_URL}/admin/series`,
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "خطا در دریافت سری‌ها"
        );

    }


    return data;
}


// =========================
// Get one series
// =========================

export async function getAdminSeriesById(id) {

    const token =
        getToken();


    const response =
        await fetch(
            `${API_BASE_URL}/admin/series/${id}`,
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "خطا در دریافت اطلاعات سری"
        );

    }


    return data;
}


// =========================
// Create series
// =========================

export async function createAdminSeries(seriesData) {

    const token =
        getToken();


    const response =
        await fetch(
            `${API_BASE_URL}/admin/series`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        seriesData
                    )
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "خطا در ایجاد سری"
        );

    }


    return data;
}


// =========================
// Update series
// =========================

export async function updateAdminSeries(
    id,
    seriesData
) {

    const token =
        getToken();


    const response =
        await fetch(
            `${API_BASE_URL}/admin/series/${id}`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body:
                    JSON.stringify(
                        seriesData
                    )
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "خطا در به‌روزرسانی سری"
        );

    }


    return data;
}


// =========================
// Delete series
// =========================

export async function deleteAdminSeries(id) {

    const token =
        getToken();


    const response =
        await fetch(
            `${API_BASE_URL}/admin/series/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "خطا در حذف سری"
        );

    }


    return data;
}