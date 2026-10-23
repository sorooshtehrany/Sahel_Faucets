const BASE_URL = "https://sahelfaucets.ir";

export function setPageSeo({ title, description, path = "/" }) {
    document.title = title;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
        descriptionTag = document.createElement("meta");
        descriptionTag.setAttribute("name", "description");
        document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute("content", description);

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
        canonicalTag = document.createElement("link");
        canonicalTag.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalTag);
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    canonicalTag.setAttribute("href", `${BASE_URL}${normalizedPath}`);
}
