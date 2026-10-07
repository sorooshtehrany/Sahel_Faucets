import {
    useEffect,
    useState
} from "react";
import {
    useNavigate
} from "react-router-dom";

import {
    getAdminSeries,
    getAdminSeriesById,
    createAdminSeries,
    updateAdminSeries,
    deleteAdminSeries
} from "../../api/adminSeriesApi";

import "./AdminSeries.css";




function AdminSeries() {

    const navigate = useNavigate();

    const [series, setSeries] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [creating, setCreating] =
        useState(false);

    const [createError, setCreateError] =
        useState("");

    const [formData, setFormData] =
        useState({
            name_fa: "",
            finish_fa: "",
            folder_name: "",
            color_code: "#ffffff",
            name_en: "",
            finish_en: ""
        });

    const [editingSeriesId, setEditingSeriesId] =
        useState(null);

    const [loadingSeriesId, setLoadingSeriesId] =
        useState(null);

    async function loadSeries() {

        try {

            setLoading(true);
            setError("");

            const response =
                await getAdminSeries();

            setSeries(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Admin series error:",
                error
            );

            setError(
                error.message ||
                "خطا در دریافت سری‌ها"
            );

        } finally {

            setLoading(false);
        }
    }


    function handleFormChange(event) {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    }


    async function handleCreateSeries(event) {

        event.preventDefault();

        try {

            setCreating(true);
            setCreateError("");

            if (editingSeriesId !== null) {

                await updateAdminSeries(
                    editingSeriesId,
                    formData
                );

            } else {

                await createAdminSeries(
                    formData
                );
            }

            setFormData({
                name_fa: "",
                finish_fa: "",
                folder_name: "",
                color_code: "#ffffff",
                name_en: "",
                finish_en: ""
            });

            setEditingSeriesId(null);
            setShowCreateForm(false);

            await loadSeries();

        } catch (error) {

            console.error(
                editingSeriesId !== null
                    ? "Update series error:"
                    : "Create series error:",
                error
            );

            setCreateError(
                error.message ||
                (
                    editingSeriesId !== null
                        ? "خطا در به‌روزرسانی سری"
                        : "خطا در ایجاد سری"
                )
            );

        } finally {

            setCreating(false);
        }
    }

    async function handleEditSeries(id) {

        try {

            setLoadingSeriesId(id);
            setCreateError("");

            const response =
                await getAdminSeriesById(id);

            const item =
                response;

            setFormData({
                name_fa: item.name_fa || "",
                finish_fa: item.finish_fa || "",
                folder_name: item.folder_name || "",
                color_code: item.color_code || "#ffffff",
                name_en: item.name_en || "",
                finish_en: item.finish_en || ""
            });

            setEditingSeriesId(id);
            setShowCreateForm(true);

        } catch (error) {

            console.error(
                "Load series for edit error:",
                error
            );

            setCreateError(
                error.message ||
                "خطا در دریافت اطلاعات سری"
            );

        } finally {

            setLoadingSeriesId(null);
        }
    }

    async function handleDeleteSeries(id) {

        const confirmed =
            window.confirm(
                "آیا از حذف این سری مطمئن هستید؟"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteAdminSeries(id);

            await loadSeries();

        } catch (error) {

            console.error(
                "Delete series error:",
                error
            );

            alert(
                error.message ||
                "خطا در حذف سری"
            );
        }
    }

    useEffect(() => {

        loadSeries();

    }, []);


    if (loading) {

        return (
            <div className="admin-series-page">

                <div className="admin-series-loading">
                    در حال دریافت سری‌ها...
                </div>

            </div>
        );
    }


    if (error) {

        return (
            <div className="admin-series-page">

                <div className="admin-series-error">
                    {error}
                </div>

            </div>
        );
    }


    return (

        <div className="admin-series-page">

            <div className="admin-page-header">

                <div>

                    <h2>
                        مدیریت سری‌ها
                    </h2>

                    <p>
                        مدیریت مجموعه‌ها و محصولات هر سری
                    </p>

                </div>

                <button
                    className="admin-primary-button"
                    type="button"
                    onClick={() => {
                        setCreateError("");
                        setShowCreateForm(true);
                    }}
                >
                    + افزودن سری
                </button>

            </div>

            {showCreateForm && (

                <form
                    className="admin-series-form"
                    onSubmit={handleCreateSeries}
                >

                    <div className="admin-series-form-header">

                        <div>
                            <h3>
                                {editingSeriesId !== null
                                    ? "ویرایش سری"
                                    : "افزودن سری جدید"}
                            </h3>

                            <p>
                                {editingSeriesId !== null
                                    ? "اطلاعات سری را ویرایش کنید."
                                    : "اطلاعات سری جدید را وارد کنید."}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="admin-form-close"
                            onClick={() => {
                                setShowCreateForm(false);
                                setCreateError("");
                                setEditingSeriesId(null);
                            }}
                        >
                            ×
                        </button>

                    </div>


                    {createError && (

                        <div className="admin-series-form-error">
                            {createError}
                        </div>

                    )}


                    <div className="admin-series-form-grid">

                        <div className="admin-form-field">

                            <label>
                                نام فارسی *
                            </label>

                            <input
                                type="text"
                                name="name_fa"
                                value={formData.name_fa}
                                onChange={handleFormChange}
                                required
                            />

                        </div>


                        <div className="admin-form-field">

                            <label>
                                نام انگلیسی
                            </label>

                            <input
                                type="text"
                                name="name_en"
                                value={formData.name_en}
                                onChange={handleFormChange}
                            />

                        </div>


                        <div className="admin-form-field">

                            <label>
                                نوع پرداخت فارسی
                            </label>

                            <input
                                type="text"
                                name="finish_fa"
                                value={formData.finish_fa}
                                onChange={handleFormChange}
                            />

                        </div>


                        <div className="admin-form-field">

                            <label>
                                نوع پرداخت انگلیسی
                            </label>

                            <input
                                type="text"
                                name="finish_en"
                                value={formData.finish_en}
                                onChange={handleFormChange}
                            />

                        </div>


                        <div className="admin-form-field">

                            <label>
                                نام پوشه *
                            </label>

                            <input
                                type="text"
                                name="folder_name"
                                value={formData.folder_name}
                                onChange={handleFormChange}
                                required
                            />

                        </div>


                        <div className="admin-form-field">

                            <label>
                                رنگ
                            </label>

                            <div className="admin-color-field">

                                <input
                                    type="color"
                                    name="color_code"
                                    value={formData.color_code}
                                    onChange={handleFormChange}
                                />

                                <span>
                                    {formData.color_code}
                                </span>

                            </div>

                        </div>

                    </div>


                    <div className="admin-series-form-actions">

                        <button
                            type="button"
                            className="admin-form-cancel"
                            onClick={() => {
                                setShowCreateForm(false);
                                setCreateError("");
                                setEditingSeriesId(null);
                            }}
                            disabled={creating}
                        >
                            انصراف
                        </button>

                        <button
                            type="submit"
                            className="admin-primary-button"
                            disabled={creating}
                        >
                            {creating
                                ? (
                                    editingSeriesId !== null
                                        ? "در حال ذخیره..."
                                        : "در حال ایجاد..."
                                )
                                : (
                                    editingSeriesId !== null
                                        ? "ذخیره تغییرات"
                                        : "ایجاد سری"
                                )}
                        </button>

                    </div>

                </form>

            )}

            <div className="admin-series-grid">

                {series.map((item) => (

                    <div
                        className="admin-series-card"
                        key={item.id}
                    >

                        <div
                            className="admin-series-color"
                            style={{
                                backgroundColor:
                                    item.color_code ||
                                    "#ffffff"
                            }}
                        />

                        <div className="admin-series-card-content">

                            <div className="admin-series-title-row">

                                <h3>
                                    {item.name_fa}
                                </h3>

                                <span className="admin-series-id">
                                    #{item.id}
                                </span>

                            </div>


                            <div className="admin-series-info">

                                <div>
                                    <span>
                                        نام انگلیسی
                                    </span>

                                    <strong>
                                        {item.name_en || "-"}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        پرداخت فارسی
                                    </span>

                                    <strong>
                                        {item.finish_fa || "-"}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        پرداخت انگلیسی
                                    </span>

                                    <strong>
                                        {item.finish_en || "-"}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        پوشه
                                    </span>

                                    <strong>
                                        {item.folder_name || "-"}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        تعداد محصولات
                                    </span>

                                    <strong>
                                        {item.product_count}
                                    </strong>
                                </div>

                            </div>


                            <div className="admin-series-actions">

                                <button
                                    type="button"
                                    className="admin-secondary-button"
                                    onClick={() =>
                                        navigate(`/admin/series/${item.id}`)
                                    }
                                >
                                    مشاهده محصولات
                                </button>

                                <button
                                    type="button"
                                    className="admin-edit-button"
                                    onClick={() => handleEditSeries(item.id)}
                                    disabled={loadingSeriesId === item.id}
                                >
                                    {loadingSeriesId === item.id
                                        ? "در حال دریافت..."
                                        : "ویرایش"}
                                </button>

                                <button
                                    type="button"
                                    className="admin-delete-button"
                                    onClick={() => handleDeleteSeries(item.id)}
                                >
                                    حذف
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}


export default AdminSeries;