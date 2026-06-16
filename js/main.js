window.addEventListener("load", () => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), wheelMultiplier: 1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    document.body.classList.add('loaded');

    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursorDot.style.left = mx + 'px'; cursorDot.style.top = my + 'px'; });
    gsap.ticker.add(() => { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px'; });
    document.querySelectorAll('a, button, .brutal-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });

    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('nav');
    if (navToggle && nav) {
        navToggle.addEventListener('click', () => nav.classList.toggle('open'));
        document.querySelectorAll('.nav-mobile a').forEach(a => {
            a.addEventListener('click', () => nav.classList.remove('open'));
        });
    }

    const words = ['WORK', 'SCALE', 'SHIP', 'LAST'];
    let wi = 0;
    const cycleEl = document.getElementById('cycleWord');
    if(cycleEl) {
        setInterval(() => {
            cycleEl.classList.add('swap');
            setTimeout(() => {
                wi = (wi + 1) % words.length;
                cycleEl.textContent = words[wi];
                cycleEl.classList.remove('swap');
            }, 250);
        }, 2400);
    }

    document.querySelectorAll('.term-line').forEach(line => {
        const delay = parseFloat(line.dataset.delay) || 0;
        gsap.set(line, { opacity: 0, y: 6 });
        gsap.to(line, {
            opacity: 1, y: 0, duration: 0.35, delay: delay * 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: '.hero-visual', start: 'top 80%', toggleActions: 'play none none none' }
        });
    });

    const heroBlock = document.querySelector('.hero-block');
    if (heroBlock) {
        heroBlock.addEventListener('mousemove', (e) => {
            const rect = heroBlock.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotY = (x - 0.5) * 10;
            const rotX = (0.5 - y) * 8;
            heroBlock.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(18px)`;
            heroBlock.style.transition = 'transform 0.1s ease-out';
        });
        heroBlock.addEventListener('mouseleave', () => {
            heroBlock.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateZ(0)';
            heroBlock.style.transition = 'transform 0.4s ease-out';
        });
    }

    gsap.utils.toArray('.reveal-text').forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 40 });
        gsap.to(el, {
            opacity: 1, y: 0, duration: 0.8, delay: i * 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        });
    });

    gsap.utils.toArray('.split-heading').forEach(el => {
        if (el.innerHTML.includes('<br>')) {
            const lines = el.innerHTML.split('<br>').map(l => l.trim()).filter(Boolean);
            el.innerHTML = lines.map(l => `<span style="display:block">${l}</span>`).join('');
            gsap.from(el.children, {
                opacity: 0, y: 40, rotateX: -90, duration: 0.6, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
            });
            return;
        }
        const chars = el.textContent.split('');
        el.textContent = '';
        chars.forEach(c => { const s = document.createElement('span'); s.textContent = c === ' ' ? '\u00A0' : c; s.style.display = 'inline-block'; el.appendChild(s); });
        gsap.from(el.children, {
            opacity: 0, y: 40, rotateX: -90, duration: 0.6, stagger: 0.03, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
    });

    gsap.utils.toArray('.split-sub').forEach(el => {
        gsap.from(el, {
            opacity: 0, y: 20, duration: 0.7, delay: 0.3, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        });
    });

    gsap.utils.toArray('.brutal-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0, y: 60, scale: 0.95, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' }
        });
    });

    let mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
        const horizontalSection = document.querySelector('.horizontal-section');
        const horizontalWrapper = document.querySelector('.horizontal-scroll-wrapper');

        const moveGrid = (e) => {
            horizontalSection.style.setProperty('--mouse-x', `${e.clientX}px`);
            horizontalSection.style.setProperty('--mouse-y', `${e.clientY}px`);
        };
        horizontalSection.addEventListener('mousemove', moveGrid);

        let getScrollAmount = () => -(horizontalWrapper.scrollWidth - window.innerWidth);
        const tween = gsap.to(horizontalWrapper, { x: getScrollAmount, ease: "none" });

        ScrollTrigger.create({
            trigger: horizontalSection,
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            pin: true,
            anticipatePin: 1,
            animation: tween,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const progressBar = document.getElementById("progress-bar");
                if (progressBar) gsap.set(progressBar, { width: `${self.progress * 100}%` });
            }
        });

        return () => { horizontalSection.removeEventListener('mousemove', moveGrid); };
    });

    gsap.utils.toArray('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target);
        let obj = { val: 0 };
        gsap.to(obj, {
            val: target, duration: 2.2, ease: 'power3.out',
            scrollTrigger: { trigger: el.parentElement, start: 'top 85%', toggleActions: 'play none none none' },
            onUpdate: () => { el.textContent = Math.round(obj.val); }
        });
    });

    gsap.utils.toArray('.exp-item').forEach((el, i) => {
        gsap.to(el, {
            opacity: 1, y: 0, duration: 0.7, delay: i * 0.2, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
    });
});
