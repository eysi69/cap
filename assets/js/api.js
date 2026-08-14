/* ===== Green GSM — api.js =====
 * Frontend data abstraction layer.
 * In demo mode, returns mock data. When the Green GSM Laravel REST API is
 * available, switch API_CONFIG.mode to "live" and the same functions will
 * call the real endpoints without touching the UI.
 */

const API_CONFIG = {
    baseURL: "/api/v1",
    mode: "demo", // "demo" | "live"
};

/* ----- Auth helpers (prepared for future Bearer / X-API-KEY usage) -----
 * Never hardcode real tokens in frontend code. These helpers read from
 * localStorage so a future login flow can set them securely-enough for a
 * public site. They are unused in demo mode.
 */
function getAuthToken() {
    return localStorage.getItem("gg_token") || "";
}
function getApiKey() {
    return localStorage.getItem("gg_api_key") || "";
}

/* Core request wrapper. In live mode it attaches auth headers and fetches
 * from the Laravel API. In demo mode it short-circuits to mock data. */
async function apiRequest(endpoint, options = {}) {
    if (API_CONFIG.mode === "demo") {
        return getMockData(endpoint, options);
    }

    const headers = {
        "Content-Type": "application/json",
        ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
        ...(getApiKey() ? { "X-API-KEY": getApiKey() } : {}),
        ...options.headers,
    };

    const res = await fetch(`${API_CONFIG.baseURL}${endpoint}`, { ...options, headers });
    if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
    return res.json();
}

/* ----- Mock data ----- */

const mockServices = [
    {
        id: "everyday",
        icon: "bi-car-front-fill",
        title: "Everyday Mobility",
        short: "Comfortable electric transportation for daily travel across Metro Manila.",
        description: "Clean, quiet, and reliable electric rides for your everyday journeys — from commutes to errands. Designed for comfort and a smaller carbon footprint.",
        benefits: ["100% electric vehicles", "Professional drivers", "Clean, comfortable interiors", "Real-time trip awareness (in-app)"],
    },
    {
        id: "corporate",
        icon: "bi-briefcase-fill",
        title: "Corporate Transportation",
        short: "Transportation solutions for businesses and organizations.",
        description: "Reliable electric mobility for corporate travel, employee shuttles, and partner programs — with consistent service quality and sustainability reporting.",
        benefits: ["Dedicated corporate accounts", "Employee shuttle programs", "Sustainability reporting", "Priority scheduling"],
    },
    {
        id: "fleet",
        icon: "bi-truck-front-fill",
        title: "Fleet Mobility",
        short: "Efficient management of an all-electric transportation fleet.",
        description: "Green GSM operates and maintains an electric fleet with smart monitoring, route support, and energy analytics — built for efficient, scalable operations.",
        benefits: ["Centralized fleet operations", "Smart route support", "Energy consumption tracking", "Maintenance scheduling"],
    },
    {
        id: "sustainable",
        icon: "bi-globe-asia-east-fill",
        title: "Sustainable Transportation",
        short: "Cleaner transportation powered by electric vehicles.",
        description: "Every Green GSM trip replaces a fuel-based journey, cutting tailpipe emissions and noise. Our electric-first approach supports cleaner air for Metro Manila.",
        benefits: ["Zero tailpipe emissions", "Reduced urban noise", "Lower carbon footprint", "Energy-efficient operations"],
    },
];

const mockFleet = [
    {
        id: "nerio-green",
        name: "Nerio Green",
        type: "Electric Sedan",
        category: "sedan",
        capacity: "5 passengers",
        battery: "60 kWh",
        range: "420 km",
        power: "150 kW",
        charging: "Fast-charge ready",
        status: "Active",
        description: "A refined electric sedan tuned for smooth, quiet urban travel with a spacious cabin and efficient energy use.",
    },
    {
        id: "vf8",
        name: "VF 8",
        type: "Electric SUV",
        category: "suv",
        capacity: "5 passengers",
        battery: "87.7 kWh",
        range: "471 km",
        power: "260 kW",
        charging: "Fast-charge ready",
        status: "Active",
        description: "Premium electric SUV designed for comfortable urban transportation with generous space and strong performance.",
    },
    {
        id: "vf-e34",
        name: "VF e34",
        type: "Electric Compact",
        category: "compact",
        capacity: "5 passengers",
        battery: "41.9 kWh",
        range: "285 km",
        power: "110 kW",
        charging: "Standard AC",
        status: "Active",
        description: "A nimble electric compact ideal for efficient city mobility and everyday trips.",
    },
    {
        id: "vf5",
        name: "VF 5",
        type: "Electric Crossover",
        category: "crossover",
        capacity: "5 passengers",
        battery: "37.6 kWh",
        range: "320 km",
        power: "134 kW",
        charging: "Fast-charge ready",
        status: "Active",
        description: "A versatile electric crossover balancing range, comfort, and efficiency for daily Metro Manila travel.",
    },
    {
        id: "vf9",
        name: "VF 9",
        type: "Electric Premium SUV",
        category: "suv",
        capacity: "7 passengers",
        battery: "98 kWh",
        range: "510 km",
        power: "300 kW",
        charging: "Fast-charge ready",
        status: "Active",
        description: "A flagship premium electric SUV with three-row seating, advanced comfort, and long-range capability.",
    },
];

const mockServiceAreas = [
    { id: "qc",      name: "Quezon City",   lat: 14.6760, lng: 121.0437, status: "Supported",   note: "Wide coverage across key districts." },
    { id: "makati",  name: "Makati",        lat: 14.5547, lng: 121.0244, status: "Supported",   note: "CBD and surrounding neighborhoods." },
    { id: "manila",  name: "Manila",        lat: 14.5995, lng: 120.9842, status: "Supported",   note: "Central Manila and university belt." },
    { id: "pasig",   name: "Pasig",         lat: 14.5764, lng: 121.0851, status: "Supported",   note: "Ortigas center and residential zones." },
    { id: "taguig",  name: "Taguig",        lat: 14.5176, lng: 121.0509, status: "Supported",   note: "BGC and Taguig commercial areas." },
    { id: "mandaluyong", name: "Mandaluyong", lat: 14.5794, lng: 121.0353, status: "Supported", note: "Ortigas fringe and residential districts." },
    { id: "pasay",   name: "Pasay",         lat: 14.5378, lng: 120.9916, status: "Planned",      note: "Expanding coverage soon." },
    { id: "paranaque", name: "Parañaque",  lat: 14.4793, lng: 121.0198, status: "Planned",      note: "Expanding coverage soon." },
];

const mockSustainability = {
    stats: [
        { label: "CO₂ avoided", value: "1,240", unit: "tonnes/yr" },
        { label: "Electric fleet", value: "100", unit: "%" },
        { label: "EVs in service", value: "180", unit: "vehicles" },
        { label: "Clean trips", value: "92k", unit: "/month" },
    ],
    energy: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        values: [4200, 4380, 4510, 4690, 4820, 5010, 5180, 5320],
    },
    composition: {
        labels: ["Sedan", "SUV", "Compact", "Crossover"],
        values: [40, 30, 18, 12],
    },
    impact: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        co2: [95, 102, 110, 118, 126, 134, 141, 148],
        trips: [78, 82, 88, 91, 94, 97, 99, 102],
    },
};

const mockFaqs = [
    { id: 1, category: "General Questions", question: "What is Green GSM?", answer: "Green GSM is an all-electric mobility and transportation service operating across Metro Manila. We combine an electric vehicle fleet with smart fleet technology to deliver cleaner, safer, and more reliable transportation." },
    { id: 2, category: "General Questions", question: "Where does Green GSM operate?", answer: "Green GSM covers key areas across Metro Manila, including Quezon City, Makati, Manila, Pasig, Taguig, and Mandaluyong, with more areas planned. See the Service Areas page for the latest coverage map." },
    { id: 3, category: "General Questions", question: "Are Green GSM vehicles electric?", answer: "Yes. Green GSM operates a 100% electric vehicle fleet, including VinFast EV models such as the VF 8, VF 9, VF 5, VF e34, and Nerio Green. We do not operate fuel-based vehicles." },
    { id: 4, category: "General Questions", question: "How can I contact Green GSM support?", answer: "You can reach our support team through the Contact page, via email, or by visiting our Help Center. Use the Contact form to send a message and our team will respond as soon as possible." },
    { id: 5, category: "Rides & Services", question: "How do I access Green GSM services?", answer: "Green GSM services will be accessible through the future Green GSM mobile app and supported transportation channels. This website is informational — ride booking will be available once the app launches." },
    { id: 6, category: "Rides & Services", question: "What types of transportation does Green GSM offer?", answer: "We offer everyday mobility, corporate transportation, fleet mobility, and sustainable transportation solutions — all powered by our electric fleet." },
    { id: 7, category: "Rides & Services", question: "Can I book a ride from this website?", answer: "Not yet. This website is informational and customer-service oriented. Ride booking will be available through the Green GSM mobile app when it launches." },
    { id: 8, category: "Payments", question: "How will payments work?", answer: "Payment options will be available through the Green GSM mobile app once launched. This demo website does not process any payments and does not collect payment information." },
    { id: 9, category: "Payments", question: "Is my payment information stored on this website?", answer: "No. This website does not process or store any payment information. All payment handling will take place securely within the Green GSM app." },
    { id: 10, category: "Safety", question: "How does Green GSM approach safety?", answer: "Green GSM's fleet management platform supports driver performance monitoring, speed monitoring, harsh braking alerts, safety scoring, and trip monitoring. These features belong to our internal fleet system, not this public website." },
    { id: 11, category: "Safety", question: "Are vehicles maintained regularly?", answer: "Yes. Green GSM's electric fleet is monitored and maintained as part of our fleet operations to support safe and reliable service." },
    { id: 12, category: "Drivers", question: "How can I become a Green GSM driver?", answer: "Driver registration will be handled through the Green GSM platform when it launches. This public website does not handle driver registration. Please check back or contact us for updates." },
    { id: 13, category: "Drivers", question: "Are drivers trained?", answer: "Green GSM drivers are part of our fleet operations and are supported by driver performance monitoring and safety scoring within our fleet management system." },
    { id: 14, category: "App Support", question: "When will the Green GSM app be available?", answer: "The Green GSM mobile app is coming soon. You can express interest and stay updated through this website. The Download App buttons are demo placeholders until launch." },
    { id: 15, category: "App Support", question: "Which platforms will the app support?", answer: "The Green GSM app is planned for both iOS (App Store) and Android (Google Play) when it launches." },
    { id: 16, category: "Lost Items", question: "What should I do if I lose an item?", answer: "If you lose an item during a Green GSM trip, use the Contact page or Help Center to report it. Our support team will help coordinate retrieval once the service is live." },
    { id: 17, category: "Lost Items", question: "Can I report a lost item from this website?", answer: "Yes. Use the Contact form and select 'Report an Issue' as the topic, then describe the lost item. This is a demo form for now — no message is actually sent." },
    { id: 18, category: "Account Help", question: "Do I need an account to use this website?", answer: "No. This public website is open to everyone and does not require an account. Accounts will be part of the Green GSM mobile app when it launches." },
    { id: 19, category: "Account Help", question: "Can I log in on this website?", answer: "No. This website does not include login or account features. Account access will be available through the Green GSM app." },
    { id: 20, category: "Sustainability", question: "How is Green GSM sustainable?", answer: "Green GSM operates a 100% electric fleet, monitors energy consumption in kWh, and uses smart energy analytics to improve efficiency — reducing tailpipe emissions and urban noise across Metro Manila." },
    { id: 21, category: "Sustainability", question: "What is energy monitoring?", answer: "Green GSM tracks electricity consumption (kWh) across our electric fleet instead of traditional fuel consumption, helping us understand and optimize operational efficiency." },
];

/* ----- Mock dispatcher -----
 * Routes a "GET /api/v1/<resource>" style endpoint to the right mock data.
 * Also handles POST /api/v1/support/tickets by echoing a success response.
 */
function getMockData(endpoint, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    const path = endpoint.split("?")[0];

    if (method === "POST" && path === "/support/tickets") {
        return Promise.resolve({ success: true, message: "Support request received.", ticketId: "GG-DEMO-" + Math.floor(1000 + Math.random() * 9000) });
    }

    const map = {
        "/services": mockServices,
        "/fleet": mockFleet,
        "/service-areas": mockServiceAreas,
        "/sustainability": mockSustainability,
        "/support/faqs": mockFaqs,
    };

    if (path in map) return Promise.resolve(map[path]);
    return Promise.reject(new Error(`No mock data for ${path}`));
}

/* ----- Public API functions (used by the UI) ----- */

async function getServices()       { return apiRequest("/services"); }
async function getFleet()           { return apiRequest("/fleet"); }
async function getServiceAreas()   { return apiRequest("/service-areas"); }
async function getSustainability() { return apiRequest("/sustainability"); }
async function getFaqs()            { return apiRequest("/support/faqs"); }

async function submitSupportRequest(formData) {
    // Future: POST /api/v1/support/tickets
    return apiRequest("/support/tickets", {
        method: "POST",
        body: JSON.stringify(formData),
    });
}
