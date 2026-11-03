/* Forma 27 — interactions for the landing page and the registration flow.
   Everything works without GSAP; GSAP only adds entrance motion. */

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Nav: background on scroll ---------- */
const navbar = $("#navbar");
if (navbar) {
    const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Mobile menu ---------- */
const toggle = $("#menuToggle");
const links = $("#links");
if (toggle && links) {
    const close = () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
    };
    toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open);
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    links.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

/* ---------- Active section in nav ---------- */
const navLinks = $$(".links a");
if (navLinks.length && "IntersectionObserver" in window) {
    const map = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
            if (en.isIntersecting) {
                navLinks.forEach((a) => a.classList.remove("active"));
                map.get(en.target.id)?.classList.add("active");
            }
        });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ---------- Countdown (22 April 2027, 09:00 Lisbon = 08:00 UTC) ---------- */
const cd = $("#cd-d");
if (cd) {
    const target = Date.UTC(2027, 3, 22, 8, 0, 0);
    const pad = (n) => String(n).padStart(2, "0");
    let timer;
    const tick = () => {
        let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
        const d = Math.floor(s / 86400); s %= 86400;
        const h = Math.floor(s / 3600); s %= 3600;
        const m = Math.floor(s / 60); s %= 60;
        $("#cd-d").textContent = d;
        $("#cd-h").textContent = pad(h);
        $("#cd-m").textContent = pad(m);
        $("#cd-s").textContent = pad(s);
    };
    const start = () => { tick(); clearInterval(timer); timer = setInterval(tick, 1000); };
    start();
    // Pause while the tab is hidden.
    document.addEventListener("visibilitychange", () => document.hidden ? clearInterval(timer) : start());
}

/* ---------- Schedule tabs with sliding indicator ---------- */
const tabs = $$(".day-tab");
const ind = $(".tab-ind");
if (tabs.length) {
    const moveInd = (tab) => {
        if (!ind) return;
        ind.style.width = tab.offsetWidth + "px";
        ind.style.transform = `translateX(${tab.offsetLeft - 5}px)`;
    };
    const select = (tab) => {
        tabs.forEach((t) => {
            const on = t === tab;
            t.setAttribute("aria-selected", on);
            t.tabIndex = on ? 0 : -1;
            document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
        });
        moveInd(tab);
        if (window.gsap && !reduceMotion) {
            gsap.from(`#${tab.getAttribute("aria-controls")} .session`, { y: 14, autoAlpha: 0, duration: 0.45, stagger: 0.05, ease: "power2.out" });
        }
    };
    tabs.forEach((tab, i) => {
        tab.addEventListener("click", () => select(tab));
        tab.addEventListener("keydown", (e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
            select(next); next.focus();
        });
    });
    const initInd = () => moveInd(tabs.find((t) => t.getAttribute("aria-selected") === "true"));
    initInd();
    window.addEventListener("resize", initInd);
    document.fonts?.ready.then(initInd);
}

/* ---------- FAQ accordion (animated height) ---------- */
$$(".faq-q").forEach((q) => {
    const panel = document.getElementById(q.getAttribute("aria-controls"));
    q.addEventListener("click", () => {
        const open = q.getAttribute("aria-expanded") === "true";
        q.setAttribute("aria-expanded", !open);
        if (open) {
            panel.style.height = panel.scrollHeight + "px";
            requestAnimationFrame(() => { panel.style.height = "0px"; });
        } else {
            panel.style.height = panel.scrollHeight + "px";
            panel.addEventListener("transitionend", function done() {
                if (q.getAttribute("aria-expanded") === "true") panel.style.height = "auto";
                panel.removeEventListener("transitionend", done);
            });
        }
    });
});

/* ---------- Speaker card spotlight follows the cursor ---------- */
$$(".speaker").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
});

/* ---------- Entrance motion (GSAP, progressive enhancement) ---------- */
if (window.gsap && !reduceMotion) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    const heroLines = $$(".hero h1 .line > span");
    if (heroLines.length) {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(heroLines, { yPercent: 110, duration: 1.1, stagger: 0.12 })
          .from(".reveal-hero", { y: 22, autoAlpha: 0, duration: 0.8, stagger: 0.1 }, "-=0.75");
    }

    if (window.ScrollTrigger) {
        $$(".reveal").forEach((el) => {
            gsap.from(el, { y: 36, autoAlpha: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
        });
        ScrollTrigger.batch(".reveal-item", {
            start: "top 88%",
            once: true,
            onEnter: (batch) => gsap.from(batch, { y: 28, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }),
        });
        // Count stats up when they come into view.
        $$("[data-count]").forEach((el) => {
            const end = +el.dataset.count;
            const comma = el.dataset.format === "comma";
            const obj = { v: 0 };
            gsap.to(obj, {
                v: end, duration: 1.6, ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 90%", once: true },
                onUpdate: () => { const n = Math.round(obj.v); el.textContent = comma ? n.toLocaleString("en-US") : n; },
            });
        });
    }
}

/* ======================================================================
   Registration flow
   ====================================================================== */
const form = $("#regForm");
if (form) {
    const steps = $$(".step", form);
    const dots = $$(".step-dot", form);
    const status = $("#stepStatus");
    const labels = ["choose a ticket", "your details", "check and confirm"];
    let current = 1;

    // Preselect a tier from ?tier=online|standard|vip
    const want = new URLSearchParams(location.search).get("tier");
    if (want && $(`#tier-${want}`)) $(`#tier-${want}`).checked = true;

    const tier = () => form.querySelector('input[name="tier"]:checked');
    const wsCount = () => ({ online: 0, standard: 1, vip: 2 })[tier().value];
    const wsLabel = () => {
        const n = wsCount();
        if (n === 0) return "Not included";
        if (n === 2) return "Both workshops";
        return $("#workshop").value;
    };

    function updateOrder() {
        const t = tier();
        $("#o-name").textContent = `${t.dataset.name} pass`;
        $("#o-total").textContent = `€${t.dataset.price}`;
        const n = wsCount();
        $("#o-ws").textContent = n === 0 ? "Not included" : n === 1 ? "1 included" : "2 included";
        $("#wsField").hidden = n !== 1;
    }
    form.addEventListener("change", updateOrder);
    updateOrder();

    function show(n) {
        current = n;
        steps.forEach((s) => (s.hidden = +s.dataset.step !== n));
        dots.forEach((d) => {
            const k = +d.dataset.step;
            d.classList.toggle("done", k < n);
            d.classList.toggle("current", k === n);
        });
        status.textContent = `Step ${n} of 3: ${labels[n - 1]}`;
        const active = steps[n - 1];
        if (window.gsap && !reduceMotion) gsap.from(active, { x: 18, autoAlpha: 0, duration: 0.45, ease: "power3.out" });
        active.querySelector("h2").setAttribute("tabindex", "-1");
        active.querySelector("h2").focus({ preventScroll: true });
        if (form.getBoundingClientRect().top < 80) window.scrollTo({ top: window.scrollY + form.getBoundingClientRect().top - 110, behavior: reduceMotion ? "auto" : "smooth" });
    }

    // Inline validation: on blur, then live once a field has been flagged.
    const rules = {
        first: (v) => (v.trim().length < 1 ? "Please enter your first name." : ""),
        last: (v) => (v.trim().length < 1 ? "Please enter your last name." : ""),
        email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "Enter a valid email, like you@company.com." : ""),
    };
    function check(id) {
        const input = $("#" + id);
        const msg = rules[id](input.value);
        $(`#${id}-err`).textContent = msg;
        input.classList.toggle("invalid", !!msg);
        input.classList.toggle("valid", !msg);
        input.setAttribute("aria-invalid", !!msg);
        if (msg) input.setAttribute("aria-describedby", `${id}-err`);
        return !msg;
    }
    Object.keys(rules).forEach((id) => {
        const input = $("#" + id);
        input.addEventListener("blur", () => { if (input.value) check(id); });
        input.addEventListener("input", () => { if (input.classList.contains("invalid")) check(id); });
    });

    function fillReview() {
        $("#r-name").textContent = `${$("#first").value.trim()} ${$("#last").value.trim()}`;
        $("#r-email").textContent = $("#email").value.trim();
        $("#r-tier").textContent = `${tier().dataset.name} pass`;
        $("#r-ws").textContent = wsLabel();
        $("#r-total").textContent = `€${tier().dataset.price}`;
    }

    form.addEventListener("click", (e) => {
        if (e.target.closest("[data-back]")) return show(current - 1);
        if (!e.target.closest("[data-next]")) return;
        if (current === 2) {
            const results = Object.keys(rules).map(check);
            const firstBad = Object.keys(rules)[results.indexOf(false)];
            if (firstBad) return $("#" + firstBad).focus();
            fillReview();
        }
        show(current + 1);
    });

    // Pressing Enter in a text field moves forward instead of submitting early.
    form.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type !== "checkbox" && current < 3) {
            e.preventDefault();
            $(`.step[data-step="${current}"] [data-next]`).click();
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (current !== 3) return;
        if (!$("#terms").checked) {
            $("#terms-err").textContent = "Please accept the code of conduct and refund policy to continue.";
            return $("#terms").focus();
        }
        $("#terms-err").textContent = "";
        const btn = $("#submitBtn");
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner" aria-hidden="true"></span>Confirming…';

        setTimeout(() => {
            const code = "F27-" + Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);
            $("#s-first").textContent = $("#first").value.trim();
            $("#s-email").textContent = $("#email").value.trim();
            $("#s-name").textContent = `${$("#first").value.trim()} ${$("#last").value.trim()}`;
            $("#s-tier").textContent = tier().dataset.name;
            $("#s-ws").textContent = wsCount() === 1 ? $("#workshop").value.split(" · ")[1] : wsLabel();
            $("#s-code").textContent = code;
            drawCode(code);
            $("#flow").hidden = true;
            const ok = $("#success");
            ok.hidden = false;
            ok.focus();
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
            if (window.gsap && !reduceMotion) {
                gsap.from(".success > *", { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" });
            }
        }, 1100);
    });

    // Draws a decorative 21×21 ticket code from the code string.
    function drawCode(seedStr) {
        const svg = $("#code");
        let seed = [...seedStr].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
        const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
        const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#0b0b1a"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#0b0b1a"/>`;
        const inFinder = (x, y) => (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
        let cells = "";
        for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
            if (!inFinder(x, y) && rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1" fill="#0b0b1a"/>`;
        }
        svg.innerHTML = cells + finder(0, 0) + finder(14, 0) + finder(0, 14);
    }
}
