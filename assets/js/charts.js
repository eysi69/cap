/* ===== Green GSM — charts.js =====
 * Chart.js sustainability charts (demo/sample data).
 * Depends on api.js (getSustainability) and Chart.js (global `Chart`).
 */

const GCharts = (() => {
    let charts = [];

    async function renderPage(container) {
        let data;
        try { data = await getSustainability(); } catch { data = null; }

        container.innerHTML = `
            <section class="gg-section-alt gg-section">
                <div class="container">
                    <div class="gg-header-center">
                        <span class="gg-eyebrow">Sustainability</span>
                        <h2 class="gg-section-title">Cleaner mobility, measured</h2>
                        <p class="gg-section-lead">Green GSM's all-electric fleet is designed to cut emissions, reduce urban noise, and make transportation more energy-efficient across Metro Manila.</p>
                    </div>

                    <div class="row g-4 mb-5">
                        ${impactCards(data)}
                    </div>

                    <div class="row g-4 mb-4">
                        <div class="col-lg-6">
                            <div class="gg-chart-card">
                                <h3>Energy Consumption Overview</h3>
                                <p class="gg-chart-sub">Monthly fleet electricity use (kWh) — demo data</p>
                                <div class="gg-chart-wrap"><canvas id="energyChart"></canvas></div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="gg-chart-card">
                                <h3>EV Fleet Composition</h3>
                                <p class="gg-chart-sub">Vehicle type distribution — demo data</p>
                                <div class="gg-chart-wrap"><canvas id="fleetChart"></canvas></div>
                            </div>
                        </div>
                    </div>

                    <div class="row g-4">
                        <div class="col-12">
                            <div class="gg-chart-card">
                                <h3>Monthly Sustainability Impact</h3>
                                <p class="gg-chart-sub">CO₂ avoided (tonnes) and clean trips (thousands) — demo data</p>
                                <div class="gg-chart-wrap" style="height:320px;"><canvas id="impactChart"></canvas></div>
                            </div>
                        </div>
                    </div>

                    <div class="text-center mt-4">
                        <span class="gg-demo-note"><i class="bi bi-info-circle"></i> All chart figures are demo/sample data for illustration, not live production metrics.</span>
                    </div>
                </div>
            </section>

            <section class="gg-section">
                <div class="container">
                    <div class="row g-4">
                        ${pillarCard("bi-ev-station-fill", "Electric Fleet", "Green GSM operates an all-electric fleet. Every vehicle runs on electricity — no fuel, no tailpipe emissions.")}
                        ${pillarCard("bi-battery-charging", "Energy Monitoring", "Our fleet operations monitor electricity consumption in kWh rather than traditional fuel consumption.")}
                        ${pillarCard("bi-graph-up-arrow", "Smart Energy Analytics", "Green GSM's fleet system analyzes energy consumption and operational efficiency to optimize every trip.")}
                        ${pillarCard("bi-tree-fill", "Cleaner Mobility", "Electric transportation contributes to cleaner urban air and quieter streets across Metro Manila.")}
                    </div>
                </div>
            </section>
        `;

        requestAnimationFrame(() => drawCharts(data));
    }

    function impactCards(data) {
        if (!data || !data.stats) return "";
        return data.stats.map(s => `
            <div class="col-lg-3 col-md-6">
                <div class="gg-impact-card">
                    <div class="gg-impact-num">${s.value}<span style="font-size:1rem;">${s.unit}</span></div>
                    <div class="gg-impact-label">${s.label}</div>
                </div>
            </div>
        `).join("");
    }

    function pillarCard(icon, title, text) {
        return `
            <div class="col-lg-3 col-md-6">
                <div class="gg-card">
                    <div class="gg-card-icon"><i class="bi ${icon}"></i></div>
                    <h3>${title}</h3>
                    <p>${text}</p>
                </div>
            </div>
        `;
    }

    function destroyCharts() {
        charts.forEach(c => { try { c.destroy(); } catch {} });
        charts = [];
    }

    function drawCharts(data) {
        destroyCharts();
        if (!data) return;
        const green = "#0f7c5c";
        const greenLight = "#16b07c";
        const accent = "#b6f0d8";

        const energyEl = document.getElementById("energyChart");
        if (energyEl) {
            charts.push(new Chart(energyEl, {
                type: "line",
                data: {
                    labels: data.energy.labels,
                    datasets: [{
                        label: "kWh",
                        data: data.energy.values,
                        borderColor: green,
                        backgroundColor: "rgba(15,124,92,.12)",
                        fill: true,
                        tension: .35,
                        borderWidth: 2,
                        pointBackgroundColor: green,
                        pointRadius: 4,
                    }],
                },
                options: chartOpts(true),
            }));
        }

        const fleetEl = document.getElementById("fleetChart");
        if (fleetEl) {
            charts.push(new Chart(fleetEl, {
                type: "doughnut",
                data: {
                    labels: data.composition.labels,
                    datasets: [{
                        data: data.composition.values,
                        backgroundColor: [green, greenLight, accent, "#7fd9b8"],
                        borderWidth: 0,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "62%",
                    plugins: { legend: { position: "bottom", labels: { padding: 16, font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 } } } },
                },
            }));
        }

        const impactEl = document.getElementById("impactChart");
        if (impactEl) {
            charts.push(new Chart(impactEl, {
                type: "bar",
                data: {
                    labels: data.impact.labels,
                    datasets: [
                        { label: "CO₂ avoided (tonnes)", data: data.impact.co2, backgroundColor: green, borderRadius: 6, barThickness: 18 },
                        { label: "Clean trips (k)", data: data.impact.trips, backgroundColor: accent, borderRadius: 6, barThickness: 18 },
                    ],
                },
                options: chartOpts(true),
            }));
        }
    }

    function chartOpts(legend) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: legend, position: "bottom", labels: { padding: 16, font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 } } },
                tooltip: { backgroundColor: "#0f1b17", padding: 12, cornerRadius: 8, titleFont: { family: "'Plus Jakarta Sans', sans-serif" }, bodyFont: { family: "'Plus Jakarta Sans', sans-serif" } },
            },
            scales: {
                x: { grid: { display: false }, ticks: { font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 } } },
                y: { grid: { color: "rgba(15,27,23,.06)" }, ticks: { font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 } } },
            },
        };
    }

    return { renderPage, destroyCharts };
})();
