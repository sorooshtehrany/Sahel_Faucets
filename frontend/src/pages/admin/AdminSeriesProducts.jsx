
import {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import {
    getAdminSeriesById
} from "../../api/adminSeriesApi";

import {
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct
} from "../../api/adminProductApi";

import "./AdminSeriesProducts.css";


function AdminSeriesProducts() {

    const {
        id
    } = useParams();


    const [series, setSeries] =
        useState(null);

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

    const [editingProductId, setEditingProductId] =
        useState(null);


    const [formData, setFormData] =
        useState({
            name_fa: "",
            price: "",
            image_path: "",
            description: "",
            stock: 0,
            is_active: true
        });


    function resetForm() {

        setFormData({
            name_fa: "",
            price: "",
            image_path: "",
            description: "",
            stock: 0,
            is_active: true
        });

        setEditingProductId(null);
        setCreateError("");
    }


    function closeForm() {

        resetForm();

        setShowCreateForm(false);
    }


    async function loadSeries() {

        try {

            setLoading(true);
            setError("");

            const response =
                await getAdminSeriesById(id);

            setSeries(response);

        } catch (error) {

            console.error(
                "Admin series products error:",
                error
            );

            setError(
                error.message ||
                "خطا در دریافت اطلاعات سری"
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


    async function handleCreateProduct(event) {

        event.preventDefault();

        try {

            setCreating(true);
            setCreateError("");


            if (editingProductId !== null) {

                await updateAdminProduct(
                    editingProductId,
                    formData
                );

            } else {

                await createAdminProduct(
                    id,
                    formData
                );
            }


            resetForm();

            setShowCreateForm(false);

            await loadSeries();

        } catch (error) {

            console.error(
                editingProductId !== null
                    ? "Update product error:"
                    : "Create product error:",
                error
            );

            setCreateError(
                error.message ||
                (
                    editingProductId !== null
                        ? "خطا در به‌روزرسانی محصول"
                        : "خطا در ایجاد محصول"
                )
            );

        } finally {

            setCreating(false);
        }
    }


    function handleStartCreate() {

        resetForm();

        setShowCreateForm(true);
    }


    function handleStartEdit(product) {

        setFormData({
            name_fa:
                product.name_fa || "",

            price:
                product.price || "",

            image_path:
                product.image_path || "",

            description:
                product.description || "",

            stock:
                product.stock ?? 0,

            is_active:
                product.is_active ?? true
        });

        setEditingProductId(product.id);

        setCreateError("");

        setShowCreateForm(true);
    }

    async function handleDeleteProduct(productId) {

        const confirmed =
            window.confirm(
                "آیا از حذف این محصول مطمئن هستید؟"
            );
    
        if (!confirmed) {
            return;
        }
    
    
        try {
    
            await deleteAdminProduct(
                productId
            );
    
            await loadSeries();
    
        } catch (error) {
    
            console.error(
                "Delete product error:",
                error
            );
    
            alert(
                error.message ||
                "خطا در حذف محصول"
            );
        }
    }

    useEffect(() => {

        loadSeries();

    }, [id]);


    if (loading) {

        return (
            <div>
                در حال دریافت اطلاعات سری...
            </div>
        );
    }


    if (error) {

        return (
            <div>
                {error}
            </div>
        );
    }


    if (!series) {
        return null;
    }


    return (

        <div className="admin-series-products-page">


            {/* =========================
                Page Header
            ========================= */}

            <div className="admin-page-header">

                <div>

                    <h2>
                        محصولات سری {series.name_fa}
                    </h2>

                    <p>

                        {series.name_en || "-"}

                        {" "}

                        •

                        {" "}

                        تعداد محصولات:

                        {" "}

                        {series.products?.length || 0}

                    </p>

                </div>


                <button
                    type="button"
                    className="admin-primary-button"
                    onClick={handleStartCreate}
                >
                    + افزودن محصول
                </button>

            </div>


            {/* =========================
                Create / Edit Form
            ========================= */}

            {showCreateForm && (

                <form
                    className="admin-product-form"
                    onSubmit={handleCreateProduct}
                >


                    {/* Form Header */}

                    <div className="admin-product-form-header">

                        <div>

                            <h3>

                                {editingProductId !== null
                                    ? "ویرایش محصول"
                                    : "افزودن محصول"}

                            </h3>


                            <p>

                                {editingProductId !== null
                                    ? `ویرایش محصول برای سری ${series.name_fa}`
                                    : `محصول جدید برای سری ${series.name_fa}`}

                            </p>

                        </div>


                        <button
                            type="button"
                            className="admin-form-close"
                            onClick={closeForm}
                        >
                            ×
                        </button>

                    </div>


                    {/* Error */}

                    {createError && (

                        <div className="admin-series-form-error">

                            {createError}

                        </div>

                    )}


                    {/* Form Fields */}

                    <div className="admin-series-form-grid">


                        {/* Name */}

                        <div className="admin-form-field">

                            <label>
                                نام محصول *
                            </label>

                            <input
                                type="text"
                                name="name_fa"
                                value={formData.name_fa}
                                onChange={handleFormChange}
                                required
                            />

                        </div>


                        {/* Price */}

                        <div className="admin-form-field">

                            <label>
                                قیمت *
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleFormChange}
                                min="0"
                                required
                            />

                        </div>


                        {/* Stock */}

                        <div className="admin-form-field">

                            <label>
                                موجودی
                            </label>

                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleFormChange}
                                min="0"
                            />

                        </div>


                        {/* Active */}

                        <div className="admin-form-field">

                            <label>
                                وضعیت محصول
                            </label>

                            <select
                                name="is_active"
                                value={
                                    formData.is_active
                                        ? "true"
                                        : "false"
                                }
                                onChange={(event) => {

                                    setFormData((previous) => ({
                                        ...previous,

                                        is_active:
                                            event.target.value === "true"
                                    }));

                                }}
                            >

                                <option value="true">
                                    فعال
                                </option>

                                <option value="false">
                                    غیرفعال
                                </option>

                            </select>

                        </div>


                        {/* Image */}

                        <div className="admin-form-field">

                            <label>
                                نام تصویر
                            </label>

                            <input
                                type="text"
                                name="image_path"
                                value={formData.image_path}
                                onChange={handleFormChange}
                            />

                        </div>


                        {/* Description */}

                        <div className="admin-form-field">

                            <label>
                                توضیحات
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleFormChange}
                                rows="3"
                            />

                        </div>

                    </div>


                    {/* Form Actions */}

                    <div className="admin-series-form-actions">


                        <button
                            type="button"
                            className="admin-form-cancel"
                            onClick={closeForm}
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
                                    editingProductId !== null
                                        ? "در حال ذخیره..."
                                        : "در حال ایجاد..."
                                )
                                : (
                                    editingProductId !== null
                                        ? "ذخیره تغییرات"
                                        : "ایجاد محصول"
                                )}

                        </button>

                    </div>

                </form>

            )}


            {/* =========================
                Products List
            ========================= */}

            <div className="admin-series-products-list">


                {series.products?.length === 0 ? (

                    <div>
                        این سری هنوز محصولی ندارد.
                    </div>

                ) : (

                    series.products.map((product) => (

                        <div
                            key={product.id}
                            className="admin-product-card"
                        >


                            {/* Product Name */}

                            <div>

                                <strong>
                                    {product.name_fa}
                                </strong>

                                <div>

                                    شناسه:

                                    {" "}

                                    #{product.id}

                                </div>

                            </div>


                            {/* Price */}

                            <div>

                                <span>
                                    قیمت:
                                </span>

                                {" "}

                                <strong>

                                    {Number(
                                        product.price
                                    ).toLocaleString("fa-IR")}

                                </strong>

                                {" تومان"}

                            </div>


                            {/* Stock */}

                            <div>

                                <span>
                                    موجودی:
                                </span>

                                {" "}

                                <strong>
                                    {product.stock}
                                </strong>

                            </div>


                            {/* Status */}

                            <div>

                                <span>
                                    وضعیت:
                                </span>

                                {" "}

                                <strong>

                                    {product.is_active
                                        ? "فعال"
                                        : "غیرفعال"}

                                </strong>

                            </div>


                            {/* Image */}

                            <div>

                                <span>
                                    تصویر:
                                </span>

                                {" "}

                                <strong>

                                    {product.image_path || "-"}

                                </strong>

                            </div>


                            {/* Actions */}

                            <div className="admin-product-actions">

                                <button
                                    type="button"
                                    className="admin-edit-button"
                                    onClick={() =>
                                        handleStartEdit(product)
                                    }
                                >
                                    ویرایش
                                </button>

                                <button
                                    type="button"
                                    className="admin-delete-button"
                                    onClick={() =>
                                        handleDeleteProduct(product.id)
                                    }
                                >
                                    حذف
                                </button>

                            </div>


                        </div>

                    ))

                )}

            </div>

        </div>
    );
}


export default AdminSeriesProducts;

