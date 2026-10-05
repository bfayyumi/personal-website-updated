(() => {
    const preview = document.querySelector('#book-preview');
    if (!preview) return;

    const image = preview.querySelector('img');
    const caption = preview.querySelector('figcaption');
    const books = {
        republic: { src: 'assets/republic.jpg', alt: 'Cover of The Republic by Plato', author: 'Plato', width: 180, height: 278 },
        cave: { src: 'assets/allegory-of-the-cave.jpg', alt: 'Classical engraving of Plato’s Allegory of the Cave by Jan Saenredam', author: 'Plato · The Republic, Book VII', width: 240, height: 175 },
        'divine-comedy': { src: 'assets/divine-comedy.jpg', alt: 'Cover of The Divine Comedy by Dante Alighieri', author: 'Dante Alighieri', width: 180, height: 270 },
        'paradise-lost': { src: 'assets/paradise-lost.jpg', alt: 'Cover of Paradise Lost by John Milton', author: 'John Milton', width: 180, height: 270 },
        meditations: { src: 'assets/meditations.jpg', alt: 'Cover of Meditations by Marcus Aurelius', author: 'Marcus Aurelius', width: 180, height: 270 }
    };
    let active = null;
    let pointerType = '';
    let revision = 0;

    // Start loading covers before the first hover; all images are served locally.
    Object.values(books).forEach(book => {
        const preload = new Image();
        preload.src = book.src;
    });

    function positionPreview() {
        if (!active) return;
        const anchor = active.getBoundingClientRect();
        const width = preview.offsetWidth;
        const height = preview.offsetHeight;
        const margin = 16;
        const gap = 14;
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight;
        let left = anchor.left;
        let top = anchor.bottom + gap;
        if (top + height > viewportHeight - margin) top = anchor.top - height - gap;
        left = Math.max(margin, Math.min(left, viewportWidth - width - margin));
        top = Math.max(margin, Math.min(top, viewportHeight - height - margin));
        preview.style.left = `${left}px`;
        preview.style.top = `${top}px`;
    }

    function hide() {
        revision++;
        if (active) active.setAttribute('aria-expanded', 'false');
        active = null;
        preview.classList.remove('is-visible');
        preview.setAttribute('aria-hidden', 'true');
    }

    async function show(trigger) {
        const book = books[trigger.dataset.book];
        if (!book || active === trigger) return;
        if (active) active.setAttribute('aria-expanded', 'false');
        active = trigger;
        const currentRevision = ++revision;
        preview.classList.remove('is-visible');
        preview.setAttribute('aria-hidden', 'true');
        preview.classList.toggle('is-illustration', trigger.dataset.book === 'cave');
        image.src = book.src;
        image.alt = book.alt;
        image.width = book.width;
        image.height = book.height;
        caption.textContent = book.author;
        try {
            await image.decode();
        } catch {
            if (currentRevision === revision) hide();
            return;
        }
        // A fast move between titles must never reveal a stale cover.
        if (currentRevision !== revision) return;
        positionPreview();
        trigger.setAttribute('aria-expanded', 'true');
        preview.setAttribute('aria-hidden', 'false');
        preview.classList.add('is-visible');
    }

    document.querySelectorAll('.book-trigger').forEach(trigger => {
        trigger.addEventListener('pointerenter', event => {
            if (event.pointerType === 'mouse' || event.pointerType === 'pen') show(trigger);
        });
        trigger.addEventListener('pointerleave', event => {
            if (event.pointerType !== 'touch' && active === trigger) hide();
        });
        trigger.addEventListener('pointerdown', event => { pointerType = event.pointerType; });
        trigger.addEventListener('focus', () => {
            if (pointerType !== 'touch') show(trigger);
        });
        trigger.addEventListener('blur', () => {
            if (active === trigger) hide();
        });
        trigger.addEventListener('click', event => {
            if (pointerType === 'touch' && event.detail > 0 && active === trigger) hide();
            else show(trigger);
        });
    });

    document.addEventListener('pointerdown', event => {
        if (!event.target.closest('.book-trigger')) hide();
    });
    document.addEventListener('keydown', event => {
        pointerType = '';
        if (event.key === 'Escape') hide();
    });
    window.addEventListener('scroll', () => {
        if (!active) return;
        const anchor = active.getBoundingClientRect();
        if (anchor.bottom < 0 || anchor.top > window.innerHeight) hide();
        else positionPreview();
    }, { passive: true });
    window.addEventListener('resize', hide);
})();
