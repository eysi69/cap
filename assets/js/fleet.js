/* ===== Green GSM — fleet.js =====
 * Renders the Fleet page, filter buttons, and vehicle detail modal.
 * Depends on api.js (getFleet).
 */

const Fleet = (() => {
    let vehicles = [];
    let activeFilter = "all";

    const filters = [
        { id: "all", label: "All Vehicles" },
        { id: "sedan", label: "Sedans" },
        { id: "suv", label: "SUVs" },
        { id: "compact", label: "Compacts" },
        { id: "crossover", label: "Crossovers" },
    ];

    async function renderPage(container) {
        try { vehicles = await getFleet(); } catch { vehicles = []; }
        container.innerHTML = `
            <section class="gg-section-alt gg-section">
                <div class="container">
                    <div class="gg-header-center">
                        <span class="gg-eyebrow">Our Fleet</span>
                        <h2 class="gg-section-title">A premium all-electric fleet</h2>
                        <p class="gg-section-lead">Green GSM operates a modern fleet of VinFast electric vehicles — each chosen for comfort, efficiency, and a cleaner ride across Metro Manila.</p>
                    </div>
                    <div class="gg-fleet-filters" id="fleetFilters" role="tablist">
                        ${filters.map(f => `<button class="gg-filter-btn ${f.id === 'all' ? 'active' : ''}" data-filter="${f.id}">${f.label}</button>`).join("")}
                    </div>
                    <div class="row g-4" id="fleetGrid"></div>
                </div>
            </section>
        `;

        container.querySelector("#fleetFilters").addEventListener("click", (e) => {
            const btn = e.target.closest(".gg-filter-btn");
            if (!btn) return;
            activeFilter = btn.dataset.filter;
            container.querySelectorAll(".gg-filter-btn").forEach(b => b.classList.toggle("active", b.dataset.filter === activeFilter));
            renderGrid(container);
        });

        renderGrid(container);
    }

    function renderGrid(container) {
        const grid = container.querySelector("#fleetGrid");
        if (!grid) return;
        const list = activeFilter === "all" ? vehicles : vehicles.filter(v => v.category === activeFilter);
        if (!list.length) {
            grid.innerHTML = `<div class="col-12 text-center text-muted py-5">No vehicles in this category.</div>`;
            return;
        }
        grid.innerHTML = list.map(v => vehicleCard(v)).join("");

        grid.querySelectorAll("[data-vehicle-id]").forEach(btn => {
            btn.addEventListener("click", () => openModal(btn.dataset.vehicleId));
        });
    }

    function vehicleCard(v) {
        return `
            <div class="col-lg-4 col-md-6">
                <div class="gg-vehicle-card">
                    <div class="gg-vehicle-img">
                        <span class="gg-ev-badge"><i class="bi bi-ev-station-fill"></i> Electric</span>
                        <span class="gg-vehicle-status"><i class="bi bi-circle-fill" style="font-size:.5rem;"></i> ${v.status}</span>
                        <i class="bi bi-car-front-fill"></i>
                    </div>
                    <div class="gg-vehicle-body">
                        <div class="gg-vehicle-cat">${v.type}</div>
                        <div class="gg-vehicle-name">${v.name}</div>
                        <p class="gg-vehicle-desc">${v.description}</p>
                        <div class="gg-vehicle-specs">
                            <span class="gg-vehicle-spec"><i class="bi bi-people-fill"></i> ${v.capacity}</span>
                            <span class="gg-vehicle-spec"><i class="bi bi-battery-charging"></i> ${v.battery}</span>
                            <span class="gg-vehicle-spec"><i class="bi bi-signpost-2"></i> ${v.range}</span>
                        </div>
                        <button class="btn gg-btn-outline w-100" data-vehicle-id="${v.id}">View Details</button>
                    </div>
                </div>
            </div>
        `;
    }

    function openModal(id) {
        const v = vehicles.find(x => x.id === id);
        if (!v) return;
        const content = document.getElementById("fleetModalContent");
        content.innerHTML = `
            <div class="modal-header gg-modal-header">
                <div>
                    <div class="gg-vehicle-cat" style="color:var(--gg-primary-dark);">${v.type}</div>
                    <h3 class="gg-modal-title">${v.name}</h3>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body gg-modal-body">
                <div class="gg-vehicle-img mb-4" style="border-radius:var(--gg-radius);aspect-ratio:16/7;">
                    <span class="gg-ev-badge"><i class="bi bi-ev-station-fill"></i> Electric</span>
                    <i class="bi bi-car-front-fill"></i>
                </div>
                <p class="mb-4">${v.description}</p>
                <div class="gg-spec-grid">
                    ${specItem("Category", v.type)}
                    ${specItem("Passenger Capacity", v.capacity)}
                    ${specItem("Battery", v.battery)}
                    ${specItem("Range", v.range)}
                    ${specItem("Power", v.power)}
                    ${specItem("Charging", v.charging)}
                    ${specItem("Status", v.status)}
                    ${specItem("Fleet ID", "GG-" + v.id.toUpperCase())}
                </div>
                <div class="gg-form-note mt-4"><i class="bi bi-info-circle me-1"></i> Specifications shown are demo/sample data for illustration.</div>
            </div>
        `;
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("fleetModal"));
        modal.show();
    }

    function specItem(label, value) {
        return `<div class="gg-spec-item"><div class="label">${label}</div><div class="value">${value}</div></div>`;
    }

    return { renderPage, openModal };
})();
