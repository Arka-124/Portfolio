document.addEventListener('DOMContentLoaded', () => {

  /* Footer year */
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* Scroll-reveal — .reveal / .active */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* Project cards — click to open detail page
     Set each card's `data-link` attribute (in index.html) to its detail
     page URL. Cards with no link set are left as-is (no navigation). */
  document.querySelectorAll('.project-card[data-link], .marquee-card[data-link]').forEach(card => {
    const url = card.getAttribute('data-link');
    if (!url) return; // no link set yet — skip

    card.addEventListener('click', () => {
      window.location.href = url;
    });
  });

});
