// GSAP animations. Skipped if the visitor prefers reduced motion.
const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!noMotion && typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Hero headline slides up once on page load
  gsap.from('.hero h1 .line', { yPercent: 110, duration: 1, stagger: 0.15, ease: 'power4.out' });
  gsap.from('.hero-text, .hero-buttons', { opacity: 0, y: 30, duration: 0.8, delay: 0.7, stagger: 0.15 });

  // Fade-up for anything with the .reveal class
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 50, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  // Parallax on the hero and CTA backgrounds
  gsap.to('.hero-bg', { yPercent: 20, ease: 'none', scrollTrigger: { trigger: '.hero', scrub: true, start: 'top top', end: 'bottom top' } });
  gsap.to('.cta-bg', { yPercent: 15, ease: 'none', scrollTrigger: { trigger: '.cta', scrub: true } });

  // 3D tilt on program cards (desktop only)
  if (window.innerWidth > 1000) {
    document.querySelectorAll('.tilt').forEach(card => {
      card.addEventListener('mousemove', e => {
        const box = card.getBoundingClientRect();
        const x = (e.clientX - box.left) / box.width - 0.5;
        const y = (e.clientY - box.top) / box.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }
}

// Counters start when the stats enter the screen (works without GSAP too)
new IntersectionObserver((entries, observer) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('[data-count]').forEach(runCounter);
    observer.disconnect();
  }
}, { threshold: 0.4 }).observe(document.querySelector('.stats'));
