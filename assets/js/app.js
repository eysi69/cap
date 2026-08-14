/* ===== Green GSM — app.js =====
 * Main controller: builds each page into #app and wires up navigation.
 * Depends on router.js, services.js, fleet.js, support.js, map.js, charts.js.
 */

const App = (() => {
    const appEl = () => document.getElementById("app");

    function init() {
        Router.init(navigate);
        navigate(Router.getPath(), false);
        window.addEventListener("scroll", handleNavScroll, { passive: true });
        handleNavScroll();
    }

    function navigate(path) {
        const route = Router.getRoute(path);
        document.title = route.title;
        updateActiveNav(path);
        const el = appEl();
        if (!el) return;

        // Clean up previous page resources
        GCharts.destroyCharts();

        switch (route.render) {
            case "home":          renderHome(el); break;
            case "services":      Services.renderPage(el); break;
            case "fleet":         Fleet.renderPage(el); break;
            case "sustainability":GCharts.renderPage(el); break;
            case "serviceAreas":  GMap.initServiceAreas(el); break;
            case "safety":        renderSafety(el); break;
            case "about":         renderAbout(el); break;
            case "help":          Support.init(el); break;
            case "contact":      renderContact(el); break;
            case "download":      renderDownload(el); break;
            default:              renderHome(el);
        }
    }

    function updateActiveNav(path) {
        document.querySelectorAll(".gg-nav-link, .gg-mobile-nav .nav-link").forEach(link => {
            link.classList.toggle("active", link.getAttribute("data-route") === path);
        });
    }

    function handleNavScroll() {
        const nav = document.getElementById("mainNav");
        if (!nav) return;
        nav.classList.toggle("gg-scrolled", window.scrollY > 10);
    }

    /* ===== HOME ===== */
    function renderHome(el) {
        el.innerHTML = `
            <section class="gg-hero">
                <div class="gg-hero-grid"></div>
                <div class="container">
                    <div class="row align-items-center g-5">
                        <div class="col-lg-6">
                            <span class="gg-hero-eyebrow"><i class="bi bi-ev-station-fill"></i> 100% Electric Mobility</span>
                            <h1 class="gg-hero-title">Smarter Rides.<br><span class="accent">Cleaner Cities.</span></h1>
                            <p class="gg-hero-sub">Experience a modern electric mobility service built for safer, cleaner, and more reliable journeys across Metro Manila.</p>
                            <div class="gg-hero-cta">
                                <a class="btn gg-btn-primary" href="/services" data-route="/services">Explore Green GSM <i class="bi bi-arrow-right ms-1"></i></a>
                                <a class="btn gg-btn-outline" href="/about" data-route="/about">How It Works</a>
                            </div>
                            <div class="gg-hero-stats">
                                <div class="gg-hero-stat"><div class="gg-hero-stat-num">100%</div><div class="gg-hero-stat-label">Electric Fleet</div></div>
                                <div class="gg-hero-stat"><div class="gg-hero-stat-num">8</div><div class="gg-hero-stat-label">Metro Manila Areas</div></div>
                                <div class="gg-hero-stat"><div class="gg-hero-stat-num">5</div><div class="gg-hero-stat-label">EV Models</div></div>
                                <div class="gg-hero-stat"><div class="gg-hero-stat-num">0</div><div class="gg-hero-stat-label">Tailpipe Emissions</div></div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="gg-hero-visual">
                                <div class="gg-hero-card-main">
                                    <img src="https://images.pexels.com/photos/30306584/pexels-photo-30306584.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Electric vehicle on a Metro Manila street" loading="lazy">
                                </div>
                                <div class="gg-hero-badge gg-hero-badge-1">
                                    <span class="gg-badge-icon"><i class="bi bi-ev-station-fill"></i></span>
                                    100% Electric Fleet
                                </div>
                                <div class="gg-hero-badge gg-hero-badge-2">
                                    <span class="gg-badge-icon"><i class="bi bi-geo-alt-fill"></i></span>
                                    Metro Manila Coverage
                                </div>
                                <div class="gg-hero-badge gg-hero-badge-3">
                                    <span class="gg-badge-icon"><i class="bi bi-shield-check"></i></span>
                                    Safety-Focused
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="gg-section">
                <div class="container">
                    <div class="gg-header-center">
                        <span class="gg-eyebrow">What We Offer</span>
                        <h2 class="gg-section-title">Electric mobility services for Metro Manila</h2>
                        <p class="gg-section-lead">From everyday rides to corporate programs, Green GSM brings clean, reliable transportation powered by an all-electric fleet.</p>
                    </div>
                    <div id="homeServicePreview"></div>
                </div>
            </section>

            <section class="gg-section-alt gg-section">
                <div class="container">
                    <div class="gg-header-center">
                        <span class="gg-eyebrow">Why Green GSM</span>
                        <h2 class="gg-section-title">A smarter way to move</h2>
                        <p class="gg-section-lead">We combine electric vehicles, smart fleet technology, and a safety-first approach to deliver transportation that's better for everyone.</p>
                    </div>
                    <div class="row g-4">
                        ${whyCard("bi-ev-station-fill", "100% Electric Fleet", "Green GSM operates an all-electric vehicle fleet — zero tailpipe emissions on every trip.")}
                        ${whyCard("bi-cpu-fill", "Smart Fleet Technology", "Modern technology supports vehicle monitoring, route optimization, and fleet operations.")}
                        ${whyCard("bi-shield-check", "Safety First", "Driver performance and vehicle operations are monitored to support safer transportation.")}
                        ${whyCard("bi-tree-fill", "Sustainable Transportation", "Electric mobility helps reduce reliance on conventional fuel-based transportation.")}
                    </div>
                </div>
            </section>

            <section class="gg-section">
                <div class="container">
                    <div class="gg-header-center">
                        <span class="gg-eyebrow">How Green GSM Works</span>
                        <h2 class="gg-section-title">Four steps to cleaner mobility</h2>
                        <p class="gg-section-lead">Getting started with Green GSM is simple — discover, connect, ride, and move sustainably.</p>
                    </div>
                    <div class="row g-4 gg-steps">
                        ${stepCard("01", "Discover", "Learn about Green GSM services and coverage across Metro Manila.")}
                        ${stepCard("02", "Connect", "Access Green GSM through the future mobile app and supported transportation channels.")}
                        ${stepCard("03", "Ride", "Travel using Green GSM's electric vehicle fleet for a cleaner journey.")}
                        ${stepCard("04", "Move Sustainably", "Enjoy transportation powered by electric mobility — better for the city.")}
                    </div>
                </div>
            </section>
        `;
        Services.renderHomePreview(document.getElementById("homeServicePreview"));
    }

    function whyCard(icon, title, text) {
        return `
            <div class="col-lg-3 col-md-6">
                <div class="gg-feature">
                    <div class="gg-feature-icon"><i class="bi ${icon}"></i></div>
                    <div><h3>${title}</h3><p>${text}</p></div>
                </div>
            </div>
        `;
    }

    function stepCard(num, title, text) {
        return `
            <div class="col-lg-3 col-md-6">
                <div class="gg-step">
                    <div class="gg-step-num">${num}</div>
                    <h3>${title}</h3>
                    <p>${text}</p>
                </div>
            </div>
        `;
    }

    /* ===== SAFETY ===== */
    function renderSafety(el) {
        el.innerHTML = `
            <section class="gg-section-alt gg-section">
                <div class="container">
                    <div class="gg-header-center">
                        <span class="gg-eyebrow">Safety</span>
                        <h2 class="gg-section-title">Safety at the heart of every ride</h2>
                        <p class="gg-section-lead">Green GSM's fleet management platform is built to support safer transportation — from driver monitoring to vehicle maintenance.</p>
                    </div>
                    <div class="row g-4">
                        <div class="col-lg-4">
                            <div class="gg-safety-card">
                                <div class="gg-card-icon"><i class="bi bi-person-badge-fill"></i></div>
                                <h3>Driver Safety</h3>
                                <p>Driver performance monitoring can support safer operations, helping maintain consistent and responsible driving across the fleet.</p>
                                <ul class="gg-safety-list">
                                    <li><i class="bi bi-check-circle-fill"></i> Driver performance monitoring</li>
                                    <li><i class="bi bi-check-circle-fill"></i> Safety scoring</li>
                                    <li><i class="bi bi-check-circle-fill"></i> Trip monitoring</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="gg-safety-card">
                                <div class="gg-card-icon"><i class="bi bi-car-front-fill"></i></div>
                                <h3>Vehicle Safety</h3>
                                <p>EV fleet vehicles are monitored and maintained as part of fleet operations to support safe and reliable transportation.</p>
                                <ul class="gg-safety-list">
                                    <li><i class="bi bi-check-circle-fill"></i> Regular maintenance</li>
                                    <li><i class="bi bi-check-circle-fill"></i> Vehicle health monitoring</li>
                                    <li><i class="bi bi-check-circle-fill"></i> Battery safety checks</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="gg-safety-card">
                                <div class="gg-card-icon"><i class="bi bi-cpu-fill"></i></div>
                                <h3>Smart Monitoring</h3>
                                <p>Green GSM's fleet system supports real-time awareness of driving behavior and vehicle operations.</p>
                                <ul class="gg-safety-list">
                                    <li><i class="bi bi-check-circle-fill"></i> Speed monitoring</li>
                                    <li><i class="bi bi-check-circle-fill"></i> Harsh braking alerts</li>
                                    <li><i class="bi bi-check-circle-fill"></i> Safety scoring</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="text-center mt-4">
                        <span class="gg-demo-note"><i class="bi bi-info-circle"></i> These features belong to the Green GSM fleet management platform, not this public website.</span>
                    </div>
                </div>
            </section>
        `;
    }

    /* ===== ABOUT ===== */
    function renderAbout(el) {
        el.innerHTML = `
            <section class="gg-about-hero">
                <div class="container">
                    <span class="gg-eyebrow gg-eyebrow-light">About Green GSM</span>
                    <h1>Moving Metro Manila Toward a Cleaner Future</h1>
                    <p>Green GSM is an electric transportation and fleet management initiative focused on sustainable mobility, electric vehicles, smart technology, safer operations, and efficient fleet management.</p>
                </div>
            </section>

            <section class="gg-section">
                <div class="container">
                    <div class="row g-4">
                        <div class="col-lg-6">
                            <div class="gg-mv-card">
                                <div class="gg-card-icon"><i class="bi bi-bullseye"></i></div>
                                <h3>Our Mission</h3>
                                <p>Make urban mobility cleaner, smarter, and more accessible — by replacing fuel-based trips with reliable electric transportation across Metro Manila.</p>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="gg-mv-card">
                                <div class="gg-card-icon"><i class="bi bi-eye-fill"></i></div>
                                <h3>Our Vision</h3>
                                <p>Build a transportation ecosystem where technology and electric mobility work together to create a more sustainable city for everyone.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="gg-section-alt gg-section">
                <div class="container">
                    <div class="row g-5">
                        <div class="col-lg-5">
                            <span class="gg-eyebrow">Our Journey</span>
                            <h2 class="gg-section-title">Company highlights</h2>
                            <p class="gg-section-lead">From idea to an electric fleet — here's how Green GSM is building toward cleaner Metro Manila mobility.</p>
                        </div>
                        <div class="col-lg-7">
                            <div class="gg-timeline">
                                ${timelineItem("2024", "Green GSM is founded as an electric mobility initiative focused on Metro Manila.")}
                                ${timelineItem("2025", "All-electric fleet launched with VinFast EV models including the VF 8 and VF 9.")}
                                ${timelineItem("2025", "Fleet management platform deployed with smart monitoring and energy analytics.")}
                                ${timelineItem("2026", "Coverage expands across Metro Manila with the Green GSM mobile app on the way.")}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    function timelineItem(year, text) {
        return `<div class="gg-timeline-item"><div class="gg-timeline-dot"></div><div class="gg-timeline-year">${year}</div><div class="gg-timeline-text">${text}</div></div>`;
    }

    /* ===== CONTACT ===== */
    function renderContact(el) {
        el.innerHTML = `
            <section class="gg-section-alt gg-section">
                <div class="container">
                    <div class="gg-header-center">
                        <span class="gg-eyebrow">Contact</span>
                        <h2 class="gg-section-title">Get in touch with Green GSM</h2>
                        <p class="gg-section-lead">Questions, partnership ideas, or need support? We'd love to hear from you. The details below are demo information.</p>
                    </div>
                    <div class="gg-contact-grid">
                        <div class="gg-contact-info">
                            <div class="gg-contact-item">
                                <i class="bi bi-geo-alt-fill"></i>
                                <div><h4>Location</h4><p>Metro Manila, Philippines</p></div>
                            </div>
                            <div class="gg-contact-item">
                                <i class="bi bi-envelope-fill"></i>
                                <div><h4>Email Support</h4><p>support@greengsm.example</p></div>
                            </div>
                            <div class="gg-contact-item">
                                <i class="bi bi-telephone-fill"></i>
                                <div><h4>Phone Support</h4><p>+63 (2) 8000 0000 (demo)</p></div>
                            </div>
                            <div class="gg-contact-item">
                                <i class="bi bi-headset"></i>
                                <div><h4>Customer Support</h4><p>Visit our Help Center for FAQs and guides.</p></div>
                            </div>
                            <div class="gg-contact-item">
                                <i class="bi bi-building"></i>
                                <div><h4>Business Inquiries</h4><p>partnerships@greengsm.example</p></div>
                            </div>
                        </div>
                        <div class="gg-form-card">
                            <h3>Send us a message</h3>
                            <p class="gg-form-sub">Fill out the form below and our team will get back to you. This is a demo form — no message is actually sent.</p>
                            <form id="contactForm" novalidate>
                                <div class="gg-field">
                                    <label for="cf-name">Full Name</label>
                                    <input type="text" id="cf-name" name="fullName" placeholder="Your name">
                                    <div class="gg-error">Please enter your name.</div>
                                </div>
                                <div class="gg-field">
                                    <label for="cf-email">Email</label>
                                    <input type="email" id="cf-email" name="email" placeholder="you@example.com">
                                    <div class="gg-error">Please enter a valid email.</div>
                                </div>
                                <div class="gg-field">
                                    <label for="cf-topic">Topic</label>
                                    <select id="cf-topic" name="topic">
                                        <option value="">Select a topic</option>
                                        <option>General Question</option>
                                        <option>Rides & Services</option>
                                        <option>Safety</option>
                                        <option>Sustainability</option>
                                        <option>Business Inquiry</option>
                                        <option>Report an Issue</option>
                                    </select>
                                    <div class="gg-error">Please select a topic.</div>
                                </div>
                                <div class="gg-field">
                                    <label for="cf-msg">Message</label>
                                    <textarea id="cf-msg" name="message" placeholder="How can we help?"></textarea>
                                    <div class="gg-error">Please enter a message (10+ characters).</div>
                                </div>
                                <button type="submit" class="btn gg-btn-primary w-100">Send Message</button>
                                <p class="gg-form-note">Demo interface — prepared for future API integration.</p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section class="gg-section">
                <div class="container">
                    <div class="gg-header-center">
                        <span class="gg-eyebrow">Find Us</span>
                        <h2 class="gg-section-title">Serving Metro Manila</h2>
                        <p class="gg-section-lead">Green GSM operates across Metro Manila. This map shows our general service region.</p>
                    </div>
                    <div class="gg-map-wrap" style="height:420px;">
                        <div id="contactMap" role="application" aria-label="Metro Manila map"></div>
                    </div>
                </div>
            </section>
        `;
        initContactForm(document.getElementById("contactForm"));
        requestAnimationFrame(() => GMap.initContactMap("contactMap"));
    }

    /* ===== DOWNLOAD ===== */
    function renderDownload(el) {
        el.innerHTML = `
            <section class="gg-section gg-section-alt">
                <div class="container text-center">
                    <span class="gg-eyebrow">Get the App</span>
                    <h2 class="gg-section-title">Your next ride is closer than ever</h2>
                    <p class="gg-section-lead mx-auto">Access Green GSM services through the future Green GSM mobile experience — designed for effortless electric mobility across Metro Manila.</p>
                </div>
            </section>
        `;
        // The shared download CTA section in index.html shows the buttons.
        // Scroll to it.
        const dl = document.getElementById("download-app");
        if (dl) dl.scrollIntoView({ behavior: "smooth" });
    }

    return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);
