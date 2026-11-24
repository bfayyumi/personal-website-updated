// Hovering a site link shows a screenshot of that site, in the same card as the book covers on the home page.
(() => {
    const preview = document.querySelector('#site-preview');
    if (!preview) return;

    const image = preview.querySelector('img');
    const caption = preview.querySelector('figcaption');
    const sites = {
        aurify: { src: '../assets/sites/aurify.jpg', alt: 'The Aurify homepage', caption: 'getaurify.com' },
        nihilo: { src: '../assets/sites/nihilo.jpg', alt: 'The Nihilo homepage', caption: 'trynihilo.com' }
    };
    let active = null;
    let revision = 0;

    Object.values(sites).forEach(site => {
        const preload = new Image();
        preload.src = site.src;
    });

    function position() {
        if (!active) return;
        const anchor = active.getBoundingClientRect();
        const margin = 16;
        const gap = 12;
        const width = preview.offsetWidth;
        const height = preview.offsetHeight;
        let left = anchor.left;
        let top = anchor.bottom + gap;
        if (top + height > window.innerHeight - margin) top = anchor.top - height - gap;
        left = Math.max(margin, Math.min(left, document.documentElement.clientWidth - width - margin));
        top = Math.max(margin, Math.min(top, window.innerHeight - height - margin));
        preview.style.left = `${left}px`;
        preview.style.top = `${top}px`;
    }

    function hide() {
        revision++;
        active = null;
        preview.classList.remove('is-visible');
        preview.hidden = true;
    }

    async function show(link) {
        const site = sites[link.dataset.site];
        if (!site || active === link) return;
        active = link;
        const current = ++revision;
        preview.classList.remove('is-visible');
        image.src = site.src;
        image.alt = site.alt;
        caption.textContent = site.caption;
        try {
            await image.decode();
        } catch {
            if (current === revision) hide();
            return;
        }
        if (current !== revision) return;
        preview.hidden = false;
        position();
        preview.classList.add('is-visible');
    }

    // Mouse and keyboard only: on a phone, tapping the link should just open the site.
    document.querySelectorAll('[data-site]').forEach(link => {
        link.addEventListener('pointerenter', event => {
            if (event.pointerType === 'mouse' || event.pointerType === 'pen') show(link);
        });
        link.addEventListener('pointerleave', () => { if (active === link) hide(); });
        link.addEventListener('focus', () => { if (link.matches(':focus-visible')) show(link); });
        link.addEventListener('blur', () => { if (active === link) hide(); });
    });

    document.addEventListener('keydown', event => { if (event.key === 'Escape') hide(); });
    window.addEventListener('scroll', () => {
        if (!active) return;
        const anchor = active.getBoundingClientRect();
        if (anchor.bottom < 0 || anchor.top > window.innerHeight) hide();
        else position();
    }, { passive: true });
    window.addEventListener('resize', hide);
})();
