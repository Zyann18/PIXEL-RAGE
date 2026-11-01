/* =========================================================
   MOTION CONTROLLER — GSAP + ScrollTrigger
   Cinematic game interface inspired animations
========================================================= */

(function() {
    'use strict';

    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Motion features disabled.');
        // Add reveal fallback
        document.querySelectorAll('.reveal, .fade-in, .scale-in').forEach(el => {
            el.classList.add('in');
        });
        return;
    }

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // =========================================================
    // UTILITY FUNCTIONS
    // =========================================================

    function isMobile() {
        return window.innerWidth < 768;
    }

    function splitTextIntoLines(element) {
        const text = element.innerHTML;
        const words = text.split(' ');
        element.innerHTML = '';
        
        let line = document.createElement('span');
        line.className = 'hero-line';
        line.style.display = 'block';
        line.style.overflow = 'hidden';
        
        words.forEach((word, i) => {
            const span = document.createElement('span');
            span.innerHTML = word + (i < words.length - 1 ? ' ' : '');
            span.style.display = 'inline-block';
            line.appendChild(span);
            
            // Check if we need a new line (for manual line breaks)
            if (word.includes('<br>') || word.includes('<br/>')) {
                element.appendChild(line);
                line = document.createElement('span');
                line.className = 'hero-line';
                line.style.display = 'block';
                line.style.overflow = 'hidden';
            }
        });
        
        if (line.children.length > 0) {
            element.appendChild(line);
        }
        
        return element.querySelectorAll('.hero-line');
    }

    // =========================================================
    // HERO ENTRANCE SEQUENCE
    // =========================================================

    function initHeroSequence() {
        if (isReducedMotion) return;

        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Mark as ready for sequence
        document.body.classList.add('hero-sequence-ready');

        const tag = hero.querySelector('.hero-tag');
        const headline = hero.querySelector('.hero h1');
        const description = hero.querySelector('.hero-description');
        const buttons = hero.querySelector('.hero-buttons');
        const sticker = hero.querySelector('.hero-sticker');

        // Create master timeline
        const tl = gsap.timeline({ 
            defaults: { 
                ease: 'power3.out' 
            },
            onComplete: () => {
                document.body.classList.remove('hero-sequence-ready');
            }
        });

        // 1. Tag appears
        if (tag) {
            tl.fromTo(tag, 
                { 
                    opacity: 0, 
                    y: -10 
                },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.4 
                },
                0.2
            );
        }

        // 2. Headline reveals line by line
        if (headline) {
            // Split headline into words per line
            const lines = headline.innerHTML.split('<br>');
            headline.innerHTML = '';
            
            lines.forEach((lineText, index) => {
                const lineWrapper = document.createElement('div');
                lineWrapper.style.overflow = 'hidden';
                
                const lineContent = document.createElement('span');
                lineContent.innerHTML = lineText;
                lineContent.style.display = 'block';
                
                lineWrapper.appendChild(lineContent);
                headline.appendChild(lineWrapper);
                
                tl.fromTo(lineContent,
                    {
                        y: '100%',
                        opacity: 0
                    },
                    {
                        y: '0%',
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power4.out'
                    },
                    0.5 + (index * 0.15)
                );
            });
        }

        // 3. Description fades in
        if (description) {
            tl.fromTo(description,
                {
                    opacity: 0,
                    y: 20
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6
                },
                1.2
            );
        }

        // 4. Buttons appear
        if (buttons) {
            const buttonElements = buttons.querySelectorAll('.btn');
            tl.fromTo(buttonElements,
                {
                    opacity: 0,
                    y: 20,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'back.out(1.2)'
                },
                1.4
            );
        }

        // 5. Sticker spins in
        if (sticker) {
            tl.fromTo(sticker,
                {
                    opacity: 0,
                    scale: 0,
                    rotation: -45
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 8,
                    duration: 0.7,
                    ease: 'back.out(1.5)'
                },
                1.0
            );
        }

        return tl;
    }

    // =========================================================
    // FEATURED CARD REVEAL
    // =========================================================

    function initFeaturedReveal() {
        if (isReducedMotion) return;

        const featured = document.querySelector('.featured-card');
        if (!featured) return;

        const image = featured.querySelector('.featured-image img');
        const info = featured.querySelector('.featured-info');

        gsap.timeline({
            scrollTrigger: {
                trigger: featured,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none none'
            }
        })
        .fromTo(image,
            {
                clipPath: 'inset(0 100% 0 0)'
            },
            {
                clipPath: 'inset(0 0% 0 0)',
                duration: 1.2,
                ease: 'power3.inOut'
            }
        )
        .fromTo(info.children,
            {
                opacity: 0,
                x: 30
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power2.out'
            },
            0.6
        );
    }

    // =========================================================
    // SCROLL REVEAL SYSTEM
    // =========================================================

    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal:not(.in)');
        
        if (isReducedMotion) {
            revealElements.forEach(el => el.classList.add('in'));
            return;
        }

        revealElements.forEach(element => {
            gsap.fromTo(element,
                {
                    opacity: 0,
                    y: 40
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                        once: true,
                        onEnter: () => element.classList.add('in')
                    }
                }
            );
        });
    }

    // =========================================================
    // REVIEW CARDS STAGGER
    // =========================================================

    function initReviewCardsStagger() {
        if (isReducedMotion) return;

        const reviewGrid = document.querySelector('.review-grid');
        if (!reviewGrid) return;

        const cards = reviewGrid.querySelectorAll('.review-card');

        gsap.fromTo(cards,
            {
                opacity: 0,
                y: 40,
                scale: 0.95
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: {
                    amount: 0.4,
                    from: 'start'
                },
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: reviewGrid,
                    start: 'top 75%',
                    toggleActions: 'play none none none',
                    once: true
                }
            }
        );
    }

    // =========================================================
    // PARALLAX EFFECTS
    // =========================================================

    function initParallax() {
        if (isReducedMotion || isMobile()) return;

        // Hero background text parallax
        const heroText = document.querySelector('.hero-background-text');
        if (heroText) {
            gsap.to(heroText, {
                y: 100,
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }

        // Featured image parallax
        const featuredImage = document.querySelector('.featured-image img');
        if (featuredImage) {
            gsap.to(featuredImage, {
                y: -50,
                scale: 1.1,
                scrollTrigger: {
                    trigger: '.featured-card',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }
    }

    // =========================================================
    // SPEEDRUN CIRCLE ANIMATION
    // =========================================================

    function initSpeedrunCircle() {
        if (isReducedMotion) return;

        const circle = document.querySelector('.speed-circle');
        if (!circle) return;

        gsap.timeline({
            scrollTrigger: {
                trigger: '.speedrun',
                start: 'top 60%',
                toggleActions: 'play none none none'
            }
        })
        .fromTo(circle,
            {
                scale: 0,
                rotation: -180,
                opacity: 0
            },
            {
                scale: 1,
                rotation: -10,
                opacity: 1,
                duration: 1,
                ease: 'back.out(1.5)'
            }
        )
        .fromTo(circle.querySelectorAll('span, strong, small'),
            {
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1
            },
            0.5
        );
    }

    // =========================================================
    // CHALLENGE CARDS ANIMATION
    // =========================================================

    function initChallengeCards() {
        if (isReducedMotion) return;

        const cards = document.querySelectorAll('.challenge-card');
        if (!cards.length) return;

        cards.forEach((card, index) => {
            gsap.fromTo(card,
                {
                    opacity: 0,
                    y: 60,
                    rotateX: -15
                },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                        once: true
                    }
                }
            );
        });
    }

    // =========================================================
    // SECTION HEADER ANIMATIONS
    // =========================================================

    function initSectionHeaders() {
        if (isReducedMotion) return;

        const headers = document.querySelectorAll('.section-header');

        headers.forEach(header => {
            const eyebrow = header.querySelector('.eyebrow');
            const heading = header.querySelector('h2');
            const number = header.querySelector('.section-number');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    once: true
                }
            });

            if (eyebrow) {
                tl.fromTo(eyebrow,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.5 },
                    0
                );
            }

            if (heading) {
                tl.fromTo(heading,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.7 },
                    0.2
                );
            }

            if (number) {
                tl.fromTo(number,
                    { opacity: 0, scale: 0.5 },
                    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' },
                    0.3
                );
            }
        });
    }

    // =========================================================
    // TICKER ENHANCEMENT
    // =========================================================

    function initTickerAnimation() {
        const ticker = document.querySelector('.ticker-track');
        if (!ticker) return;

        // Enhanced smooth infinite scroll with GSAP
        const duration = isMobile() ? 20 : 30;
        
        gsap.to(ticker, {
            x: '-50%',
            duration: duration,
            ease: 'none',
            repeat: -1
        });
    }

    // =========================================================
    // MODAL ENTRANCE
    // =========================================================

    function initModalAnimation() {
        const modal = document.querySelector('.modal');
        const modalBox = document.querySelector('.modal-box');
        
        if (!modal || !modalBox) return;

        // Override original openReview to add animation
        const originalOpen = window.openReview;
        window.openReview = function(...args) {
            originalOpen.apply(this, args);
            
            if (!isReducedMotion) {
                gsap.fromTo(modalBox,
                    {
                        scale: 0.9,
                        opacity: 0,
                        y: 30
                    },
                    {
                        scale: 1,
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'back.out(1.5)'
                    }
                );
            }
        };
    }

    // =========================================================
    // NAVBAR SCROLL BEHAVIOR
    // =========================================================

    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScroll = 0;

        gsap.to(navbar, {
            scrollTrigger: {
                start: 100,
                end: 99999,
                onUpdate: (self) => {
                    const currentScroll = window.pageYOffset;
                    
                    if (currentScroll > 100) {
                        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
                    } else {
                        navbar.style.boxShadow = 'none';
                    }
                    
                    lastScroll = currentScroll;
                }
            }
        });
    }

    // =========================================================
    // INITIALIZATION
    // =========================================================

    function init() {
        console.log('🎮 Motion system initializing...');

        // Register ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Refresh on window resize
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 250);
            });
        }

        // Initialize all animations
        setTimeout(() => {
            initHeroSequence();
            initFeaturedReveal();
            initScrollReveal();
            initReviewCardsStagger();
            initParallax();
            initSpeedrunCircle();
            initChallengeCards();
            initSectionHeaders();
            initTickerAnimation();
            initModalAnimation();
            initNavbarScroll();

            console.log('✨ Motion system ready');

            // Refresh ScrollTrigger after images load
            window.addEventListener('load', () => {
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            });
        }, 100);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for external access
    window.MotionController = {
        refresh: () => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        },
        kill: () => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.getAll().forEach(st => st.kill());
            }
        }
    };

})();
