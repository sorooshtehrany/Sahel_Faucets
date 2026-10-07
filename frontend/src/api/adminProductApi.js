const API_BASE_URL =
    "http://localhost:3000/api";


function getToken() {

    return localStorage.getItem("token");
}


export async function createAdminProduct(
    seriesId,
    productData
) {

    const token =
        getToken();

    const response =
        await fetch(
            `${API_BASE_URL}/admin/series/${seriesId}/products`,
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
                        productData
                    )
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "خطا در ایجاد محصول"
        );
    }


    return data;
}

export async function updateAdminProduct(
    id,
    productData
) {

    const token =
        getToken();

    const response =
        await fetch(
            `${API_BASE_URL}/admin/products/${id}`,
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
                        productData
                    )
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "خطا در به‌روزرسانی محصول"
        );
    }


    return data;
}

export async function deleteAdminProduct(id) {

    const token =
        getToken();

    const response =
        await fetch(
            `${API_BASE_URL}/admin/products/${id}`,
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
            "خطا در حذف محصول"
        );
    }


    return data;
}