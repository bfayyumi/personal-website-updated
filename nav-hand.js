(() => {
    const hand = document.querySelector('.nav-hand');
    if (!hand) return;

    const nav = hand.parentElement;
    const rows = [...nav.querySelectorAll('.nav-item-row')];
    const current = rows.find(row => row.querySelector('.nav-link.active')) || rows[0];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let target = current;
    let hovering = false;
    let x = 0;
    let y = null;
    let vx = 0;
    let vy = 0;
    let frame = 0;

    function goal() {
        // The fingertip sits just under half way down the image; line it up with the row's centre.
        return {
            x: hovering ? 5 : 0,
            y: target.offsetTop + target.offsetHeight / 2 - hand.offsetHeight * 0.475
        };
    }

    function render() {
        hand.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    }

    function step() {
        const g = goal();
        // A slightly underdamped spring, so the hand settles with a small overshoot.
        vx = (vx + (g.x - x) * 0.14) * 0.7;
        vy = (vy + (g.y - y) * 0.12) * 0.72;
        x += vx;
        y += vy;
        if (Math.abs(g.y - y) < 0.05 && Math.abs(vy) < 0.05 && Math.abs(g.x - x) < 0.05 && Math.abs(vx) < 0.05) {
            x = g.x;
            y = g.y;
            frame = 0;
        } else {
            frame = requestAnimationFrame(step);
        }
        render();
    }

    function pointAt(row, isHover) {
        target = row;
        hovering = isHover;
        if (y === null || reducedMotion.matches) {
            ({ x, y } = goal());
            vx = vy = 0;
            render();
            return;
        }
        if (!frame) frame = requestAnimationFrame(step);
    }

    rows.forEach(row => {
        row.addEventListener('pointerenter', () => pointAt(row, true));
        row.addEventListener('focus', () => pointAt(row, true));
        row.addEventListener('blur', () => pointAt(current, false));
    });
    nav.addEventListener('pointerleave', () => pointAt(current, false));
    window.addEventListener('resize', () => {
        y = null;
        pointAt(target, hovering);
    });

    pointAt(current, false);
})();
