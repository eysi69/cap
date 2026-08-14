/* ===== Green GSM — map.js =====
 * Leaflet + OpenStreetMap for Service Areas and Contact pages.
 * Depends on api.js (getServiceAreas).
 */

const GMap = (() => {
    let map = null;
    let markers = [];
    let areaData = [];

    async function initServiceAreas(container) {
        try { areaData = await getServiceAreas(); } catch { areaData = []; }

        container.innerHTML = `
            <section class="gg-section-alt gg-section">
                <div class="container">
                    <div class="gg-header-center">
                        <span class="gg-eyebrow">Service Areas</span>
                        <h2 class="gg-section-title">Green GSM in Metro Manila</h2>
                        <p class="gg-section-lead">Explore the areas where Green GSM mobility services are planned or supported. Coverage is expanding across the metro.</p>
                    </div>
                    <div class="gg-map-layout">
                        <div class="gg-map-wrap" id="mapWrap">
                            <div id="serviceMap" role="application" aria-label="Service area map"></div>
                        </div>
                        <div class="gg-area-panel" id="areaPanel">
                            <h3>Metro Manila Coverage</h3>
                            <p>Tap an area to focus it on the map. Supported areas have active coverage; planned areas are expanding soon.</p>
                            <ul class="gg-area-list" id="areaList"></ul>
                        </div>
                    </div>
                    <div class="text-center mt-4">
                        <span class="gg-demo-note"><i class="bi bi-info-circle"></i> Map data is demo/sample for illustration. No live tracking is shown.</span>
                    </div>
                </div>
            </section>
        `;

        renderAreaList();
        // Defer map init until the container is in the DOM and visible
        requestAnimationFrame(() => initMap("serviceMap"));
    }

    function renderAreaList() {
        const list = document.getElementById("areaList");
        if (!list) return;
        list.innerHTML = areaData.map((a, i) => `
            <li class="gg-area-item" data-idx="${i}">
                <span class="gg-area-dot" style="${a.status === 'Planned' ? 'background:var(--gg-warning);box-shadow:0 0 0 4px rgba(245,158,11,.15);' : ''}"></span>
                <div>
                    <div class="gg-area-name">${a.name}</div>
                    <div class="gg-area-meta">${a.status} · ${a.note}</div>
                </div>
            </li>
        `).join("");

        list.addEventListener("click", (e) => {
            const item = e.target.closest(".gg-area-item");
            if (!item) return;
            const idx = parseInt(item.dataset.idx, 10);
            focusArea(idx);
            list.querySelectorAll(".gg-area-item").forEach(el => el.classList.remove("active"));
            item.classList.add("active");
        });
    }

    function initMap(elId) {
        const el = document.getElementById(elId);
        if (!el) return;
        if (map) { map.remove(); map = null; markers = []; }

        map = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView([14.58, 121.0], 11);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        const greenIcon = L.divIcon({
            html: '<div style="width:22px;height:22px;border-radius:50%;background:#0f7c5c;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);"></div>',
            className: "gg-marker",
            iconSize: [22, 22],
            iconAnchor: [11, 11],
        });
        const plannedIcon = L.divIcon({
            html: '<div style="width:22px;height:22px;border-radius:50%;background:#f59e0b;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);"></div>',
            className: "gg-marker",
            iconSize: [22, 22],
            iconAnchor: [11, 11],
        });

        areaData.forEach(a => {
            const icon = a.status === "Planned" ? plannedIcon : greenIcon;
            const m = L.marker([a.lat, a.lng], { icon }).addTo(map);
            m.bindPopup(`<h4>${a.name}</h4><p><strong>${a.status}</strong><br>${a.note}</p>`);
            markers.push({ marker: m, area: a });
        });

        setTimeout(() => map.invalidateSize(), 200);
    }

    function focusArea(idx) {
        const a = areaData[idx];
        if (!map || !a) return;
        map.flyTo([a.lat, a.lng], 13, { duration: .8 });
        markers[idx].marker.openPopup();
    }

    function initContactMap(elId, lat = 14.58, lng = 121.0) {
        const el = document.getElementById(elId);
        if (!el) return;
        const m = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView([lat, lng], 11);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(m);
        L.marker([lat, lng], {
            icon: L.divIcon({
                html: '<div style="width:26px;height:26px;border-radius:50%;background:#0f7c5c;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);"></div>',
                className: "gg-marker",
                iconSize: [26, 26],
                iconAnchor: [13, 13],
            }),
        }).addTo(m).bindPopup("<h4>Green GSM</h4><p>Metro Manila, Philippines</p>");
        setTimeout(() => m.invalidateSize(), 200);
        return m;
    }

    return { initServiceAreas, initContactMap };
})();
