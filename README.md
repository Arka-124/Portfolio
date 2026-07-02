# Arka Datta — Portfolio

Personal portfolio site for **Arka Datta**, Full-Stack Web Developer & Robotics Engineer.
A bold, brutalist-inspired, single-page portfolio built with vanilla HTML, CSS, and JavaScript.

🔗 **Live site:** [arka-124.github.io/portfolio](#) 
---

## Preview


---

## Features

- **Hero section** with massive typography, a photo cutout, and a Three.js liquid-glass button
- **Custom cursor** with hover-state scaling on interactive elements
- **Infinite scrolling marquee** of core technologies
- **GSAP scroll-triggered parallax** on the hero and footer wordmark
- **Featured projects grid** with hover-scale cards
- **Full-bleed 16:9 "About" section** with an overlaid two-column layout (Education/Experience + Languages/Software/Contact/Interests)
- **Creative stack grid** — interactive, responsive logo grid with hover effects
- **Scroll-reveal animations** via the Intersection Observer API
- **Dedicated contact page** with a brutalist border-gap grid layout
- Fully responsive across desktop, tablet, and mobile

---

## Tech Stack

- **Structure:** HTML5
- **Styling:** CSS3 (Grid & Flexbox, custom properties, no framework)
- **Interactivity:** Vanilla JavaScript (ES6+)
- **Animation:** [GSAP](https://gsap.com/) + ScrollTrigger, CSS keyframes, Intersection Observer
- **3D/Graphics:** [Three.js](https://threejs.org/) (liquid-glass button, fluid glass background)
- **Fonts:** Space Grotesk / Archivo Black, Inter, Playfair Display (Google Fonts)
- **Deployment:** GitHub Pages

---

## Project Structure

```
├── index.html          # Main single-page site (hero, projects, experience, stack, footer)
├── contact.html         # Dedicated contact page
├── styles.css            # Styles for index.html
├── contact.css           # Styles for contact.html
├── cursor.css             # Custom cursor styles
├── cursor.js              # Custom cursor behavior
├── script.js               # Scroll-reveal + footer year logic
├── images/                  # Photos, backgrounds, icons
└── logo/                     # Favicon / logo assets
```

---

## Running Locally

No build step required — it's plain HTML/CSS/JS.

```bash
git clone https://github.com/Arka-124/<repo-name>.git
cd <repo-name>
```

Then either:
- Open `index.html` directly in your browser, **or**
- Serve it locally for a cleaner experience (recommended, avoids relative-path issues):

```bash
npx serve
```

---

## Sections

1. **Hero** — Name, role, and quick tech chips
2. **Marquee** — Scrolling banner of core technologies
3. **Featured Projects** — AI chatbot, automated toll gate, 6-DOF robotic arm, custom car brand site
4. **Experience & Education** — Academic background, achievements, internships, certifications
5. **Creative Stack** — Interactive logo grid of tools and languages
6. **Footer** — Contact links (GitHub, LinkedIn, Email)

---

## Contact

- **Email:** [arkadatta1531@gmail.com](mailto:arkadatta1531@gmail.com)
- **LinkedIn:** [/in/arka-datta-88a961381](https://www.linkedin.com/in/arka-datta-88a961381/)
- **GitHub:** [@Arka-124](https://github.com/Arka-124)
- **Instagram:** [@notagain.arkaaa](https://www.instagram.com/notagain.arkaaa)

---

## License

This project is personal portfolio content. Feel free to reference the code structure, but please don't reuse the personal content or design as your own.
