# WebLivo — portfolio

Hand-coded websites, landing pages and HTML email by **WebLivo**: plain HTML, CSS and JavaScript, no page builders.

**Live site:** https://baseline-portfolio.vercel.app

## Projects

### Forma 27 — event website
`work/event/` · [Live demo](https://baseline-portfolio.vercel.app/work/event/)

A conference website for a fictional design and technology event in Lisbon.

- Hero with date, venue and a live countdown
- Speakers grid, two-day schedule with keyboard-accessible tabs, ticket tiers with an early-bird deadline, venue info and FAQ
- Three-step registration (`register.html`): ticket choice, details with inline validation, review, then a confirmation ticket
- Scroll animations with GSAP and ScrollTrigger; they respect `prefers-reduced-motion`, and the page works without them
- Responsive down to 375px wide

### HTML email signature
`work/email-signature/` · [Live demo](https://baseline-portfolio.vercel.app/work/email-signature/)

An email signature for a fictional self-storage company.

- Table layout with inline CSS so it renders the same in Gmail, Outlook and Apple Mail
- No images, so nothing is blocked or broken in email clients
- One-click copy as rich HTML, plus code view and download

### WebLivo studio site
`index.html`, `styles.css`, `script.js` · [Live](https://baseline-portfolio.vercel.app)

The main WebLivo site: services, process and contact.

## Stack

HTML5, CSS3 (custom properties, grid, flexbox), vanilla JavaScript, GSAP. Deployed on Vercel.

## Run locally

No build step. Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

---

The companies and people in these samples are fictional.
