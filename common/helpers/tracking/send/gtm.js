// Define window.dataLayer on client-side only.
if ('object' === typeof window) {
    window.dataLayer = window.dataLayer || [];
}

export default data => window.dataLayer.push(data);