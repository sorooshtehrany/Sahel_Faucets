import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductSearch() {

    const [searchText, setSearchText] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const searchRef = useRef(null);
    const resultRefs = useRef([]);

    const navigate = useNavigate();


    useEffect(() => {

        const text = searchText.trim();

        if (!text) {
            setProducts([]);
            setLoading(false);
            setSelectedIndex(-1);
            return;
        }

        const timer = setTimeout(async () => {

            try {

                setLoading(true);

                const response = await fetch(
                    `http://localhost:3000/api/products/search?q=${encodeURIComponent(text)}`
                );

                if (!response.ok) {
                    throw new Error("Search failed");
                }

                const data = await response.json();

                setProducts(data);
                setSelectedIndex(-1);

            } catch (error) {

                console.error(error);

                setProducts([]);
                setSelectedIndex(-1);

            } finally {

                setLoading(false);
            }

        }, 300);

        return () => {
            clearTimeout(timer);
        };

    }, [searchText]);


    useEffect(() => {

        function handleClickOutside(event) {

            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setSearchText("");
                setProducts([]);
                setSelectedIndex(-1);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);


    useEffect(() => {

        if (selectedIndex < 0) {
            return;
        }

        const selectedElement =
            resultRefs.current[selectedIndex];

        if (selectedElement) {

            selectedElement.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        }

    }, [selectedIndex]);


    function openProduct(productId) {

        setSearchText("");
        setProducts([]);
        setSelectedIndex(-1);

        navigate(`/product/${productId}`);
    }


    function handleKeyDown(event) {

        if (!searchText.trim()) {
            return;
        }


        if (event.key === "ArrowDown") {

            event.preventDefault();

            if (products.length === 0) {
                return;
            }

            setSelectedIndex((currentIndex) => {

                if (currentIndex === -1) {
                    return 0;
                }

                return (currentIndex + 1) % products.length;

            });

            return;
        }


        if (event.key === "ArrowUp") {

            event.preventDefault();

            if (products.length === 0) {
                return;
            }

            setSelectedIndex((currentIndex) => {

                if (currentIndex === -1) {
                    return products.length - 1;
                }

                return (
                    currentIndex - 1 + products.length
                ) % products.length;

            });

            return;
        }


        if (event.key === "Escape") {

            event.preventDefault();

            setSearchText("");
            setProducts([]);
            setSelectedIndex(-1);

            return;
        }


        if (event.key === "Enter") {

            event.preventDefault();

            if (
                products.length > 0 &&
                selectedIndex >= 0
            ) {

                const selectedProduct =
                    products[selectedIndex];

                openProduct(selectedProduct.id);
            }

        }

    }


    return (
        <div
            className="product-search"
            ref={searchRef}
        >

            <div className="product-search-box">

                <input
                    type="text"
                    value={searchText}
                    onChange={(event) => {

                        setSearchText(event.target.value);
                        setSelectedIndex(-1);

                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="جستجوی محصول..."
                    aria-label="جستجوی محصول"
                />

                <span className="product-search-icon">
                    🔍
                </span>

            </div>


            {loading && (
                <div className="product-search-loading">
                    در حال جستجو...
                </div>
            )}


            {!loading &&
                searchText.trim() &&
                products.length === 0 && (
                    <div className="product-search-empty">
                        محصولی پیدا نشد.
                    </div>
            )}


            {!loading && products.length > 0 && (
                <div className="product-search-results">

                    {products.map((product, index) => (

                        <div
                            key={product.id}

                            ref={(element) => {
                                resultRefs.current[index] = element;
                            }}

                            className={
                                "product-search-result" +
                                (
                                    index === selectedIndex
                                        ? " selected"
                                        : ""
                                )
                            }

                            onMouseEnter={() =>
                                setSelectedIndex(index)
                            }

                            onClick={() =>
                                openProduct(product.id)
                            }
                        >

                            <div className="product-search-result-info">

                                <span className="product-search-result-name">
                                    {product.name_fa}
                                </span>

                                <span className="product-search-result-series">
                                    {product.series_name_fa}
                                    {" • "}
                                    {product.series_finish_fa}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default ProductSearch;