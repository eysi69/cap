/* ===== Green GSM — services.js =====
 * Renders the Services page and the home-page service preview.
 * Depends on api.js (getServices).
 */

const Services = (() => {
    async function renderPage(container) {
        let services = [];
        try { services = await getServices(); } catch { services = []; }

        container.innerHTML = `
            <section class="gg-section-alt gg-section">
                <div class="container">
                    <div class="gg-header-center">
                        <span class="gg-eyebrow">Our Services</span>
                        <h2 class="gg-section-title">Electric mobility for every journey</h2>
                        <p class="gg-section-lead">From everyday commutes to corporate programs, Green GSM delivers transportation powered by a 100% electric fleet — built for cleaner, smarter cities.</p>
                    </div>
                    <div class="row g-4">
                        ${services.map(s => serviceCard(s)).join("")}
                    </div>
                </div>
            </section>

            <section class="gg-section">
                <div class="container">
                    <div class="row align-items-center g-5">
                        <div class="col-lg-5">
                            <span class="gg-eyebrow">Why Green GSM</span>
                            <h2 class="gg-section-title">Built for a cleaner Metro Manila</h2>
                            <p class="gg-section-lead">Every Green GSM ride is electric, monitored, and optimized — combining modern fleet technology with a commitment to sustainability and safety.</p>
                        </div>
                        <div class="col-lg-7">
                            <div class="row g-3">
                                ${whyCard("bi-ev-station-fill", "100% Electric Fleet", "Green GSM operates an all-electric vehicle fleet — zero tailpipe emissions on every trip.")}
                                ${whyCard("bi-cpu-fill", "Smart Fleet Technology", "Modern technology supports vehicle monitoring, route optimization, and fleet operations.")}
                                ${whyCard("bi-shield-check", "Safety First", "Driver performance and vehicle operations are monitored to support safer transportation.")}
                                ${whyCard("bi-tree-fill", "Sustainable Transportation", "Electric mobility helps reduce reliance on conventional fuel-based transportation.")}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    function serviceCard(s) {
        return `
            <div class="col-lg-6">
                <div class="gg-card">
                    <div class="gg-card-icon"><i class="bi ${s.icon}"></i></div>
                    <h3>${s.title}</h3>
                    <p>${s.short}</p>
                    <ul class="gg-safety-list mb-3">
                        ${s.benefits.map(b => `<li><i class="bi bi-check-circle-fill"></i> ${b}</li>`).join("")}
                    </ul>
                    <a class="gg-card-link" href="/services" data-route="/services">Learn More <i class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        `;
    }

    function whyCard(icon, title, text) {
        return `
            <div class="col-md-6">
                <div class="gg-feature">
                    <div class="gg-feature-icon"><i class="bi ${icon}"></i></div>
                    <div>
                        <h3>${title}</h3>
                        <p>${text}</p>
                    </div>
                </div>
            </div>
        `;
    }

    function renderHomePreview(container) {
        const preview = [
            { icon: "bi-car-front-fill", title: "Passenger Mobility", desc: "Comfortable electric transportation for everyday travel." },
            { icon: "bi-briefcase-fill", title: "Corporate Mobility", desc: "Transportation solutions for businesses and organizations." },
            { icon: "bi-truck-front-fill", title: "Fleet Operations", desc: "Efficient management of an all-electric transportation fleet." },
            { icon: "bi-globe-asia-east-fill", title: "Sustainable Mobility", desc: "Cleaner transportation powered by electric vehicles." },
        ];
        container.innerHTML = `
            <div class="row g-4">
                ${preview.map(p => `
                    <div class="col-lg-3 col-md-6">
                        <div class="gg-card">
                            <div class="gg-card-icon"><i class="bi ${p.icon}"></i></div>
                            <h3>${p.title}</h3>
                            <p>${p.desc}</p>
                            <a class="gg-card-link" href="/services" data-route="/services">Learn More <i class="bi bi-arrow-right"></i></a>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    }

    return { renderPage, renderHomePreview };
})();
