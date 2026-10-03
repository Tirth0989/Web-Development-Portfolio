# Radius Photography Portfolio

Radius is a responsive multi-page photography portfolio built for **COMP602 Website Development**. It combines semantic HTML, custom CSS, Bootstrap, and vanilla JavaScript to present six visual projects through an animated editorial-style interface.

## Features

- Responsive navigation and Bootstrap grid layouts
- Animated loading screen and split-text hero entrance
- Scroll-triggered content and image reveals
- Parallax hero treatment and animated statistics
- Mouse and touch-enabled project carousel
- Live portfolio filtering by category
- Six individual project case-study pages
- Responsive embedded video section
- Contact form integration through Formspree
- Descriptive image alternative text and lazy loading
- Mobile, tablet, and desktop breakpoints

## Pages

| Page | Description |
| --- | --- |
| [`index.html`](index.html) | Homepage with animated hero, statistics, marquee, and featured project carousel |
| [`work.html`](work.html) | Filterable portfolio grid containing all six projects |
| [`about.html`](about.html) | Studio profile, capabilities, services, and embedded showreel |
| [`contact.html`](contact.html) | Contact details and validated inquiry form |
| [`project-1.html`](project-1.html) | Silent Geometries - architecture series |
| [`project-2.html`](project-2.html) | Meridian - landscape series |
| [`project-3.html`](project-3.html) | Passage - street photography series |
| [`project-4.html`](project-4.html) | Matter - editorial series |
| [`project-5.html`](project-5.html) | Vigil - portrait series |
| [`project-6.html`](project-6.html) | Underworld - nature series |

## Technology

- HTML5 with semantic page structure
- CSS3 custom properties, animations, transitions, Flexbox, and responsive media queries
- Bootstrap 5.3.3 navigation, grid, and utility classes
- Vanilla JavaScript using `IntersectionObserver`, `requestAnimationFrame`, and pointer events
- Google Fonts (Inter)
- Pexels-hosted photography
- Formspree contact-form delivery

## JavaScript interactions

The shared script in [`js/script.js`](js/script.js) provides:

1. Loading-screen animation
2. Split-character hero reveal
3. RequestAnimationFrame-throttled parallax
4. Scrolled navigation state
5. IntersectionObserver content reveals
6. Clip-path image reveals
7. Animated counters
8. Mouse and touch carousel dragging
9. Portfolio category filtering
10. Context-aware project back navigation

## Run locally

No build step or package installation is required.

1. Clone or download the repository.
2. Open the project folder in Visual Studio Code.
3. Start a local web server, such as the **Live Server** extension.
4. Open `index.html` through the local server.

You can also use Python:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

An internet connection is required for Bootstrap, Google Fonts, Pexels images, and the embedded video.

## Configuration

- The contact form uses a Formspree endpoint in `contact.html`. Replace the form ID with your own before production deployment.
- The showreel in `about.html` uses an example YouTube video ID. Replace it with the intended portfolio video.
- The displayed email and social handle are studio placeholders and can be replaced throughout the HTML files.

## Deployment

Because this is a static website, it can be deployed through GitHub Pages:

1. Open the repository's **Settings**.
2. Select **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder.
5. Save the configuration.

## Project structure

```text
.
├── index.html
├── work.html
├── about.html
├── contact.html
├── project-1.html ... project-6.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

## Privacy

Student identification numbers and operating-system metadata from the original submission archive are excluded from this public portfolio repository.

## Academic integrity

This repository is published as a personal learning portfolio. It should not be copied or submitted as another student's work.
