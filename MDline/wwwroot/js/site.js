
/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});


/* ---------- SERVICES / TIMELINE ---------- */
function initTimelineAnimation() {
    const timeline = document.querySelector('.services-timeline');
    const serviceItems = document.querySelectorAll('.service-item');

    if (!timeline || serviceItems.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                timeline.classList.add('animated');

                serviceItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 400);
                });

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(timeline);

    const serviceBtns = document.querySelectorAll('.service-btn');
    serviceBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-8px) scale(1.05)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
        });

        btn.addEventListener('touchstart', () => {
            btn.style.transform = 'translateY(-8px) scale(1.05)';
        });

        btn.addEventListener('touchend', () => {
            setTimeout(() => {
                btn.style.transform = 'translateY(0) scale(1)';
            }, 150);
        });
    });
}


/* ---------- ABOUT / WORKFLOW ---------- */
function initWorkflowAnimation() {
    const workflowSection = document.querySelector('#about');
    if (!workflowSection) return;

    const horizontalLines = workflowSection.querySelectorAll('.horizontal-line');
    const verticalLines = workflowSection.querySelectorAll('.vertical-line');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const topItems = workflowSection.querySelectorAll('.top-row .workflow-item');
            topItems.forEach((item, index) => {
                setTimeout(() => item.classList.add('visible'), index * 300);
            });

            setTimeout(() => {
                horizontalLines.forEach((line, index) => {
                    setTimeout(() => line.classList.add('visible'), index * 200);
                });
            }, 500);

            setTimeout(() => {
                verticalLines.forEach((line, index) => {
                    setTimeout(() => line.classList.add('visible'), index * 300);
                });
            }, 800);

            setTimeout(() => {
                const bottomItems = workflowSection.querySelectorAll('.bottom-row .workflow-item');
                bottomItems.forEach((item, index) => {
                    setTimeout(() => item.classList.add('visible'), index * 300);
                });
            }, 1200);

            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(workflowSection);
}


/* ---------- WORKFLOW CARDS ---------- */
function initWorkflowCards() {
    const workflowBtns = document.querySelectorAll('.workflow-btn');
    const cards = document.querySelectorAll('.workflow-card');
    const overlay = document.querySelector('.workflow-overlay');
    const closeBtns = document.querySelectorAll('.close-card-btn');

    if (!workflowBtns.length) return;

    workflowBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            const item = btn.closest('.workflow-item');
            if (!item) return;

            const cardIndex = item.getAttribute('data-index');
            const targetCard = document.querySelector(`.workflow-card[data-card="${cardIndex}"]`);

            closeAllCards();

            if (targetCard && overlay) {
                targetCard.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeAllCards() {
        cards.forEach(card => card.classList.remove('active'));
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (overlay) overlay.addEventListener('click', closeAllCards);
    closeBtns.forEach(btn => btn.addEventListener('click', closeAllCards));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllCards();
    });
}


/* ---------- ORBIT CAROUSEL ---------- */
function initOrbitCarousel() {
    const carousel = document.querySelector('.orbit-carousel');
    const cards = document.querySelectorAll('.orbit-card');

    if (!carousel || cards.length === 0) return;

    let currentIndex = 0;
    const totalCards = cards.length;
    const switchInterval = 3000;

    function updateCardPositions() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next', 'hidden');

            let relativeIndex = index - currentIndex;
            if (relativeIndex < 0) relativeIndex += totalCards;

            if (relativeIndex === 0) card.classList.add('active');
            else if (relativeIndex === 1) card.classList.add('next');
            else if (relativeIndex === totalCards - 1) card.classList.add('prev');
            else card.classList.add('hidden');
        });
    }

    function nextCard() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCardPositions();
    }

    updateCardPositions();
    setInterval(nextCard, switchInterval);
}


/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
    initTimelineAnimation();
    initWorkflowAnimation();
    initWorkflowCards();
    initOrbitCarousel();

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
});

//section services/
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.orbit-item');

    if (!items.length) return;

    const radius = 600;       // радиус окружности
    const speed = 0.0018;     // МЕДЛЕННОЕ вращение (меньше = медленнее)
    let angle = 0;

    function animateOrbit() {
        angle += speed;

        let activeIndex = 0;
        let minDistance = Infinity;

        items.forEach((item, index) => {
            const step = (Math.PI * 2) / items.length;
            const currentAngle = angle + step * index;

            const x = Math.cos(currentAngle) * radius;
            const y = Math.sin(currentAngle) * radius;

            // позиция + компенсация вращения (текст всегда ровный)
            item.style.transform = `
        translate(${x}px, ${y}px)
        rotate(${-currentAngle}rad)
      `;

            // ищем активный элемент (ближе к центру по вертикали)
            const distance = Math.abs(y);
            if (distance < minDistance) {
                minDistance = distance;
                activeIndex = index;
            }

            item.classList.remove('active');
        });

        items[activeIndex].classList.add('active');

        requestAnimationFrame(animateOrbit);
    }

    animateOrbit();
});
