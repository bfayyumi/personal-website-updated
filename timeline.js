// Writes the first screen of the timeline in line by line, like the home page.
// Everything further down is simply there when you scroll to it.
(() => {
    const root = document.documentElement;
    if (!root.classList.contains('write-in')) return;

    // Coming from another page of the site, the same writing just runs twice as fast.
    const pace = root.classList.contains('from-site') ? 0.5 : 1;
    const lines = document.querySelectorAll('.timeline .entry-years, .timeline .entry-head, .timeline .paragraph, .timeline .entry-link, .timeline .entry-break');
    let order = 0;

    lines.forEach(line => {
        if (line.getBoundingClientRect().top < window.innerHeight) {
            // Same rhythm as the home page: a short pause, then each line 50ms after the one before.
            line.style.animationDelay = `${((0.1 + order * 0.05) * pace).toFixed(3)}s`;
            line.classList.add('is-written');
            order++;
        } else {
            line.classList.add('is-shown');
        }
    });
})();
