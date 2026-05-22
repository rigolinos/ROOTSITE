// ============================================
// Root Code — Main Application (v2)
// Canvas 2D visuals + GSAP text overlays
// ============================================

import { VisualEngine } from './visuals.js';
import { clamp, isWebGLSupported, SECTION_COUNT, getSectionProgress, smoothstep } from './utils.js';

class App {
    constructor() {
        this.visuals = null;
        this.scrollProgress = 0;
        this.targetScrollProgress = 0;
        this.isRunning = false;
        this.lastTime = 0;
        this.sectionElements = [];
        this.currentSection = -1;

        // Loading
        this.loadingScreen = document.getElementById('loading-screen');
        this.loaderBar = document.getElementById('loader-bar');
        this.loaderStatus = document.getElementById('loader-status');

        this._init();
    }

    async _init() {
        try {
            this._updateLoader(15, 'Preparando o ambiente...');
            await this._sleep(300);

            // Initialize Canvas 2D visual engine
            const canvas = document.getElementById('visual-canvas');
            this._updateLoader(40, 'Inicializando motor visual...');
            this.visuals = new VisualEngine(canvas);
            await this._sleep(200);

            // Cache section elements
            this._updateLoader(60, 'Configurando seções...');
            this.sectionElements = Array.from(document.querySelectorAll('.section-overlay'));
            await this._sleep(200);

            // Setup scroll
            this._setupScroll();

            // Setup resize
            window.addEventListener('resize', () => {
                if (this.visuals) this.visuals.resize();
            });

            // Complete loading
            this._updateLoader(100, 'Pronto.');
            await this._sleep(500);

            // Hide loading screen and start
            this._hideLoader();
            this._start();

        } catch (error) {
            console.error('Init error:', error);
            this._showError('Erro ao inicializar. Recarregue a página.');
        }
    }

    // ── Scroll Setup ────────────────────────────
    _setupScroll() {
        const scrollContainer = document.getElementById('scroll-container');
        if (!scrollContainer) return;

        const updateScroll = () => {
            const scrollTop = window.scrollY || window.pageYOffset;
            const docHeight = scrollContainer.offsetHeight - window.innerHeight;
            this.targetScrollProgress = clamp(scrollTop / Math.max(docHeight, 1), 0, 0.999);
        };

        window.addEventListener('scroll', updateScroll, { passive: true });
        updateScroll();

        // Infinite loop: near end → reset to top
        let looping = false;
        setInterval(() => {
            if (looping) return;
            if (this.targetScrollProgress > 0.97) {
                looping = true;
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'auto' });
                    this.scrollProgress = 0;
                    this.targetScrollProgress = 0;
                    setTimeout(() => { looping = false; }, 200);
                }, 400);
            }
        }, 500);
    }

    // ── Section Text Management ─────────────────
    _updateSections(sectionIndex, sectionProgress) {
        if (sectionIndex !== this.currentSection) {
            // Deactivate old
            if (this.currentSection >= 0 && this.currentSection < this.sectionElements.length) {
                this.sectionElements[this.currentSection].classList.remove('active');
            }
            // Activate new
            if (sectionIndex >= 0 && sectionIndex < this.sectionElements.length) {
                this.sectionElements[sectionIndex].classList.add('active');
            }
            this.currentSection = sectionIndex;
        }

        // Fine-tune opacity and parallax
        this.sectionElements.forEach((el, i) => {
            if (i === sectionIndex) {
                let opacity;
                if (i === 0) {
                    // Hero: visible early, fades at end
                    opacity = smoothstep(0.2, 0.35, sectionProgress) * (1 - smoothstep(0.85, 1, sectionProgress));
                } else if (i === SECTION_COUNT - 1) {
                    // CTA: fades in and stays
                    opacity = smoothstep(0.15, 0.4, sectionProgress);
                } else {
                    // Middle sections
                    const fadeIn = smoothstep(0.05, 0.25, sectionProgress);
                    const fadeOut = 1 - smoothstep(0.8, 0.95, sectionProgress);
                    opacity = fadeIn * fadeOut;
                }
                el.style.opacity = opacity;

                // Subtle parallax on text
                const translateY = (0.5 - sectionProgress) * 25;
                const content = el.querySelector('.section-content');
                if (content) {
                    content.style.transform = `translateY(${translateY}px)`;
                }
            } else {
                el.style.opacity = 0;
            }
        });
    }

    // ── Animation Loop ──────────────────────────
    _start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this._animate();
    }

    _animate() {
        if (!this.isRunning) return;
        requestAnimationFrame(() => this._animate());

        const now = performance.now();
        const deltaTime = (now - this.lastTime) / 1000;
        this.lastTime = now;

        // Smooth scroll interpolation
        this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.07;

        // Determine section
        const { index, progress } = getSectionProgress(this.scrollProgress);

        // Update text overlays
        this._updateSections(index, progress);

        // Draw visuals
        this.visuals.draw(this.scrollProgress, deltaTime);
    }

    // ── Loading Helpers ─────────────────────────
    _updateLoader(percent, status) {
        if (this.loaderBar) this.loaderBar.style.width = `${percent}%`;
        if (this.loaderStatus) this.loaderStatus.textContent = status;
    }

    _hideLoader() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
            document.body.classList.add('loaded');
        }
    }

    _showError(msg) {
        if (this.loaderStatus) {
            this.loaderStatus.textContent = msg;
            this.loaderStatus.style.color = '#ff6b6b';
        }
    }

    _sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
}

// ── Initialize ──────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new App());
} else {
    new App();
}
