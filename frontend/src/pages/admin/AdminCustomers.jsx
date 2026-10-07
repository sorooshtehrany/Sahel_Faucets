
import {
    useEffect,
    useState
} from "react";

import "./AdminCustomers.css";


const API_BASE_URL =
    "http://localhost:3000/api";


function AdminCustomers() {

    const [customers, setCustomers] =
        useState([]);

    const [pagination, setPagination] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const limit = 10;


    async function loadCustomers() {

        try {

            setLoading(true);

            setError("");


            const token =
                localStorage.getItem("token");


            const params =
                new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString()
                });


            if (search.trim()) {

                params.append(
                    "search",
                    search.trim()
                );
            }


            const response =
                await fetch(
                    `${API_BASE_URL}/admin/customers?${params.toString()}`,
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
                    "خطا در دریافت مشتریان"
                );
            }


            setCustomers(
                data.data || []
            );


            setPagination(
                data.pagination || null
            );

        }
        catch (error) {

            console.error(
                "Admin customers error:",
                error
            );


            setError(
                error.message ||
                "خطایی در دریافت مشتریان رخ داد."
            );

        }
        finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        loadCustomers();

    }, [page, search]);


    function handleSearchChange(event) {

        setSearch(
            event.target.value
        );

        setPage(1);
    }


    function formatDate(date) {

        if (!date) {
            return "-";
        }


        return new Date(date)
            .toLocaleString("fa-IR");
    }


    return (

        <div
            className="admin-customers"
            dir="rtl"
        >

            <div className="admin-page-header">

                <div>

                    <h2>
                        مشتریان
                    </h2>

                    <p>
                        مدیریت و مشاهده مشتریان فروشگاه
                    </p>

                </div>


                <div className="admin-customer-search">

                    <input
                        type="text"
                        value={search}
                        onChange={
                            handleSearchChange
                        }
                        placeholder="جستجو نام، نام خانوادگی یا موبایل..."
                    />

                </div>

            </div>


            {error && (

                <div className="admin-error">

                    {error}

                </div>

            )}


            <div className="admin-customers-summary">

                <span>
                    تعداد کل مشتریان:
                </span>

                <strong>
                    {pagination?.total ?? 0}
                </strong>

            </div>


            <div className="admin-table-card">

                {loading ? (

                    <div className="admin-table-loading">

                        در حال دریافت مشتریان...

                    </div>

                ) : customers.length === 0 ? (

                    <div className="admin-empty">

                        مشتری‌ای پیدا نشد.

                    </div>

                ) : (

                    <div className="admin-table-wrapper">

                        <table className="admin-table">

                            <thead>

                                <tr>

                                    <th>
                                        شماره
                                    </th>

                                    <th>
                                        نام مشتری
                                    </th>

                                    <th>
                                        شماره موبایل
                                    </th>

                                    <th>
                                        تاریخ عضویت
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {customers.map(
                                    (customer) => (

                                        <tr
                                            key={
                                                customer.id
                                            }
                                        >

                                            <td>
                                                #{customer.id}
                                            </td>


                                            <td>

                                                <div className="customer-cell">

                                                    <strong>

                                                        {customer.first_name}{" "}

                                                        {customer.last_name}

                                                    </strong>

                                                </div>

                                            </td>


                                            <td>

                                                <span className="customer-phone">

                                                    {customer.phone}

                                                </span>

                                            </td>


                                            <td>

                                                {formatDate(
                                                    customer.created_at
                                                )}

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {pagination &&
                pagination.totalPages > 1 && (

                    <div className="admin-pagination">

                        <button
                            disabled={
                                page <= 1
                            }
                            onClick={() =>
                                setPage(
                                    page - 1
                                )
                            }
                        >
                            قبلی
                        </button>


                        <span>

                            صفحه{" "}

                            <strong>
                                {pagination.page}
                            </strong>

                            {" "}از{" "}

                            <strong>
                                {pagination.totalPages}
                            </strong>

                        </span>


                        <button
                            disabled={
                                page >=
                                pagination.totalPages
                            }
                            onClick={() =>
                                setPage(
                                    page + 1
                                )
                            }
                        >
                            بعدی
                        </button>

                    </div>

                )}

        </div>
    );
}


export default AdminCustomers;


