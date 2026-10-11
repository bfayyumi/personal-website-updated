(() => {
    const figure = document.querySelector('.reach');
    if (!figure) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let queued = false;

    // 0 when the painting first scrolls into view, 1 at the very bottom of the page.
    function update() {
        queued = false;
        if (reducedMotion.matches) {
            figure.style.setProperty('--reach', '1');
            return;
        }
        const scroll = window.scrollY;
        const start = scroll + figure.getBoundingClientRect().top - window.innerHeight;
        const end = document.documentElement.scrollHeight - window.innerHeight;
        const progress = end > start ? Math.min(1, Math.max(0, (scroll - start) / (end - start))) : 1;
        const eased = progress * progress * (3 - 2 * progress);
        figure.style.setProperty('--reach', eased.toFixed(4));
    }

    function queue() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(update);
    }

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    reducedMotion.addEventListener('change', queue);
    update();
})();
