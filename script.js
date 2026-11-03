/* Scroll-reveal animations — progressive enhancement.
   Content is fully visible by default; GSAP only enhances when loaded and
   the visitor hasn't asked for reduced motion. No cards here by design. */
if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {

        // Hero intro — lines rise in.
        gsap.from(".hero .eyebrow, .hero-title, .hero-bottom", {
            y: 30,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12
        });

        // Service rows ease up as they enter.
        gsap.utils.toArray(".srv-row").forEach((row) => {
            gsap.from(row, {
                y: 40,
                autoAlpha: 0,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: { trigger: row, start: "top 82%" }
            });
        });

        // Statement band pops slightly.
        gsap.from(".band p", {
            scale: 0.94,
            autoAlpha: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: ".band", start: "top 75%" }
        });

        // Contact block.
        gsap.from(".contact > *", {
            y: 28,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: { trigger: ".contact", start: "top 78%" }
        });
    });
}
