import { gsap } from 'gsap';

// Disable browser scroll restoration immediately
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// Force scroll position to top instantly
window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant'
});

// Clear anchor hash from URL to prevent browser scroll jump on refresh
if (window.location.hash && window.location.hash !== '#hero') {
    history.replaceState(null, document.title, window.location.pathname + window.location.search);
}


/**
 * Portfolio 2.0 - Core Application Controller
 * Ayur Sagathiya - UI/UX Designer
 * 
 * Features:
 * - WebGL Black Hole Hero Background (inspired by Kerr-Newman shader)
 * - Mouse gesture interaction (aero effect)
 * - Cinematic preloader with progress line
 * - Smooth scroll animations with staggered reveals
 * - Floating widget parallax
 * - Custom magnetic cursor
 * - Premium About Section with ScrollTrigger animations
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - Single consolidated requestAnimationFrame loop
 * - Throttled mouse/scroll event handlers
 * - WebGL paused when hero section is offscreen
 * - Reduced canvas resolution for GPU relief
 * - Debounced resize handler
 */

// Register GSAP ScrollTrigger plugin
if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// ─── Shared global state for unified rAF loop ───
let mouseX = 0, mouseY = 0;

// Projects Data Array for SPA projects hub
const projectsData = [
  {
    id: 'voltify',
    name: 'Voltify',
    category: 'Mobile App • EV Charging',
    route: '/projects/voltify',
    thumbnail: './Projects/Voltify/thumbnail/thumbnail image.png'
  },
  {
    id: 'lounge',
    name: 'Lounge Coffee',
    category: 'Brand Identity • Web Design',
    route: '/projects/lounge',
    thumbnail: './Projects/Lounge/thumbnail/Elegant Black Laptop Mockup.png'
  }
];

function renderProjectsGrid() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    
    // Check if inside a subfolder/detail path to adjust asset directories
    const isSubdir = window.location.pathname.includes('/projects/') || window.location.pathname.endsWith('/voltify') || window.location.pathname.endsWith('/lounge');
    
    grid.innerHTML = projectsData.map(proj => {
        const thumb = isSubdir ? `.${proj.thumbnail}` : proj.thumbnail;
        return `
            <a href="${proj.route}" class="project-hub-card" data-project="${proj.id}">
                <div class="project-hub-card-image-wrapper">
                    <img src="${thumb}" alt="${proj.name} Thumbnail" class="project-hub-card-img" loading="lazy">
                </div>
                <div class="project-hub-card-info">
                    <h3 class="project-hub-card-title">${proj.name}</h3>
                    <p class="project-hub-card-category">${proj.category}</p>
                </div>
            </a>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    // Clear GSAP ScrollTrigger memory if it exists
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.clearScrollMemory();
    }

    // Force scroll to top on DOMContentLoaded
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
    });

    // Handle opening preloader and session state
    const skipIntro = sessionStorage.getItem('fromCaseStudy') === 'true';
    if (skipIntro) {
        sessionStorage.removeItem('fromCaseStudy');
        
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
        }
        document.body.classList.remove('preloader-active');
        
        initSmoothScroll();
        initCustomCursor();
        initPremiumHero();
        initAboutSection();
        initProjectsSection();
        initCardMagnetics();
        initNikeConfigurator();
        initCoffeeSelector();
        initSportsBookingSlots();
        initExperienceSection();
        initSkillsSection();
        initDesignFlowSection();
        initContactSection();
        initCaseStudyModal();
        initMagnetics();
        initFloatingLabelsIdle();
        initNavScrollSync();
        initHeaderScroll();
        initMobileMenu();
        
        // Skip preloader animation and reveal hero instantly
        triggerPremiumHeroReveal(true);
        startUnifiedLoop();
    } else {
        initPreloader();
        initSmoothScroll();
        initCustomCursor();
        initPremiumHero();
        initAboutSection();
        initProjectsSection();
        initCardMagnetics();
        initNikeConfigurator();
        initCoffeeSelector();
        initSportsBookingSlots();
        initExperienceSection();
        initSkillsSection();
        initDesignFlowSection();
        initContactSection();
        initCaseStudyModal();
        initMagnetics();
        initFloatingLabelsIdle();
        initNavScrollSync();
        initHeaderScroll();
        initMobileMenu();
        startUnifiedLoop();
    }

    // SPA Routing: Click interceptor for case studies and smooth scroll hash links

    // Call render once initially in case we land directly on projects page
    renderProjectsGrid();

    // SPA Routing: Click interceptor for case studies and projects page
    document.addEventListener('click', (e) => {
        const projectLink = e.target.closest('a[href="/voltify"], a[href="/lounge"], a[href="/projects/voltify"], a[href="/projects/lounge"]');
        if (projectLink) {
            e.preventDefault();
            const targetPath = projectLink.getAttribute('href');
            navigateToCaseStudy(targetPath, false);
            return;
        }

        const projectsLink = e.target.closest('a[href="/projects"]');
        if (projectsLink) {
            e.preventDefault();
            navigateToProjects(false);
            return;
        }

        const hashLink = e.target.closest('a[href^="#"]');
        if (hashLink) {
            const href = hashLink.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                if (targetElement && lenisInstance) {
                    const targetScrollPos = targetElement.getBoundingClientRect().top + window.scrollY;
                    const distance = Math.abs(targetScrollPos - window.scrollY);
                    
                    const minDuration = 0.6;
                    const maxDuration = 1.0;
                    const maxDistance = 3000;
                    const distanceRatio = Math.min(Math.max(distance / maxDistance, 0), 1);
                    const scrollDuration = minDuration + distanceRatio * (maxDuration - minDuration);
                    
                    lenisInstance.scrollTo(targetElement, {
                        duration: scrollDuration,
                        offset: -64,
                        easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
                    });

                    updateNavActiveLink(targetId);
                    history.pushState({ page: 'home', hash: targetId }, '', window.location.pathname + targetId);
                }
            }
        }
    });

    // SPA Routing: popstate listener for browser back/forward navigation
    window.addEventListener('popstate', (e) => {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        if (path === '/projects' || path.endsWith('/projects') || path.endsWith('/projects/')) {
            navigateToProjects(true);
        } else if (path === '/voltify' || path.endsWith('/voltify') || path === '/projects/voltify' || path.endsWith('/projects/voltify')) {
            navigateToCaseStudy(path, true);
        } else if (path === '/lounge' || path.endsWith('/lounge') || path === '/projects/lounge' || path.endsWith('/projects/lounge')) {
            navigateToCaseStudy(path, true);
        } else {
            const homeView = document.getElementById('homepage-view');
            const isHomeVisible = homeView && homeView.style.display !== 'none';
            
            if (isHomeVisible) {
                if (hash) {
                    const targetElement = document.querySelector(hash);
                    if (targetElement && lenisInstance) {
                        lenisInstance.scrollTo(targetElement, {
                            duration: 0.8,
                            offset: -64,
                            easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
                        });
                        updateNavActiveLink(hash);
                    }
                } else {
                    if (lenisInstance) {
                        lenisInstance.scrollTo(0, {
                            duration: 0.8,
                            easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
                        });
                        updateNavActiveLink('#hero');
                    }
                }
            } else {
                navigateToHome(true);
                if (hash) {
                    setTimeout(() => {
                        const targetElement = document.querySelector(hash);
                        if (targetElement && lenisInstance) {
                            lenisInstance.scrollTo(targetElement, { immediate: true });
                            updateNavActiveLink(hash);
                        }
                    }, 550);
                }
            }
        }
    });
});

/* ============================================================
   SPA CLIENT-SIDE ROUTER FOR PROJECTS
   ============================================================ */
let caseStudyCache = {};
let homepageScrollY = 0;
let projectsScrollY = 0;
let historySource = 'home'; // Tracks entry context: 'home' or 'projects'

function navigateToCaseStudy(path, isPopState = false) {
    const homeView = document.getElementById('homepage-view');
    const projectsView = document.getElementById('projects-view');
    const caseStudyView = document.getElementById('case-study-view');
    const contentContainer = document.getElementById('case-study-spa-content');
    const header = document.getElementById('header-nav');
    if (!homeView || !caseStudyView || !contentContainer) return;

    const projectId = path.replace(/^\/projects\//, '').replace(/^\//, '');

    if (lenisInstance) {
        lenisInstance.stop();
    }

    if (header) {
        header.style.opacity = '0';
        header.style.pointerEvents = 'none';
    }

    // Determine current visible parent view and transition it out
    if (projectsView && projectsView.style.display !== 'none') {
        historySource = 'projects';
        if (!isPopState) {
            projectsScrollY = window.scrollY;
        }
        projectsView.classList.remove('projects-spa-transition-in');
        projectsView.classList.add('projects-spa-transition-out');
    } else {
        historySource = 'home';
        if (!isPopState) {
            homepageScrollY = window.scrollY;
        }
        homeView.classList.remove('spa-transition-in');
        homeView.classList.add('spa-transition-out');
    }

    const displayCaseStudy = (html) => {
        setTimeout(() => {
            homeView.style.display = 'none';
            homeView.classList.remove('spa-transition-out');
            if (projectsView) {
                projectsView.style.display = 'none';
                projectsView.classList.remove('projects-spa-transition-out');
            }
            
            if (header) {
                header.style.display = 'none';
            }

            contentContainer.innerHTML = html;
            caseStudyView.style.display = 'block';

            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            
            if (lenisInstance) {
                lenisInstance.scrollTo(0, { immediate: true });
                lenisInstance.start();
            }

            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }

            caseStudyView.classList.remove('spa-transition-out');
            caseStudyView.classList.add('spa-transition-in');

            if (!isPopState) {
                history.pushState({ page: projectId }, '', path);
            }

            setupSPACloseButton();
            initSPAScrollReveal();
        }, 500);
    };

    if (caseStudyCache[projectId]) {
        displayCaseStudy(caseStudyCache[projectId]);
    } else {
        fetch(`/case-studies/${projectId}.html`)
            .then(res => {
                if (!res.ok) return fetch(`./case-studies/${projectId}.html`);
                return res;
            })
            .then(res => res.text())
            .then(html => {
                caseStudyCache[projectId] = html;
                displayCaseStudy(html);
            })
            .catch(err => {
                console.error('SPA case study load error:', err);
                displayCaseStudy(`
                    <div style="padding: 120px 40px; text-align: center; font-family: 'Space Grotesk', sans-serif;">
                        <h3 style="color: #4D9FFF; font-size: 24px; margin-bottom: 16px;">Failed to load case study</h3>
                        <p style="color: rgba(17,17,17,0.6); max-width: 500px; margin: 0 auto;">
                            Please check your network connection and try again.
                        </p>
                    </div>
                `);
            });
    }
}

function navigateToProjects(isPopState = false) {
    const homeView = document.getElementById('homepage-view');
    const projectsView = document.getElementById('projects-view');
    const caseStudyView = document.getElementById('case-study-view');
    const contentContainer = document.getElementById('case-study-spa-content');
    const header = document.getElementById('header-nav');
    if (!homeView || !projectsView) return;

    if (!isPopState) {
        if (homeView && homeView.style.display !== 'none') {
            homepageScrollY = window.scrollY;
        }
    }

    if (lenisInstance) {
        lenisInstance.stop();
    }

    if (header) {
        header.style.opacity = '0';
        header.style.pointerEvents = 'none';
    }

    // Hide active case study or home page
    if (caseStudyView && caseStudyView.style.display !== 'none') {
        caseStudyView.classList.remove('spa-transition-in');
        caseStudyView.classList.add('spa-transition-out');
    } else {
        homeView.classList.remove('spa-transition-in');
        homeView.classList.add('spa-transition-out');
    }

    setTimeout(() => {
        homeView.style.display = 'none';
        homeView.classList.remove('spa-transition-out');
        if (caseStudyView) {
            caseStudyView.style.display = 'none';
            caseStudyView.classList.remove('spa-transition-out');
            if (contentContainer) contentContainer.innerHTML = '';
        }

        if (header) {
            header.style.display = 'none';
        }

        renderProjectsGrid();
        projectsView.style.display = 'block';

        const targetScroll = projectsScrollY || 0;
        window.scrollTo({ top: targetScroll, left: 0, behavior: 'instant' });
        
        if (lenisInstance) {
            lenisInstance.scrollTo(targetScroll, { immediate: true });
            lenisInstance.start();
        }

        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }

        projectsView.classList.remove('projects-spa-transition-out');
        projectsView.classList.add('projects-spa-transition-in');

        if (!isPopState) {
            history.pushState({ page: 'projects' }, '', '/projects');
        }

        setupProjectsCloseButton();
    }, 500);
}

function navigateToHome(isPopState = false) {
    const homeView = document.getElementById('homepage-view');
    const projectsView = document.getElementById('projects-view');
    const caseStudyView = document.getElementById('case-study-view');
    const contentContainer = document.getElementById('case-study-spa-content');
    const header = document.getElementById('header-nav');
    if (!homeView) return;

    if (lenisInstance) {
        lenisInstance.stop();
    }

    // Animate out active overlay
    if (caseStudyView && caseStudyView.style.display !== 'none') {
        caseStudyView.classList.remove('spa-transition-in');
        caseStudyView.classList.add('spa-transition-out');
    } else if (projectsView && projectsView.style.display !== 'none') {
        projectsView.classList.remove('projects-spa-transition-in');
        projectsView.classList.add('projects-spa-transition-out');
    }

    setTimeout(() => {
        if (caseStudyView) {
            caseStudyView.style.display = 'none';
            caseStudyView.classList.remove('spa-transition-out');
            if (contentContainer) contentContainer.innerHTML = '';
        }
        if (projectsView) {
            projectsView.style.display = 'none';
            projectsView.classList.remove('projects-spa-transition-out');
        }

        homeView.style.display = 'block';
        if (header) {
            header.style.display = 'flex';
            void header.offsetWidth;
            header.style.opacity = '1';
            header.style.pointerEvents = 'auto';
        }

        window.scrollTo({ top: homepageScrollY, left: 0, behavior: 'instant' });
        if (lenisInstance) {
            lenisInstance.scrollTo(homepageScrollY, { immediate: true });
            lenisInstance.start();
        }

        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }

        homeView.classList.remove('spa-transition-out');
        homeView.classList.add('spa-transition-in');

        if (!isPopState) {
            history.pushState({ page: 'home' }, '', '/');
        }
    }, 500);
}

function setupProjectsCloseButton() {
    const closeBtn = document.getElementById('projects-close-btn-spa');
    if (closeBtn) {
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        newCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToHome(false);
        });
    }
}

function setupSPACloseButton() {
    const closeBtn = document.getElementById('case-study-close-btn-spa');
    if (closeBtn) {
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        newCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (historySource === 'projects' || window.location.pathname.startsWith('/projects')) {
                navigateToProjects(false);
            } else {
                navigateToHome(false);
            }
        });
    }
}

function initSPAScrollReveal() {
    const els = document.querySelectorAll('.v-reveal-spa, .l-reveal-spa');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                if (e.target.classList.contains('v-reveal-spa')) {
                    e.target.classList.add('v-visible-spa');
                }
                if (e.target.classList.contains('l-reveal-spa')) {
                    e.target.classList.add('l-visible-spa');
                }
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
}


// Force absolute scroll reset on full window load to override any delayed browser restorations
window.addEventListener('load', () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
    });
    if (lenisInstance) {
        lenisInstance.scrollTo(0, { immediate: true });
    }
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh(true);
    }
});

// Global Image Fallback Handler for missing/broken assets
window.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'IMG') {
        const img = e.target;
        
        // Prevent infinite loops if fallback itself fails
        if (img.classList.contains('fallback-triggered')) return;
        img.classList.add('fallback-triggered');
        
        // Hide the original broken image
        img.style.display = 'none';
        
        // Inject a premium styling placeholder container
        const placeholder = document.createElement('div');
        placeholder.className = 'img-placeholder';
        
        // Copy dimensions or use defaults
        const w = img.getAttribute('width') || img.style.width;
        const h = img.getAttribute('height') || img.style.height || '220px';
        if (w) placeholder.style.width = w;
        placeholder.style.height = h;
        
        // Copy margins, border-radius, display layout to fit inline nicely
        placeholder.style.margin = img.style.margin;
        placeholder.style.borderRadius = img.style.borderRadius || '16px';
        
        // Display fallback information
        const altText = img.getAttribute('alt') || 'Asset failed to load';
        placeholder.innerHTML = `<span>${altText}</span>`;
        
        // Insert fallback
        img.parentNode.insertBefore(placeholder, img);
    }
}, true);

/* ============================================================
   1. CINEMATIC PRELOADER WITH PROGRESS LINE
   ============================================================ */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const counterElement = document.getElementById('preloader-counter-num');
    const progressLine = document.getElementById('preloader-progress-line');
    if (!preloader || !counterElement) return;

    let count = 0;
    const duration = 1000; // 1 second duration
    const startTime = performance.now();

    const updateCounter = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.max(0, Math.min(elapsed / duration, 1));
        count = Math.floor(progress * 100);

        counterElement.textContent = String(count);
        if (progressLine) {
            progressLine.style.width = count + '%';
        }

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Loading complete - start window reveal transition sequence
            setTimeout(() => {
                // Slide the entire preloader panel upward using GSAP
                gsap.to(preloader, {
                    yPercent: -100,
                    duration: 1.2,
                    ease: "power3.inOut",
                    onStart: () => {
                        document.body.classList.remove('preloader-active');
                    },
                    onComplete: () => {
                        preloader.style.display = 'none';
                    }
                });

                // Trigger hero reveal animations simultaneously with slide-up
                requestAnimationFrame(() => {
                    triggerPremiumHeroReveal(false);
                });
            }, 150); // Premium brief hold before lifting the sheet
        }
    };

    requestAnimationFrame(updateCounter);
}

/* ============================================================
   2. SMOOTH SCROLLING (Lenis)
   ============================================================ */
let lenisInstance = null;
function initSmoothScroll() {
    if (typeof Lenis !== 'undefined') {
        lenisInstance = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1.0
        });
        lenisInstance.scrollTo(0, { immediate: true });
        // Lenis raf is driven by the unified loop (see startUnifiedLoop)
    }
}

/* ============================================================
   3. CUSTOM MAGNETIC CURSOR
   ============================================================ */
function initCustomCursor() {
    const canvas = document.getElementById('cursor-canvas');
    const cursorTextLabel = document.getElementById('cursor-text-label');
    if (!canvas) return;

    // Fluid simulation settings
    const config = {
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1440,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 3.5,
        VELOCITY_DISSIPATION: 2,
        PRESSURE: 0.1,
        PRESSURE_ITERATIONS: 20,
        CURL: 3,
        SPLAT_RADIUS: 0.2,
        SPLAT_FORCE: 6000,
        SHADING: true,
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        BACK_COLOR: { r: 0.5, g: 0, b: 0 },
        TRANSPARENT: true,
        RAINBOW_MODE: false,
        COLOR: '#4D9FFF' // Signature Electric Blue
    };

    // Track actual mouse coords for other effects
    let isHovering = false;
    const cursorGlow = document.getElementById('cursor-glow');
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorTextLabel) {
            cursorTextLabel.style.transform = `translate(${mouseX + 15}px, ${mouseY + 15}px)`;
        }
        if (cursorGlow) {
            gsap.to(cursorGlow, {
                x: mouseX,
                y: mouseY,
                duration: 0.6,
                ease: "power2.out",
                overwrite: "auto"
            });
        }
    }, { passive: true });

    // Interactive hover states
    const interactiveSelectors = 'a, .btn, .project-card, .bento-item, .modal-close-btn, input, textarea, .floating-label, .about-skill-chip, .skill-pill-marquee, .timeline-card, .focus-tag, .about-stat-card, .portrait-block';

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest(interactiveSelectors);
        if (target) {
            isHovering = true;
            document.body.classList.add('hovering-link');

            // Context-aware texts
            let text = 'EXPLORE';
            if (target.closest('.nav-links') || target.classList.contains('logo')) {
                text = 'OPEN';
            } else if (target.closest('#portrait-block')) {
                text = 'VIEW';
            } else if (target.classList.contains('about-skill-chip') || target.classList.contains('skill-pill-marquee')) {
                text = 'VIEW';
            } else if (target.classList.contains('timeline-card')) {
                text = 'VIEW';
            } else if (target.classList.contains('btn')) {
                text = 'EXPLORE';
            } else if (target.classList.contains('floating-label')) {
                text = 'EXPLORE';
            }

            if (cursorTextLabel) {
                cursorTextLabel.textContent = text;
            }
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest(interactiveSelectors);
        if (target) {
            isHovering = false;
            document.body.classList.remove('hovering-link');
        }
    });

    // Disable old cursor ring update in unified loop
    window._cursorRingUpdate = null;

    // WebGL Fluid Simulation Core
    function pointerPrototype() {
        this.id = -1;
        this.texcoordX = 0;
        this.texcoordY = 0;
        this.prevTexcoordX = 0;
        this.prevTexcoordY = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.down = false;
        this.moved = false;
        this.color = [0, 0, 0];
    }

    let pointers = [new pointerPrototype()];

    const { gl, ext } = getWebGLContext(canvas);
    if (!gl) return;

    if (!ext.supportLinearFiltering) {
        config.DYE_RESOLUTION = 256;
        config.SHADING = false;
    }

    function getWebGLContext(canvas) {
        const params = {
            alpha: true,
            depth: false,
            stencil: false,
            antialias: false,
            preserveDrawingBuffer: false
        };
        let gl = canvas.getContext('webgl2', params);
        const isWebGL2 = !!gl;
        if (!isWebGL2) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
        if (!gl) return { gl: null, ext: null };

        let halfFloat;
        let supportLinearFiltering;
        if (isWebGL2) {
            gl.getExtension('EXT_color_buffer_float');
            supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
        } else {
            halfFloat = gl.getExtension('OES_texture_half_float');
            supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
        }
        gl.clearColor(0.0, 0.0, 0.0, 0.0);

        const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat && halfFloat.HALF_FLOAT_OES;
        let formatRGBA;
        let formatRG;
        let formatR;

        if (isWebGL2) {
            formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
            formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
        } else {
            formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        }

        return {
            gl,
            ext: {
                formatRGBA,
                formatRG,
                formatR,
                halfFloatTexType,
                supportLinearFiltering
            }
        };
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
        if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
            switch (internalFormat) {
                case gl.R16F:
                    return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
                case gl.RG16F:
                    return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
                default:
                    return null;
            }
        }
        return { internalFormat, format };
    }

    function supportRenderTextureFormat(gl, internalFormat, format, type) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        return status === gl.FRAMEBUFFER_COMPLETE;
    }

    class Material {
        constructor(vertexShader, fragmentShaderSource) {
            this.vertexShader = vertexShader;
            this.fragmentShaderSource = fragmentShaderSource;
            this.programs = [];
            this.activeProgram = null;
            this.uniforms = [];
        }
        setKeywords(keywords) {
            let hash = 0;
            for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);
            let program = this.programs[hash];
            if (program == null) {
                let fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
                program = createProgram(this.vertexShader, fragmentShader);
                this.programs[hash] = program;
            }
            if (program === this.activeProgram) return;
            this.uniforms = getUniforms(program);
            this.activeProgram = program;
        }
        bind() {
            gl.useProgram(this.activeProgram);
        }
    }

    class Program {
        constructor(vertexShader, fragmentShader) {
            this.uniforms = {};
            this.program = createProgram(vertexShader, fragmentShader);
            this.uniforms = getUniforms(this.program);
        }
        bind() {
            gl.useProgram(this.program);
        }
    }

    function createProgram(vertexShader, fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) console.trace(gl.getProgramInfoLog(program));
        return program;
    }

    function getUniforms(program) {
        let uniforms = [];
        let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            let uniformName = gl.getActiveUniform(program, i).name;
            uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
        }
        return uniforms;
    }

    function compileShader(type, source, keywords) {
        source = addKeywords(source, keywords);
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.trace(gl.getShaderInfoLog(shader));
        return shader;
    }

    function addKeywords(source, keywords) {
        if (!keywords) return source;
        let keywordsString = '';
        keywords.forEach(keyword => {
            keywordsString += '#define ' + keyword + '\n';
        });
        return keywordsString + source;
    }

    const baseVertexShader = compileShader(
        gl.VERTEX_SHADER,
        `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `
    );

    const copyShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;

        void main () {
            gl_FragColor = texture2D(uTexture, vUv);
        }
      `
    );

    const clearShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;

        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
      `
    );

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;

              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);

              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);

              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif

          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `;

    const splatShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
      `
    );

    const advectionShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;

        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);

            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }

        void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
      `,
        ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']
    );

    const divergenceShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;

            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `
    );

    const curlShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `
    );

    const vorticityShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `
    );

    const pressureShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `
    );

    const gradientSubtractShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `
    );

    const blit = (() => {
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        return (target, clear = false) => {
            if (target == null) {
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            } else {
                gl.viewport(0, 0, target.width, target.height);
                gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
            }
            if (clear) {
                gl.clearColor(0.0, 0.0, 0.0, 0.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        };
    })();

    let dye, velocity, divergence, curl, pressure;

    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
    const displayMaterial = new Material(baseVertexShader, displayShaderSource);

    function initFramebuffers() {
        let simRes = getResolution(config.SIM_RESOLUTION);
        let dyeRes = getResolution(config.DYE_RESOLUTION);
        const texType = ext.halfFloatTexType;
        const rgba = ext.formatRGBA;
        const rg = ext.formatRG;
        const r = ext.formatR;
        const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
        gl.disable(gl.BLEND);

        if (!dye)
            dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
        else
            dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);

        if (!velocity)
            velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
        else
            velocity = resizeDoubleFBO(
                velocity,
                simRes.width,
                simRes.height,
                rg.internalFormat,
                rg.format,
                texType,
                filtering
            );

        divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    }

    function createFBO(w, h, internalFormat, format, type, param) {
        gl.activeTexture(gl.TEXTURE0);
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

        let fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.viewport(0, 0, w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);

        let texelSizeX = 1.0 / w;
        let texelSizeY = 1.0 / h;
        return {
            texture,
            fbo,
            width: w,
            height: h,
            texelSizeX,
            texelSizeY,
            attach(id) {
                gl.activeTexture(gl.TEXTURE0 + id);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                return id;
            }
        };
    }

    function createDoubleFBO(w, h, internalFormat, format, type, param) {
        let fbo1 = createFBO(w, h, internalFormat, format, type, param);
        let fbo2 = createFBO(w, h, internalFormat, format, type, param);
        return {
            width: w,
            height: h,
            texelSizeX: fbo1.texelSizeX,
            texelSizeY: fbo1.texelSizeY,
            get read() {
                return fbo1;
            },
            set read(value) {
                fbo1 = value;
            },
            get write() {
                return fbo2;
            },
            set write(value) {
                fbo2 = value;
            },
            swap() {
                let temp = fbo1;
                fbo1 = fbo2;
                fbo2 = temp;
            }
        };
    }

    function resizeFBO(target, w, h, internalFormat, format, type, param) {
        let newFBO = createFBO(w, h, internalFormat, format, type, param);
        copyProgram.bind();
        gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
        blit(newFBO);
        return newFBO;
    }

    function resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
        if (target.width === w && target.height === h) return target;
        target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
        target.write = createFBO(w, h, internalFormat, format, type, param);
        target.width = w;
        target.height = h;
        target.texelSizeX = 1.0 / w;
        target.texelSizeY = 1.0 / h;
        return target;
    }

    function updateKeywords() {
        let displayKeywords = [];
        if (config.SHADING) displayKeywords.push('SHADING');
        displayMaterial.setKeywords(displayKeywords);
    }

    updateKeywords();
    initFramebuffers();
    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0.0;

    function updateFrame() {
        const dt = calcDeltaTime();
        if (resizeCanvas()) initFramebuffers();
        updateColors(dt);
        applyInputs();
        step(dt);
        render(null);
        requestAnimationFrame(updateFrame);
    }

    function calcDeltaTime() {
        let now = Date.now();
        let dt = (now - lastUpdateTime) / 1000;
        dt = Math.min(dt, 0.016666);
        lastUpdateTime = now;
        return dt;
    }

    function resizeCanvas() {
        let width = scaleByPixelRatio(canvas.clientWidth);
        let height = scaleByPixelRatio(canvas.clientHeight);
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            return true;
        }
        return false;
    }

    function updateColors(dt) {
        colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
        if (colorUpdateTimer >= 1) {
            colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
            pointers.forEach(p => {
                p.color = generateColor();
            });
        }
    }

    function applyInputs() {
        pointers.forEach(p => {
            if (p.moved) {
                p.moved = false;
                splatPointer(p);
            }
        });
    }

    function step(dt) {
        gl.disable(gl.BLEND);
        curlProgram.bind();
        gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
        blit(curl);

        vorticityProgram.bind();
        gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
        gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
        gl.uniform1f(vorticityProgram.uniforms.dt, dt);
        blit(velocity.write);
        velocity.swap();

        divergenceProgram.bind();
        gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
        blit(divergence);

        clearProgram.bind();
        gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
        gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
        blit(pressure.write);
        pressure.swap();

        pressureProgram.bind();
        gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
        for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
            gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
            blit(pressure.write);
            pressure.swap();
        }

        gradienSubtractProgram.bind();
        gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
        gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
        blit(velocity.write);
        velocity.swap();

        advectionProgram.bind();
        gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        if (!ext.supportLinearFiltering)
            gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
        let velocityId = velocity.read.attach(0);
        gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
        gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
        gl.uniform1f(advectionProgram.uniforms.dt, dt);
        gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
        blit(velocity.write);
        velocity.swap();

        if (!ext.supportLinearFiltering)
            gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
        gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
        gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
        blit(dye.write);
        dye.swap();
    }

    function render(target) {
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        drawDisplay(target);
    }

    function drawDisplay(target) {
        let width = target == null ? gl.drawingBufferWidth : target.width;
        let height = target == null ? gl.drawingBufferHeight : target.height;
        displayMaterial.bind();
        if (config.SHADING) gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
        gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
        blit(target);
    }

    function splatPointer(pointer) {
        let dx = pointer.deltaX * config.SPLAT_FORCE;
        let dy = pointer.deltaY * config.SPLAT_FORCE;
        splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }

    function clickSplat(pointer) {
        const color = generateColor();
        color.r *= 10.0;
        color.g *= 10.0;
        color.b *= 10.0;
        let dx = 10 * (Math.random() - 0.5);
        let dy = 30 * (Math.random() - 0.5);
        splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
    }

    function splat(x, y, dx, dy, color) {
        splatProgram.bind();
        gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
        gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
        gl.uniform2f(splatProgram.uniforms.point, x, y);
        gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
        gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100.0));
        blit(velocity.write);
        velocity.swap();

        gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
        gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
        blit(dye.write);
        dye.swap();
    }

    function correctRadius(radius) {
        let aspectRatio = canvas.width / canvas.height;
        if (aspectRatio > 1) radius *= aspectRatio;
        return radius;
    }

    function updatePointerDownData(pointer, id, posX, posY) {
        pointer.id = id;
        pointer.down = true;
        pointer.moved = false;
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1.0 - posY / canvas.height;
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.deltaX = 0;
        pointer.deltaY = 0;
        pointer.color = generateColor();
    }

    function updatePointerMoveData(pointer, posX, posY, color) {
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1.0 - posY / canvas.height;
        pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
        pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
        pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
        pointer.color = color;
    }

    function updatePointerUpData(pointer) {
        pointer.down = false;
    }

    function correctDeltaX(delta) {
        let aspectRatio = canvas.width / canvas.height;
        if (aspectRatio < 1) delta *= aspectRatio;
        return delta;
    }

    function correctDeltaY(delta) {
        let aspectRatio = canvas.width / canvas.height;
        if (aspectRatio > 1) delta /= aspectRatio;
        return delta;
    }

    function hexToRGB(hex) {
        let val = hex.replace('#', '');
        if (val.length === 3) val = val[0] + val[0] + val[1] + val[1] + val[2] + val[2];
        const r = parseInt(val.slice(0, 2), 16) / 255;
        const g = parseInt(val.slice(2, 4), 16) / 255;
        const b = parseInt(val.slice(4, 6), 16) / 255;
        return { r: r * 0.15, g: g * 0.15, b: b * 0.15 };
    }

    function generateColor() {
        if (!config.RAINBOW_MODE) {
            return hexToRGB(config.COLOR);
        }
        let c = HSVtoRGB(Math.random(), 1.0, 1.0);
        c.r *= 0.15;
        c.g *= 0.15;
        c.b *= 0.15;
        return c;
    }

    function HSVtoRGB(h, s, v) {
        let r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        return { r, g, b };
    }

    function wrap(value, min, max) {
        const range = max - min;
        if (range === 0) return min;
        return ((value - min) % range) + min;
    }

    function getResolution(resolution) {
        let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
        const min = Math.round(resolution);
        const max = Math.round(resolution * aspectRatio);
        if (gl.drawingBufferWidth > gl.drawingBufferHeight) return { width: max, height: min };
        else return { width: min, height: max };
    }

    function scaleByPixelRatio(input) {
        const pixelRatio = window.devicePixelRatio || 1;
        return Math.floor(input * pixelRatio);
    }

    function hashCode(s) {
        if (s.length === 0) return 0;
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            hash = (hash << 5) - hash + s.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    function handleMouseDown(e) {
        let pointer = pointers[0];
        let posX = scaleByPixelRatio(e.clientX);
        let posY = scaleByPixelRatio(e.clientY);
        updatePointerDownData(pointer, -1, posX, posY);
        clickSplat(pointer);
    }

    let firstMouseMoveHandled = false;
    function handleMouseMove(e) {
        let pointer = pointers[0];
        let posX = scaleByPixelRatio(e.clientX);
        let posY = scaleByPixelRatio(e.clientY);
        if (!firstMouseMoveHandled) {
            let color = generateColor();
            updatePointerMoveData(pointer, posX, posY, color);
            firstMouseMoveHandled = true;
        } else {
            updatePointerMoveData(pointer, posX, posY, pointer.color);
        }
    }

    function handleTouchStart(e) {
        const touches = e.targetTouches;
        let pointer = pointers[0];
        for (let i = 0; i < touches.length; i++) {
            let posX = scaleByPixelRatio(touches[i].clientX);
            let posY = scaleByPixelRatio(touches[i].clientY);
            updatePointerDownData(pointer, touches[i].identifier, posX, posY);
        }
    }

    function handleTouchMove(e) {
        const touches = e.targetTouches;
        let pointer = pointers[0];
        for (let i = 0; i < touches.length; i++) {
            let posX = scaleByPixelRatio(touches[i].clientX);
            let posY = scaleByPixelRatio(touches[i].clientY);
            updatePointerMoveData(pointer, posX, posY, pointer.color);
        }
    }

    function handleTouchEnd(e) {
        const touches = e.changedTouches;
        let pointer = pointers[0];
        for (let i = 0; i < touches.length; i++) {
            updatePointerUpData(pointer);
        }
    }

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    updateFrame();
}



      /* ============================================================
   7. PREMIUM HERO ANIMATIONS (GSAP & Interactive Parallax)
   ============================================================ */
let heroInteractiveInitialized = false;

function initPremiumHero() {
    const gridBg = document.getElementById('hero-grid-bg');
    const bgName = document.getElementById('bg-name');
    const subtitle = document.getElementById('hero-subtitle');
    const portText = document.getElementById('port-text');
    const folioText = document.getElementById('folio-text');
    const portraitGlow = document.getElementById('portrait-glow');
    const portraitWrapper = document.getElementById('portrait-wrapper');
    const rotatingRing = document.getElementById('rotating-ring');
    const floatingLabels = document.querySelectorAll('.floating-label');
    const heroLines = document.querySelectorAll('.hero-line');

    if (gridBg) gsap.set(gridBg, { opacity: 0 });
    if (bgName) gsap.set(bgName, { opacity: 0, filter: 'blur(10px)' });
    if (subtitle) gsap.set(subtitle, { opacity: 0, y: -20 });
    if (portText) gsap.set(portText, { opacity: 0, x: -150 });
    if (folioText) gsap.set(folioText, { opacity: 0, x: 150 });
    if (portraitGlow) gsap.set(portraitGlow, { opacity: 0, scale: 0.5 });
    if (portraitWrapper) gsap.set(portraitWrapper, { opacity: 0, y: 80 });
    if (rotatingRing) gsap.set(rotatingRing, { opacity: 0, scale: 0.8 });
    
    heroLines.forEach(line => gsap.set(line, { scaleX: 0 }));
    floatingLabels.forEach(label => gsap.set(label, { opacity: 0, y: 30 }));
}

function triggerPremiumHeroReveal(isInstant = false) {
    const gridBg = document.getElementById('hero-grid-bg');
    const bgName = document.getElementById('bg-name');
    const subtitle = document.getElementById('hero-subtitle');
    const portText = document.getElementById('port-text');
    const folioText = document.getElementById('folio-text');
    const portraitGlow = document.getElementById('portrait-glow');
    const portraitWrapper = document.getElementById('portrait-wrapper');
    const rotatingRing = document.getElementById('rotating-ring');
    const floatingLabels = document.querySelectorAll('.floating-label');
    const heroLines = document.querySelectorAll('.hero-line');

    if (isInstant) {
        // Render final animation states instantly
        if (gridBg) gsap.set(gridBg, { opacity: 1 });
        if (heroLines.length) heroLines.forEach(line => gsap.set(line, { scaleX: 1 }));
        if (portText) gsap.set(portText, { opacity: 1, x: 0 });
        if (folioText) gsap.set(folioText, { opacity: 1, x: 0 });
        if (portraitWrapper) gsap.set(portraitWrapper, { opacity: 1, y: 0 });
        if (portraitGlow) gsap.set(portraitGlow, { opacity: 1, scale: 1 });
        if (rotatingRing) gsap.set(rotatingRing, { opacity: 1, scale: 1 });
        if (subtitle) gsap.set(subtitle, { opacity: 1, y: 0 });
        if (floatingLabels.length) floatingLabels.forEach(label => gsap.set(label, { opacity: 1, y: 0 }));

        initHeroInteractions();
        startWatermarkAnimation();
        initHeroScrollTransitions();
        return;
    }

    const tl = gsap.timeline({
        onComplete: () => {
            initHeroInteractions();
            startWatermarkAnimation();
            initHeroScrollTransitions();
        }
    });

    // 1. Grid and lines fade in
    tl.to(gridBg, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0)
      .to(heroLines, { scaleX: 1, duration: 0.8, ease: "power3.inOut", stagger: 0.1 }, 0.1)
      
    // 2. PORT & FOLIO text slides in
      .to(portText, { opacity: 1, x: 0, duration: 0.8, ease: "power4.out" }, 0.2)
      .to(folioText, { opacity: 1, x: 0, duration: 0.8, ease: "power4.out" }, 0.2)

    // 3. Portrait wrapper rises up and glows
      .to(portraitWrapper, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.2)
      .to(portraitGlow, { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" }, 0.3)
      .to(rotatingRing, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }, 0.4)

    // 5. Labels and subtitle fade in
      .to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.6)
      .to(floatingLabels, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.5)", stagger: 0.08 }, 0.5);
}

function initHeroInteractions() {
    if (heroInteractiveInitialized) return;
    heroInteractiveInitialized = true;

    const hero = document.getElementById('hero');
    const portraitWrapper = document.getElementById('portrait-wrapper');
    const bgName = document.getElementById('bg-name');
    const gridBg = document.getElementById('hero-grid-bg');
    const cursorGlow = document.getElementById('cursor-glow');

    if (!hero) return;

    // Mouse movement tracking for parallax and glow
    hero.addEventListener('mousemove', (e) => {

        // Parallax calculations (normalized dx/dy from -1 to 1)
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;

        // Portrait subtle translation (no aggressive 3D rotations for a cleaner, professional feel)
        if (portraitWrapper) {
            gsap.to(portraitWrapper, {
                x: dx * 15,
                y: dy * 10,
                duration: 0.8,
                ease: "power2.out",
                overwrite: "auto"
            });
        }

        // Background name watermark movement (opposite direction for depth)
        if (bgName) {
            gsap.to(bgName, {
                x: -dx * 30,
                y: -dy * 15,
                duration: 1.0,
                ease: "power2.out",
                overwrite: "auto"
            });
        }

        // Grid bg movement
        if (gridBg) {
            gsap.to(gridBg, {
                x: dx * 10,
                y: dy * 10,
                duration: 1.2,
                ease: "power2.out",
                overwrite: "auto"
            });
        }
    });

    // Reset parallax on mouse leave
    hero.addEventListener('mouseleave', () => {
        if (portraitWrapper) {
            gsap.to(portraitWrapper, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        }
        if (bgName) {
            gsap.to(bgName, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        }
        if (gridBg) {
            gsap.to(gridBg, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        }
    });
}

function startWatermarkAnimation() {
    const bgName = document.getElementById('bg-name');
    if (!bgName) return;

    // Set initial state
    gsap.set(bgName, { opacity: 0, filter: 'blur(10px)' });

    // Loop timeline: Fade In = 2s, Hold = 4s, Fade Out = 2s, Loop infinitely. Total cycle = 8s.
    const watermarkTl = gsap.timeline({ repeat: -1 });

    watermarkTl
        .to(bgName, {
            opacity: 0.07, // 7% opacity
            filter: 'blur(0px)',
            duration: 2.0,
            ease: 'power2.inOut'
        })
        .to(bgName, {
            // Hold state
            duration: 4.0
        })
        .to(bgName, {
            opacity: 0,
            filter: 'blur(10px)',
            duration: 2.0,
            ease: 'power2.inOut'
        });
}

function initHeroScrollTransitions() {
    const portText = document.getElementById('port-text');
    const folioText = document.getElementById('folio-text');
    const portraitBlock = document.querySelector('.portrait-block');

    if (portText && folioText) {
        gsap.to([portText, folioText], {
            scale: 0.6,
            opacity: 0.08,
            y: 80,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'bottom bottom',
                end: 'bottom top',
                scrub: 1.2,
            }
        });
    }

    if (portraitBlock) {
        gsap.to(portraitBlock, {
            scale: 0.5,
            opacity: 0,
            y: -60,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'center center',
                end: 'bottom top',
                scrub: 1,
            }
        });
    }
}

function initMagnetics() {
    const interactiveElements = document.querySelectorAll('.nav-links li a, .logo, .btn, .about-skill-pill, .floating-label, .skill-pill-marquee');
    interactiveElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const bounds = el.getBoundingClientRect();
            const cx = bounds.left + bounds.width / 2;
            const cy = bounds.top + bounds.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;

            // Subtle 12% pull
            gsap.to(el, {
                x: dx * 0.12,
                y: dy * 0.12,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
    });
}

function initFloatingLabelsIdle() {
    const inners = document.querySelectorAll('.floating-label-inner');
    inners.forEach((inner, i) => {
        inner.style.animationDelay = `${i * 0.4}s`;
        inner.style.animationDuration = `${4.0 + (i % 3) * 0.6}s`;
    });
}

/* ============================================================
   PREMIUM ABOUT SECTION — ScrollTrigger Animations
   ============================================================ */
function initAboutSection() {
    // Guard: only run if ScrollTrigger and the about section exist
    if (typeof ScrollTrigger === 'undefined') {
        console.warn('ScrollTrigger not loaded, About section animations disabled.');
        return;
    }
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    // ─── 3. Section Header Reveal ───
    const aboutLabel = document.querySelector('.about-label');
    const aboutTitle = document.getElementById('about-title');
    const aboutSubtitle = document.getElementById('about-subtitle-text');

    const headerTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.about-header',
            start: 'top 80%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
        }
    });

    if (aboutLabel) {
        headerTl.to(aboutLabel, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, 0);
    }

    if (aboutTitle) {
        headerTl.to(aboutTitle, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power4.out'
        }, 0.1);
    }

    if (aboutSubtitle) {
        headerTl.to(aboutSubtitle, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out'
        }, 0.3);
    }

    // ─── 4. Paragraph Staggered Reveals ───
    const paragraphs = document.querySelectorAll('.about-paragraph');
    paragraphs.forEach((p, i) => {
        gsap.to(p, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: p,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
            delay: i * 0.05
        });
    });

    // Focus Areas reveal
    const focusAreas = document.querySelector('.about-focus-areas');
    if (focusAreas) {
        gsap.to(focusAreas, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: focusAreas,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            }
        });
    }

    // ─── 5. Floating Profile Animation ───
    const profileFloat = document.getElementById('about-profile-float');
    if (profileFloat) {
        gsap.to(profileFloat, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: profileFloat,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            }
        });

        // Subtle parallax on scroll
        gsap.to(profileFloat, {
            y: -30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.about-right',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
            }
        });
    }

    // ─── 6. Timeline Progressive Draw ───
    const timelineItems = document.querySelectorAll('.about-timeline-item');
    const timelineProgress = document.getElementById('timeline-progress');
    const aboutTimeline = document.getElementById('about-timeline');

    if (aboutTimeline && timelineProgress) {
        // Line draws on scroll
        gsap.to(timelineProgress, {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: aboutTimeline,
                start: 'top 75%',
                end: 'bottom 50%',
                scrub: 1,
            }
        });
    }

    // Cards reveal progressively
    timelineItems.forEach((item, i) => {
        gsap.to(item, {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 82%',
                toggleActions: 'play none none reverse',
                onEnter: () => item.classList.add('active'),
                onLeaveBack: () => item.classList.remove('active'),
            },
            delay: i * 0.05
        });
    });

    // ─── 7. Auto Scrolling Skills Marquee Reveal ───
    const aboutMarquee = document.querySelector('.about-skills-marquee-container');
    if (aboutMarquee) {
        gsap.fromTo(aboutMarquee, 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1.0, 
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: aboutMarquee,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }

    // ─── 8. Philosophy Quote — Word-by-Word Blur Reveal ───
    const philosophyQuote = document.getElementById('philosophy-quote');
    if (philosophyQuote) {
        const text = philosophyQuote.textContent.trim();
        const words = text.split(/\s+/);
        philosophyQuote.innerHTML = words.map(word =>
            `<span class="philosophy-word">${word}</span>`
        ).join(' ');

        const wordEls = philosophyQuote.querySelectorAll('.philosophy-word');

        ScrollTrigger.create({
            trigger: '.about-philosophy',
            start: 'top 70%',
            end: 'bottom 50%',
            onEnter: () => {
                wordEls.forEach((el, i) => {
                    setTimeout(() => {
                        el.classList.add('revealed');
                    }, i * 120);
                });
            },
            onLeaveBack: () => {
                wordEls.forEach(el => el.classList.remove('revealed'));
            }
        });
    }

    // ─── 9. Stats Counter Animation ───
    const statCards = document.querySelectorAll('.about-stat-card');

    statCards.forEach((card, i) => {
        const numberEl = card.querySelector('.stat-number');
        const targetCount = parseInt(card.dataset.count, 10);

        // Reveal card
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-stats',
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
            delay: i * 0.1
        });

        // Counter animation (skip for text-only stat like "MCA")
        if (numberEl && !numberEl.classList.contains('stat-text') && !isNaN(targetCount) && targetCount > 0) {
            const counter = { val: 0 };
            ScrollTrigger.create({
                trigger: card,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    gsap.to(counter, {
                        val: targetCount,
                        duration: 1.5 + (targetCount > 10 ? 0.5 : 0),
                        ease: 'power2.out',
                        onUpdate: () => {
                            numberEl.textContent = Math.floor(counter.val);
                        }
                    });
                }
            });
        }
    });

}

/* ============================================================
   PREMIUM PROJECTS SECTION — ScrollTrigger Horizontal Pin
   ============================================================ */
function initProjectsSection() {
    const projectsSection = document.getElementById('projects');
    const editorialContainer = document.querySelector('.projects-editorial-container');
    const floatingPreview = document.getElementById('projects-floating-preview');
    if (!projectsSection) return;

    // Header reveal timeline
    const headerTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.projects-header',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        }
    });
    headerTl.to('.projects-label', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
            .to('.projects-title', { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' }, '-=0.45')
            .to('.projects-subtitle', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.45');

    // Reveal project rows progressively
    const rows = document.querySelectorAll('.project-editorial-row');
    rows.forEach((row, idx) => {
        gsap.fromTo(row, 
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: row,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                },
                delay: idx * 0.08
            }
        );
    });


}

/* ============================================================
   PREMIUM EXPERIENCE SECTION — Editorial Timeline
   ============================================================ */
function initExperienceSection() {
    const section = document.getElementById('experience');
    if (!section) return;

    // Header reveal timeline
    const headerTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.experience-header',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        }
    });
    headerTl.to('.experience-label', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
            .to('.experience-title', { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' }, '-=0.45')
            .to('.experience-subtitle', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.45');

    // Details card slide/reveal
    gsap.to('.experience-details-card', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.experience-details-card',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
        }
    });

}

/* ============================================================
   PREMIUM SKILLS SECTION — Ecosystem
   ============================================================ */
function initSkillsSection() {
    const section = document.getElementById('skills');
    if (!section) return;

    // Unified entrance timeline triggered when the skills section enters the viewport
    const skillsTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#skills',
            start: 'top 85%',
            once: true
        }
    });

    // Reveal header and marquee tracks in a staggered, premium sequence
    skillsTl.to('.skills-label', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
            .to('.skills-title', { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' }, '-=0.45')
            .to('.skills-subtitle', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.45')
            .fromTo('#skills-row-1', { x: -120, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, '-=0.55')
            .fromTo('#skills-row-2', { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, '-=1.0');

}

/* ============================================================
   PREMIUM DESIGN PROCESS — Horizontal steps with connection line
   ============================================================ */
function initDesignFlowSection() {
    const section = document.getElementById('design-flow');
    const stepsWrapper = document.getElementById('flow-steps-wrapper');
    const progressLine = document.getElementById('flow-track-progress');
    if (!section || !stepsWrapper) return;

    // Header reveal timeline
    const headerTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.flow-header',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        }
    });
    headerTl.to('.flow-label', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
            .to('.flow-title', { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' }, '-=0.45')
            .to('.flow-subtitle', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.45');

    // Vertical Scroll Tracker line animation
    if (progressLine) {
        gsap.to(progressLine, {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: '#flow-steps-wrapper',
                start: 'top 70%',
                end: 'bottom 70%',
                scrub: true
            }
        });
    }

    // Step cards animations
    const stepCards = document.querySelectorAll('.flow-step-card');
    stepCards.forEach((card) => {
        // 1. Reveal on viewport entrance (only once)
        ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                card.classList.add('revealed');
            }
        });

        // 2. Toggle active state focus sequentially as card passes the sweet spot
        ScrollTrigger.create({
            trigger: card,
            start: 'top 65%',
            end: 'bottom 45%',
            onEnter: () => card.classList.add('active'),
            onLeave: () => card.classList.remove('active'),
            onEnterBack: () => card.classList.add('active'),
            onLeaveBack: () => card.classList.remove('active')
        });
    });

}

/* ============================================================
   PREMIUM CONTACT & FOOTER SECTION — Copier & Triggers
   ============================================================ */
function initContactSection() {
    const section = document.getElementById('contact');
    if (!section) return;

    // Header reveal timeline
    const headerTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.contact-header',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        }
    });
    headerTl.to('.contact-label', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
            .to('.contact-title', { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' }, '-=0.45')
            .to('.contact-subtitle', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.45');

    // Stagger contact info cards
    const cards = document.querySelectorAll('.contact-card');
    cards.forEach((card, idx) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
            delay: idx * 0.12
        });
    });

    // CTA actions reveal
    gsap.to('.contact-actions', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact-actions',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        }
    });

    // Clipboard Copy Action
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const textVal = btn.getAttribute('data-clipboard');
            if (textVal) {
                navigator.clipboard.writeText(textVal).then(() => {
                    const textSpan = btn.querySelector('.copy-text');
                    const origVal = textSpan ? textSpan.textContent : 'Copy';
                    if (textSpan) textSpan.textContent = 'Copied!';
                    btn.classList.add('success');
                    
                    setTimeout(() => {
                        if (textSpan) textSpan.textContent = origVal;
                        btn.classList.remove('success');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            }
        });
    });

    // Resume Download Toast Action
    const resumeBtn = document.querySelector('.contact-resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            showToast('Resume Download Started');
        });
    }

    // Helper to create and show premium toast notification
    function showToast(message) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.position = 'fixed';
            container.style.bottom = '40px';
            container.style.right = '40px';
            container.style.zIndex = '99999';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '12px';
            container.style.pointerEvents = 'none';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.textContent = message;
        
        toast.style.background = 'rgba(255, 255, 255, 0.85)';
        toast.style.backdropFilter = 'blur(12px)';
        toast.style.webkitBackdropFilter = 'blur(12px)';
        toast.style.border = '1px solid rgba(77, 159, 255, 0.35)';
        toast.style.borderRadius = '12px';
        toast.style.padding = '14px 24px';
        toast.style.color = '#111111';
        toast.style.fontFamily = "'Space Grotesk', sans-serif";
        toast.style.fontSize = '14px';
        toast.style.fontWeight = '600';
        toast.style.boxShadow = '0 10px 30px rgba(77, 159, 255, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        toast.style.pointerEvents = 'auto';

        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => {
                toast.remove();
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 400);
        }, 2000);
    }
}

/* ============================================================
   PREMIUM CASE STUDY MODAL SYSTEM — Dynamic AJAX Router
   ============================================================ */
function initCaseStudyModal() {
    const modal = document.getElementById('case-study-modal');
    const container = document.getElementById('modal-content-container');
    const closeBtn = document.getElementById('modal-close-btn');
    if (!modal || !container || !closeBtn) return;

    // Open Case Study click listener
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        const isInteractive = e.target.closest('.color-picker-dot, .roast-chip, .calendar-slot');
        if (card && !isInteractive) {
            e.preventDefault();
            const studyName = card.getAttribute('data-project');
            if (studyName) {
                // Fade out other cards for a smooth transition focus
                const otherCards = document.querySelectorAll(`.project-card:not([data-project="${studyName}"])`);
                gsap.to(otherCards, {
                    opacity: 0.15,
                    scale: 0.96,
                    duration: 0.4,
                    ease: "power2.out"
                });

                // Focus/scale clicked card slightly for feedback
                gsap.to(card, {
                    scale: 1.02,
                    duration: 0.4,
                    ease: "power2.out"
                });

                // Fetch dynamic HTML file contents
                fetch(`./case-studies/${studyName}.html`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to load case study contents (${response.status})`);
                        }
                        return response.text();
                    })
                    .then(html => {
                        container.innerHTML = html;
                        modal.classList.add('active');

                        // Stop scroll engines on parent body
                        if (lenisInstance) lenisInstance.stop();
                        document.body.style.overflow = 'hidden';

                        // Scroll internal contents to top
                        container.scrollTop = 0;
                    })
                    .catch(err => {
                        console.error('Case Study Router error:', err);
                        container.innerHTML = `
                            <div style="padding: 120px 40px; text-align: center; color: #111111; font-family: 'Space Grotesk', sans-serif;">
                                <h3 style="font-size: 24px; color: #4D9FFF; margin-bottom: 16px;">Case Study under construction</h3>
                                <p style="color: rgba(17,17,17,0.6); max-width: 500px; margin: 0 auto; line-height: 1.6;">
                                    This visual prototype folder is currently being finalized. Feel free to explore other selected case studies.
                                </p>
                            </div>
                        `;
                        modal.classList.add('active');
                        if (lenisInstance) lenisInstance.stop();
                        document.body.style.overflow = 'hidden';
                    });
            }
        }
    });

    const closeModal = () => {
        modal.classList.remove('active');
        if (lenisInstance) lenisInstance.start();
        document.body.style.overflow = '';
        
        // Restore all project cards to normal opacity
        const allCards = document.querySelectorAll('.project-card');
        gsap.to(allCards, {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "power3.out"
        });

        // Wait for slide-out/fade animation, then purge modal content
        setTimeout(() => {
            container.innerHTML = '';
        }, 500);
    };

    // Close button click listener
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
    });

    // Close when clicking overlay dark background
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('case-study-modal-bg') || e.target.closest('.case-study-modal-bg')) {
            closeModal();
        }
    });

    // Close when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* Helper function to update Nav Links Active Indicator */
function updateNavActiveLink(targetSelector) {
    const navLinks = document.querySelectorAll('.nav-links li a');
    navLinks.forEach(link => link.classList.remove('active'));
    const matchingLink = document.querySelector(`.nav-links a[href="${targetSelector}"]`);
    if (matchingLink) {
        matchingLink.classList.add('active');
    }

    const mobileLinks = document.querySelectorAll('.mobile-nav-links li a');
    mobileLinks.forEach(link => link.classList.remove('active'));
    const matchingMobileLink = document.querySelector(`.mobile-nav-links a[href="${targetSelector}"]`);
    if (matchingMobileLink) {
        matchingMobileLink.classList.add('active');
    }
}

/* Centralized navigation active state Scroll Syncing */
function initNavScrollSync() {
    if (typeof ScrollTrigger === 'undefined') return;

    const sections = [
        { id: '#hero' },
        { id: '#about' },
        { id: '#projects' },
        { id: '#experience' },
        { id: '#skills' },
        { id: '#design-flow' },
        { id: '#contact' }
    ];

    sections.forEach(sec => {
        const el = document.querySelector(sec.id);
        if (!el) return;

        ScrollTrigger.create({
            trigger: el,
            start: sec.id === '#hero' ? 'top 10%' : 'top 50%',
            end: 'bottom 50%',
            onToggle: (self) => {
                if (self.isActive) {
                    updateNavActiveLink(sec.id);
                }
            }
        });
    });
}

/* Redesigned navbar scroll-morphic transition logic */
let headerResizeHandler = null;
function initHeaderScroll() {
    const header = document.getElementById('header-nav');
    if (!header) return;

    if (headerResizeHandler) {
        window.removeEventListener('resize', headerResizeHandler);
    }

    const updateScaleFactor = () => {
        const w = window.innerWidth;
        let targetWidth = w * 0.75;
        let targetHeight = 54;
        let targetTop = 16;
        let padding = 40;
        
        if (w <= 768) {
            targetWidth = w * 0.92;
            targetHeight = 52;
            targetTop = 12;
            padding = 16;
        } else if (w <= 992) {
            targetWidth = w * 0.85;
            targetHeight = 54;
            targetTop = 16;
            padding = 24;
        } else {
            targetWidth = Math.min(w * 0.75, 1100);
            targetHeight = 54;
            targetTop = 16;
            padding = 40;
        }
        
        const scaleX = w / targetWidth;
        const scaleY = 64 / targetHeight;
        
        document.documentElement.style.setProperty('--nav-scale-x', scaleX);
        document.documentElement.style.setProperty('--nav-inv-scale-x', 1 / scaleX);
        document.documentElement.style.setProperty('--nav-scale-y', scaleY);
        document.documentElement.style.setProperty('--nav-inv-scale-y', 1 / scaleY);
        document.documentElement.style.setProperty('--nav-target-top', `${targetTop}px`);
        document.documentElement.style.setProperty('--nav-target-height', `${targetHeight}px`);
        document.documentElement.style.setProperty('--nav-target-width', `${targetWidth}px`);
        document.documentElement.style.setProperty('--nav-padding', `${padding}px`);
    };

    headerResizeHandler = updateScaleFactor;
    window.addEventListener('resize', updateScaleFactor, { passive: true });
    updateScaleFactor();
}

/* Mobile Hamburger Navigation Menu Toggle Overlay Handler */
function initMobileMenu() {
    const toggleBtn = document.getElementById('menu-toggle');
    const overlay = document.getElementById('mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const headerNav = document.getElementById('header-nav');

    if (!toggleBtn || !overlay) return;

    const toggleMenu = (forceClose = false) => {
        const isOpen = forceClose ? false : !overlay.classList.contains('active');
        
        if (isOpen) {
            toggleBtn.classList.add('active');
            overlay.classList.add('active');
            headerNav.classList.add('menu-open');
            document.body.style.overflow = 'hidden';
            if (lenisInstance) lenisInstance.stop();
        } else {
            toggleBtn.classList.remove('active');
            overlay.classList.remove('active');
            headerNav.classList.remove('menu-open');
            document.body.style.overflow = '';
            if (lenisInstance) lenisInstance.start();
        }
    };

    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu();
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            toggleMenu(true);
            
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    if (lenisInstance) {
                        lenisInstance.scrollTo(target, { offset: -60, duration: 1.2 });
                    } else {
                        window.scrollTo({
                            top: target.offsetTop - 60,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });
}

/* Synced Scroll state helper for active navbar morph transition */
function updateHeaderScroll() {
    const header = document.getElementById('header-nav');
    if (!header) return;
    const y = lenisInstance ? lenisInstance.scroll : window.scrollY;
    if (y > 80) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

/* ============================================================
   UNIFIED ANIMATION LOOP
   Single rAF drives Lenis, cursor ring, WebGL, hero tilt, widgets
   ============================================================ */
let unifiedLoopStarted = false;
function startUnifiedLoop() {
    if (unifiedLoopStarted) return;
    unifiedLoopStarted = true;

    function tick(time) {
        // 1. Lenis smooth scroll
        if (lenisInstance) lenisInstance.raf(time);

        // Update header scrolled morph class synced with Lenis scroll
        updateHeaderScroll();

        // 2. Cursor ring interpolation
        if (window._cursorRingUpdate) window._cursorRingUpdate();


        // 4. Hero content tilt (skipped when hero offscreen)
        if (window._heroTiltUpdate) window._heroTiltUpdate();

        // 5. Floating widget parallax (skipped when hero offscreen)
        if (window._floatingWidgetsUpdate) window._floatingWidgetsUpdate();

        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

/* ============================================================
   PROJECT CARD INTERACTIVES (Magnetics & Configurators)
   ============================================================ */

function initCardMagnetics() {
    const cards = document.querySelectorAll('.project-card:not(.project-editorial-row)');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const bounds = card.getBoundingClientRect();
            const cx = bounds.left + bounds.width / 2;
            const cy = bounds.top + bounds.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;

            // Update relative mouse coordinates for radial background glows
            const rx = e.clientX - bounds.left;
            const ry = e.clientY - bounds.top;
            card.style.setProperty('--x', `${rx}px`);
            card.style.setProperty('--y', `${ry}px`);

            // Subtle magnetic pull (5% max offset for heavy cards)
            gsap.to(card, {
                x: dx * 0.05,
                y: dy * 0.05,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto"
            });
            
            // Subtle offset tilt on card inner wrapper
            const inner = card.querySelector('.project-card-image-wrapper');
            if (inner) {
                gsap.to(inner, {
                    x: dx * 0.02,
                    y: dy * 0.02,
                    rotationY: dx * 0.015,
                    rotationX: -dy * 0.015,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                overwrite: "auto"
            });
            
            const inner = card.querySelector('.project-card-image-wrapper');
            if (inner) {
                gsap.to(inner, {
                    x: 0,
                    y: 0,
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    overwrite: "auto"
                });
            }
        });
    });
}

function initNikeConfigurator() {
    const dots = document.querySelectorAll('.color-picker-dot');
    const nikeCard = document.getElementById('nike-card-view');
    if (!nikeCard) return;

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');

            const color = dot.getAttribute('data-color');
            const colorDark = dot.getAttribute('data-color-dark');

            // Apply style overrides to color shoe layers in card
            nikeCard.style.setProperty('--nike-accent', color);
            nikeCard.style.setProperty('--nike-accent-dark', colorDark);

            // Animate shoe scaling on selection
            const shoe = nikeCard.querySelector('.nike-shoe-wrapper');
            if (shoe) {
                gsap.fromTo(shoe,
                    { scale: 0.95 },
                    { scale: 1.08, duration: 0.6, ease: "elastic.out(1.2, 0.5)" }
                );
            }
        });
    });
}

function initCoffeeSelector() {
    const chips = document.querySelectorAll('.roast-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const labelSticker = chip.closest('.mockup-coffeeshop').querySelector('.sticker-roast');
            if (labelSticker) {
                labelSticker.textContent = `LEVEL: ${chip.textContent.toUpperCase()}`;
            }

            const bag = chip.closest('.mockup-coffeeshop').querySelector('.coffee-bag');
            if (bag) {
                gsap.fromTo(bag,
                    { scale: 0.92 },
                    { scale: 1, duration: 0.5, ease: "back.out(1.5)" }
                );
            }
        });
    });
}

function initSportsBookingSlots() {
    const slots = document.querySelectorAll('.calendar-slot');
    slots.forEach(slot => {
        slot.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            slots.forEach(s => s.classList.remove('active'));
            slot.classList.add('active');

            const liveBadge = slot.closest('.mockup-sports').querySelector('.sports-live-badge');
            if (liveBadge) {
                if (slot.textContent.includes("12:00")) {
                    liveBadge.textContent = "BOOKED";
                    liveBadge.style.borderColor = "#ef4444";
                    liveBadge.style.color = "#ef4444";
                    liveBadge.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
                } else {
                    liveBadge.textContent = "AVAILABLE";
                    liveBadge.style.borderColor = "#22c55e";
                    liveBadge.style.color = "#22c55e";
                    liveBadge.style.backgroundColor = "rgba(34, 197, 94, 0.15)";
                }
            }
        });
    });
}
