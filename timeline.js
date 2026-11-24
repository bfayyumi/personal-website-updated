// Writes the timeline in line by line, like the home page, as each part scrolls into view.
(() => {
    const root = document.documentElement;
    if (!root.classList.contains('reveal-on-scroll')) return;

    const lines = document.querySelectorAll('.timeline .entry-years, .timeline .entry-head, .timeline .paragraph, .timeline .entry-link, .timeline .entry-break');
    let firstBatch = true;

    const observer = new IntersectionObserver(entries => {
        const shown = entries.filter(entry => entry.isIntersecting).map(entry => entry.target);
        // Same rhythm as the home page: a short pause, then each line 50ms after the one before.
        const start = firstBatch ? 0.1 : 0;
        firstBatch = false;
        shown.forEach((line, i) => {
            line.style.animationDelay = `${(start + i * 0.05).toFixed(2)}s`;
            line.classList.add('is-written');
            observer.unobserve(line);
        });
    }, { rootMargin: '0px 0px -8% 0px' });

    lines.forEach(line => observer.observe(line));
})();
