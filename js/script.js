/**
 * RADIUS PHOTOGRAPHY PORTFOLIO — script.js
 * Description: All interactive JS for animations and features.
 *
 * Features:
 *  1. Loading screen       — cinematic reveal before page appears
 *  2. Split text reveal    — hero title characters slide up cleanly
 *  3. Parallax hero        — smooth RAF-throttled background scroll
 *  4. Navbar scroll effect — opacity changes on scroll
 *  5. Scroll reveal        — IntersectionObserver fade+slide
 *  6. Clip-path reveals    — images wipe in from left
 *  7. Animated counters    — ease-out count-up on scroll
 *  8. Drag carousel        — mouse + touch drag on home page
 *  9. Work filter          — category show/hide with transitions
 * 10. Smart back link      — referrer-based routing on detail pages
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ── 1. LOADING SCREEN ────────────────────────────────────────
   * Full-screen black overlay fades out after 1.3s.
   * The CSS loader-bar animation plays during the wait.
   * Page content is revealed underneath once loader fades.
   */
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("loader--out");
      setTimeout(() => loader.remove(), 850);
    }, 1300);
  }


  /* ── 2. SPLIT TEXT HERO REVEAL ────────────────────────────────
   * Splits the hero title into individual characters.
   * Each gets a .split-char span, then .char-visible is added
   * with a staggered setTimeout to animate each letter up.
   *
   * Spaces are preserved as &nbsp; inside zero-width spans.
   * Starts at 1.1s so loader is well underway before it fires.
   * 55ms per character — fast enough to feel snappy, slow enough
   * to see each letter individually.
   */
  const splitTarget = document.querySelector(".hero-title[data-split]");
  if (splitTarget) {
    const chars = splitTarget.textContent.trim().split("");

    splitTarget.innerHTML = chars.map((ch) =>
      ch === " "
        ? `<span class="split-char" style="display:inline-block;width:0.3em">&nbsp;</span>`
        : `<span class="split-char">${ch}</span>`
    ).join("");

    const charEls = splitTarget.querySelectorAll(".split-char");
    charEls.forEach((el, i) => {
      setTimeout(() => el.classList.add("char-visible"), 1100 + i * 55);
    });
  }


  /* ── 3. PARALLAX HERO ─────────────────────────────────────────
   * Moves the hero background at 35% of scroll speed.
   * Uses translateY on the .hero-bg element (which is already
   * scale(1.1) in CSS to prevent edge gaps).
   *
   * RAF throttle: only one rAF scheduled at a time so we don't
   * stack dozens of frames on fast scrolls.
   *
   * Capped at 300px so on very long pages it doesn't over-shift.
   */
  const heroBg = document.querySelector(".hero-bg");
  if (heroBg) {
    let rafPending = false;

    const updateParallax = () => {
      const offset = Math.min(window.scrollY * 0.35, 300);
      // Use transform3d to keep it on the GPU compositor layer
      heroBg.style.transform = `scale(1.1) translate3d(0, ${offset}px, 0)`;
      rafPending = false;
    };

    window.addEventListener("scroll", () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateParallax);
      }
    }, { passive: true });
  }


  /* ── 4. NAVBAR SCROLL EFFECT ──────────────────────────────────
   * Toggles .scrolled on the navbar after 60px of scroll.
   * CSS handles background opacity change with transition.
   * Uses passive listener for better scroll performance.
   */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const updateNav = () => navbar.classList.toggle("scrolled", window.scrollY > 60);
    window.addEventListener("scroll", updateNav, { passive: true });
    updateNav(); // Set correct state on initial load
  }


  /* ── 5. SCROLL REVEAL ─────────────────────────────────────────
   * Watches all .reveal elements with IntersectionObserver.
   * When 12% enters the viewport, .is-visible is added.
   * CSS transition handles the fade + translateY animation.
   *
   * rootMargin -40px: elements must be 40px inside the
   * viewport before triggering, avoiding edge-of-screen pops.
   *
   * Fallback for older browsers: staggered setTimeout reveal.
   */
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    const revealObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target); // Trigger once only
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach((el) => revealObs.observe(el));
  } else {
    revealItems.forEach((el, i) => setTimeout(() => el.classList.add("is-visible"), i * 60));
  }


  /* ── 6. CLIP-PATH IMAGE REVEALS ───────────────────────────────
   * Elements with .clip-reveal are hidden via CSS clip-path.
   * When they enter the viewport, .clip-visible removes the clip
   * and CSS transition creates a smooth left-to-right wipe.
   */
  const clipItems = document.querySelectorAll(".clip-reveal");
  if ("IntersectionObserver" in window && clipItems.length) {
    const clipObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("clip-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );
    clipItems.forEach((el) => clipObs.observe(el));
  }


  /* ── 7. ANIMATED COUNTERS ─────────────────────────────────────
   * Counts up from 0 to [data-count] with ease-out cubic curve.
   * Uses requestAnimationFrame for smooth animation.
   * Fires once when 50% of the element is visible.
   *
   * Example: <span data-count="120" data-suffix="+">0</span>
   */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el       = entry.target;
          const target   = parseInt(el.getAttribute("data-count"), 10);
          const suffix   = el.getAttribute("data-suffix") || "";
          const duration = 1600; // ms
          const t0       = performance.now();

          function tick(now) {
            const elapsed  = now - t0;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic: decelerates as it approaches target
            const eased    = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          counterObs.unobserve(el); // Count once only
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterObs.observe(c));
  }


  /* ── 8. DRAG-TO-SCROLL CAROUSEL ───────────────────────────────
   * Makes the project carousel draggable with mouse and touch.
   * .is-dragging class disables scroll-behavior: smooth on the
   * container so drag feels instant, not laggy.
   * Walk multiplier 1.5 gives a natural drag speed.
   */
  const carousel = document.getElementById("projectScroll");
  if (carousel) {
    let isDragging  = false;
    let startX      = 0;
    let startScroll = 0;

    carousel.addEventListener("mousedown", (e) => {
      isDragging  = true;
      startX      = e.pageX - carousel.offsetLeft;
      startScroll = carousel.scrollLeft;
      carousel.classList.add("is-dragging");
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      carousel.classList.remove("is-dragging");
    });

    carousel.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x    = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      carousel.scrollLeft = startScroll - walk;
    });

    // Touch support
    carousel.addEventListener("touchstart", (e) => {
      startX      = e.touches[0].pageX;
      startScroll = carousel.scrollLeft;
    }, { passive: true });

    carousel.addEventListener("touchmove", (e) => {
      carousel.scrollLeft = startScroll + (startX - e.touches[0].pageX);
    }, { passive: true });
  }


  /* ── 9. PROJECT FILTER ────────────────────────────────────────
   * Filters the project grid by category on the projects page.
   *
   * FIX for left-then-right jump bug:
   * The old code faded cards out slowly (380ms) while they still
   * occupied grid space, then removed them — causing a grid reflow
   * mid-animation that made cards appear to jump sideways.
   *
   * New approach:
   *   Step 1 — Instantly hide ALL cards with d-none (no transition).
   *            This clears the layout immediately with no jump.
   *   Step 2 — Un-hide matching cards, then fade them in with a
   *            staggered delay so they appear one after another.
   */
  const filterBtns = document.querySelectorAll("[data-filter]");
  const workCards  = document.querySelectorAll(".work-card[data-category]");

  if (filterBtns.length && workCards.length) {

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        // Update active button state
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Step 1: Hide every card instantly — no transition, no delay.
        // This removes all cards from the layout at once so the grid
        // doesn't reflow partially and cause cards to jump sideways.
        workCards.forEach((card) => {
          const col = card.parentElement;
          col.style.transition = "none";
          col.style.opacity    = "0";
          col.classList.add("d-none");
        });

        // Step 2: Reveal matching cards with a staggered fade-in.
        // requestAnimationFrame ensures the browser has painted the
        // fully-hidden state before we start showing cards again.
        requestAnimationFrame(() => {
          let staggerIndex = 0;

          workCards.forEach((card) => {
            const col   = card.parentElement;
            const match = filter === "all" || card.getAttribute("data-category") === filter;

            if (match) {
              // Remove d-none so the card re-enters the layout
              col.classList.remove("d-none");
              col.style.opacity   = "0";
              col.style.transform = "translateY(18px)";

              // Stagger each card's fade-in by 70ms
              const delay = staggerIndex * 70;
              setTimeout(() => {
                col.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                col.style.opacity    = "1";
                col.style.transform  = "translateY(0)";
              }, delay);

              staggerIndex++;
            }
          });
        });

      });
    });
  }


  /* ── 10. SMART BACK LINK ───────────────────────────────────────
   * On project pages, routes ← BACK intelligently.
   * Goes to work.html if user came from there,
   * otherwise index.html as the safe default.
   */
  const backLink = document.getElementById("backLink");
  if (backLink) {
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      if (ref && ref.origin === window.location.origin) {
        if      (ref.pathname.includes("work.html"))   backLink.href = "work.html";
        else if (ref.pathname.includes("index.html") || ref.pathname.endsWith("/")) backLink.href = "index.html";
        else backLink.href = "javascript:history.back()";
      } else {
        backLink.href = "index.html";
      }
    } catch {
      backLink.href = "index.html";
    }
  }

}); // end DOMContentLoaded
