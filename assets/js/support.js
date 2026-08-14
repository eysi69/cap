/* ===== Green GSM — support.js =====
 * Help center search, FAQ filtering, and the contact/support form.
 * Depends on api.js (getFaqs, submitSupportRequest).
 */

const Support = (() => {
    let allFaqs = [];
    let activeCategory = "All";

    const categories = [
        "All", "General Questions", "Rides & Services", "Payments", "Safety",
        "Drivers", "App Support", "Lost Items", "Account Help", "Sustainability",
    ];

    async function init(container) {
        try {
            allFaqs = await getFaqs();
        } catch {
            allFaqs = [];
        }
        render(container);
    }

    function render(container) {
        container.innerHTML = `
            <section class="gg-help-hero">
                <div class="container">
                    <h1>How can we help you?</h1>
                    <p>Search our support topics or browse by category. We're here to make your Green GSM experience smooth.</p>
                    <div class="gg-help-search">
                        <input type="search" id="faqSearch" placeholder="Search Green GSM support topics..." aria-label="Search support topics">
                        <button type="button" id="faqSearchBtn" aria-label="Search"><i class="bi bi-search"></i></button>
                    </div>
                    <div class="gg-cat-chips" id="faqCats" role="tablist">
                        ${categories.map(c => `<button class="gg-cat-chip ${c === 'All' ? 'active' : ''}" data-cat="${c}" role="tab">${c}</button>`).join("")}
                    </div>
                </div>
            </section>

            <section class="gg-section">
                <div class="container">
                    <div class="gg-faq-wrap" id="faqList"></div>
                </div>
            </section>
        `;

        container.querySelector("#faqSearch").addEventListener("input", (e) => filterFaqs(container, e.target.value));
        container.querySelector("#faqCats").addEventListener("click", (e) => {
            const btn = e.target.closest(".gg-cat-chip");
            if (!btn) return;
            activeCategory = btn.dataset.cat;
            container.querySelectorAll(".gg-cat-chip").forEach(c => c.classList.toggle("active", c.dataset.cat === activeCategory));
            filterFaqs(container, container.querySelector("#faqSearch").value);
        });

        filterFaqs(container, "");
    }

    function filterFaqs(container, query) {
        const q = (query || "").trim().toLowerCase();
        let list = allFaqs;
        if (activeCategory !== "All") list = list.filter(f => f.category === activeCategory);
        if (q) list = list.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));

        const wrap = container.querySelector("#faqList");
        if (!wrap) return;
        if (!list.length) {
            wrap.innerHTML = `<div class="gg-faq-empty"><i class="bi bi-search" style="font-size:2rem;"></i><p class="mt-3 mb-0">No support topics found. Try a different search or category.</p></div>`;
            return;
        }
        wrap.innerHTML = list.map(f => `
            <details class="gg-faq-item">
                <summary><span>${f.question}</span><i class="bi bi-plus-lg"></i></summary>
                <div class="gg-faq-answer">${f.answer}</div>
            </details>
        `).join("");
    }

    return { init, render };
})();

/* ===== Contact form ===== */
function initContactForm(formEl) {
    if (!formEl) return;
    formEl.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!validateContactForm(formEl)) return;

        const data = {
            fullName: formEl.fullName.value.trim(),
            email: formEl.email.value.trim(),
            topic: formEl.topic.value,
            message: formEl.message.value.trim(),
        };

        const submitBtn = formEl.querySelector("button[type=submit]");
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

        try {
            await submitSupportRequest(data);
            formEl.reset();
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("supportModal"));
            modal.show();
        } catch {
            alert("Something went wrong. Please try again.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
        }
    });
}

function validateContactForm(formEl) {
    let ok = true;
    const fields = ["fullName", "email", "topic", "message"];
    fields.forEach(name => {
        const field = formEl[name];
        const wrap = field.closest(".gg-field");
        const err = wrap.querySelector(".gg-error");
        let msg = "";
        if (!field.value.trim()) msg = "This field is required.";
        else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) msg = "Enter a valid email address.";
        else if (name === "message" && field.value.trim().length < 10) msg = "Message must be at least 10 characters.";
        if (msg) { ok = false; wrap.classList.add("invalid"); if (err) err.textContent = msg; }
        else { wrap.classList.remove("invalid"); }
    });
    return ok;
}
