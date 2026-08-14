/* ===== Green GSM — router.js =====
 * Lightweight SPA router using the History API.
 * Maps URL paths to render functions in app.js.
 */

const Router = (() => {
    const routes = {
        "/":               { title: "Green GSM — Smarter Rides. Cleaner Cities.",         render: "home" },
        "/services":       { title: "Services — Green GSM",                              render: "services" },
        "/fleet":          { title: "Fleet — Green GSM",                                 render: "fleet" },
        "/sustainability": { title: "Sustainability — Green GSM",                        render: "sustainability" },
        "/service-areas":  { title: "Service Areas — Green GSM",                         render: "serviceAreas" },
        "/safety":         { title: "Safety — Green GSM",                                render: "safety" },
        "/about":          { title: "About — Green GSM",                                  render: "about" },
        "/help":           { title: "Help Center — Green GSM",                            render: "help" },
        "/contact":        { title: "Contact — Green GSM",                                render: "contact" },
        "/download":       { title: "Download App — Green GSM",                           render: "download" },
    };

    let onNavigate = null;

    function init(navigateFn) {
        onNavigate = navigateFn;
        // Intercept clicks on internal links
        document.addEventListener("click", handleClick);
        // Handle browser back/forward
        window.addEventListener("popstate", () => {
            if (onNavigate) onNavigate(getPath(), false);
        });
    }

    function handleClick(e) {
        const a = e.target.closest("a[data-route]");
        if (!a) return;
        const route = a.getAttribute("data-route") || a.getAttribute("href");
        if (!route || route.startsWith("http") || route === "#") return;
        e.preventDefault();
        navigate(route, true);
        closeOffcanvas();
    }

    function navigate(path, push) {
        if (!routes[path]) path = "/";
        if (push && getPath() !== path) history.pushState({}, "", path);
        if (onNavigate) onNavigate(path, false);
        closeOffcanvas();
        window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }

    function closeOffcanvas() {
        const oc = document.getElementById("mobileNav");
        if (oc && oc.classList.contains("show")) {
            bootstrap.Offcanvas.getOrCreateInstance(oc).hide();
        }
    }

    function getPath() {
        // For static hosting, treat directory as "/"
        const p = window.location.pathname.replace(/\/index\.html$/, "/");
        return p === "" ? "/" : p;
    }

    function getRoute(path) {
        return routes[path] || routes["/"];
    }

    return { init, navigate, getPath, getRoute, routes };
})();
