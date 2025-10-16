// ==========================================================
// LENIS SMOOTH SCROLL SETUP
// ==========================================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ==========================================================
// GSAP PLUGIN REGISTRATION
// ==========================================================
gsap.registerPlugin(ScrollTrigger, SplitText);

// ==========================================================
// INIT: HERO SECTION ANIMATION
// ==========================================================
function initHeroAnimation() {
  const heroTitle = document.querySelector(".hero-title");
  if (!heroTitle) return;

  const split = new SplitText(heroTitle, { type: "words, chars" });

  // Intro animation
  gsap.from(split.chars, {
    y: 800,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.05,
  });

  // Scroll zoom-out effect
  gsap.to(heroTitle, {
    scale: 13,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      endTrigger: ".new-arrival",
      end: "bottom top",
      scrub: true,
    },
  });
}

// ==========================================================
// INIT: INFINITE TICKER ANIMATION
// ==========================================================
function initTickerAnimation() {
  document.querySelectorAll(".ticker").forEach((ticker) => {
    const wrap = ticker.querySelector(".ticker-wrap");
    const text = wrap.querySelector(".ticker-text");
    const duration = parseFloat(ticker.dataset.duration) || 20;

    // Clone text for seamless looping
    wrap.append(text.cloneNode(true));

    // Continuous horizontal scroll
    const animation = gsap.to(wrap.querySelectorAll(".ticker-text"), {
      xPercent: -100,
      repeat: -1,
      duration,
      ease: "linear",
    });

    // Hover slow-motion effect
    ticker.addEventListener("mouseenter", () =>
      gsap.to(animation, { timeScale: 0.2, duration: 0.8, ease: "power2.out" })
    );
    ticker.addEventListener("mouseleave", () =>
      gsap.to(animation, { timeScale: 1, duration: 0.8, ease: "power2.out" })
    );
  });
}

// ==========================================================
// INIT: ARRIVAL SECTION SCROLL PIN
// ==========================================================
function initArrivalSection() {
  // Pin the section during scroll
  gsap.to(".new-arrival", {
    scrollTrigger: {
      trigger: ".new-arrival",
      start: "top top",
      endTrigger: ".whitespace",
      end: "bottom top",
      scrub: true,
      pin: true,
      pinSpacing: false,
    },
  });

  // Move ticker upward with scroll
  gsap.to(".new-arrival .ticker", {
    yPercent: -500,
    ease: "none",
    scrollTrigger: {
      trigger: ".new-arrival",
      start: "top top",
      endTrigger: ".whitespace",
      end: "bottom top",
      scrub: true,
    },
  });

  // Ensure Lenis & ScrollTrigger sync correctly
  ScrollTrigger.addEventListener("refreshInit", () => lenis.raf(0));
}

// ==========================================================
// INIT: COLLECTION SECTION ANIMATIONS
// ==========================================================
function initCollectionAnimation() {
  const title = document.querySelector(".collection-title h1");

  // Title letter-by-letter entrance
  if (title) {
    const split = new SplitText(title, { type: "words, chars" });
    gsap.from(split.chars, {
      y: 100,
      opacity: 0,
      stagger: 0.05,
      scrollTrigger: {
        trigger: ".collection",
        start: "top 70%",
        end: "top 20%",
        scrub: 1,
      },
    });
  }

  // Cards entrance animation
  gsap.from(".card-collection", {
    y: 200,
    opacity: 0,
    stagger: 0.2,
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".collection",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  initCardHoverEffect();
}

// ==========================================================
// INIT: CARD HOVER EFFECT
// ==========================================================
function initCardHoverEffect() {
  const cards = gsap.utils.toArray(".card-collection");

  cards.forEach((card) => {
    const imageDefault = card.querySelector(".image-default");
    const imageHover = card.querySelector(".image-hover");
    if (!imageDefault || !imageHover) return;

    gsap.set(imageHover, { yPercent: 100 });

    const tl = gsap.timeline({ paused: true });
    tl.to(imageHover, {
      yPercent: 0,
      duration: 0.5,
      ease: "power3.out",
    });

    card.addEventListener("mouseenter", () => tl.play());
    card.addEventListener("mouseleave", () => tl.reverse());
  });
}

// ==========================================================
// INIT: FOOTER FADE-IN (BONUS)
// ==========================================================
function initFooterAnimation() {
  gsap.from(".footer-container", {
    opacity: 0,
    y: 80,
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".footer",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.from(".footer-container-1 h1", {
    opacity: 0,
    y: 200,
    duration: 1.2,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".footer",
      start: "top 90%",
      toggleActions: "play none none reverse",
    },
  });
}

// ==========================================================
// DOM READY INITIALIZATION
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  initHeroAnimation();
  initTickerAnimation();
  initArrivalSection();
  initCollectionAnimation();
  initFooterAnimation();

  // Refresh all ScrollTriggers after assets fully loaded
  window.addEventListener("load", () => ScrollTrigger.refresh(true));
});
