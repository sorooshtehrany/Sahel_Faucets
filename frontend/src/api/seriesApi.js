
const API_BASE_URL = "http://localhost:3000/api";


/* =========================
   Get all series
========================= */

export async function getAllSeries() {

    const response = await fetch(
        `${API_BASE_URL}/series`
    );


    if (!response.ok) {

        throw new Error(
            "خطا در دریافت لیست سری‌ها"
        );

    }


    return await response.json();
}


/* =========================
   Get one series
========================= */

export async function getSeriesById(id) {

    const response = await fetch(
        `${API_BASE_URL}/series/${id}`
    );


    if (!response.ok) {

        throw new Error(
            "خطا در دریافت اطلاعات سری"
        );

    }


    return await response.json();
}

