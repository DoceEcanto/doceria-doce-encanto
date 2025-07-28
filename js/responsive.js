// ===== RESPONSIVE.JS - FUNCIONALIDADES RESPONSIVAS =====

class ResponsiveManager {
    constructor() {
        this.breakpoints = {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            '2xl': 1536
        };
        
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupResizeHandler();
        this.setupTouchGestures();
        this.setupViewportHeight();
        this.setupLazyImages();
        this.setupAccessibility();
    }

    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width >= this.breakpoints['2xl']) return '2xl';
        if (width >= this.breakpoints.xl) return 'xl';
        if (width >= this.breakpoints.lg) return 'lg';
        if (width >= this.breakpoints.md) return 'md';
        if (width >= this.breakpoints.sm) return 'sm';
        return 'xs';
    }

    // Mobile Menu Management
    setupMobileMenu() {
        const menuToggle = document.querySelector('.btn-menu-mobile');
        const menu = document.querySelector('.navbar nav');
        const menuLinks = document.querySelectorAll('.navbar nav a');
        
        if (!menuToggle || !menu) return;

        // Toggle menu
        menuToggle.addEventListener('click', () => {
            const isOpen = menu.classList.contains('active');
            
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu when clicking on links
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    openMobileMenu() {
        const menu = document.querySelector('.navbar nav');
        const menuToggle = document.querySelector('.btn-menu-mobile');
        
        menu.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.innerHTML = '&times;';
        
        // Trap focus
        this.trapFocus(menu);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const menu = document.querySelector('.navbar nav');
        const menuToggle = document.querySelector('.btn-menu-mobile');
        
        menu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '&#9776;';
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    // Focus trap for accessibility
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Responsive resize handler
    setupResizeHandler() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newBreakpoint = this.getCurrentBreakpoint();
                
                if (newBreakpoint !== this.currentBreakpoint) {
                    this.onBreakpointChange(this.currentBreakpoint, newBreakpoint);
                    this.currentBreakpoint = newBreakpoint;
                }
                
                this.handleResize();
            }, 100);
        });
    }

    onBreakpointChange(oldBreakpoint, newBreakpoint) {
        // Close mobile menu if switching to desktop
        if (this.isMobile(oldBreakpoint) && !this.isMobile(newBreakpoint)) {
            this.closeMobileMenu();
        }
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('breakpointChange', {
            detail: { oldBreakpoint, newBreakpoint }
        }));
        
        console.log(`Breakpoint changed: ${oldBreakpoint} → ${newBreakpoint}`);
    }

    isMobile(breakpoint) {
        return ['xs', 'sm'].includes(breakpoint);
    }

    isTablet(breakpoint) {
        return breakpoint === 'md';
    }

    isDesktop(breakpoint) {
        return ['lg', 'xl', '2xl'].includes(breakpoint);
    }

    handleResize() {
        this.updateViewportHeight();
        this.updateImageSizes();
        this.updateGridColumns();
    }

    // Touch gestures for mobile
    setupTouchGestures() {
        if (!('ontouchstart' in window)) return;

        let startX, startY, startTime;
        
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const endTime = Date.now();
            
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            const deltaTime = endTime - startTime;
            
            // Swipe detection
            if (deltaTime < 500) {
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                        this.handleSwipeLeft();
                    } else {
                        this.handleSwipeRight();
                    }
                }
            }
            
            // Reset
            startX = startY = null;
        }, { passive: true });
    }

    handleSwipeLeft() {
        // Close mobile menu on swipe left
        this.closeMobileMenu();
    }

    handleSwipeRight() {
        // Open mobile menu on swipe right (only if closed and on mobile)
        if (this.isMobile(this.currentBreakpoint)) {
            const menu = document.querySelector('.navbar nav');
            if (!menu.classList.contains('active')) {
                this.openMobileMenu();
            }
        }
    }

    // Viewport height fix for mobile browsers
    setupViewportHeight() {
        this.updateViewportHeight();
    }

    updateViewportHeight() {
        // Fix for mobile viewport height issues
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Responsive images
    setupLazyImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadResponsiveImage(entry.target);
                        imageObserver.unobserve(entry.target);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    loadResponsiveImage(img) {
        const currentBreakpoint = this.getCurrentBreakpoint();
        let imageSrc = img.dataset.src;
        
        // Choose appropriate image size based on breakpoint
        if (img.dataset[currentBreakpoint]) {
            imageSrc = img.dataset[currentBreakpoint];
        } else if (this.isMobile(currentBreakpoint) && img.dataset.mobile) {
            imageSrc = img.dataset.mobile;
        } else if (this.isTablet(currentBreakpoint) && img.dataset.tablet) {
            imageSrc = img.dataset.tablet;
        } else if (this.isDesktop(currentBreakpoint) && img.dataset.desktop) {
            imageSrc = img.dataset.desktop;
        }
        
        img.src = imageSrc;
        img.classList.add('loaded');
    }

    updateImageSizes() {
        // Update image sizes based on current viewport
        document.querySelectorAll('img[data-sizes]').forEach(img => {
            const sizes = JSON.parse(img.dataset.sizes);
            const currentBreakpoint = this.getCurrentBreakpoint();
            
            if (sizes[currentBreakpoint]) {
                img.sizes = sizes[currentBreakpoint];
            }
        });
    }

    // Dynamic grid columns
    updateGridColumns() {
        const grids = document.querySelectorAll('[data-grid-responsive]');
        
        grids.forEach(grid => {
            const config = JSON.parse(grid.dataset.gridResponsive);
            const currentBreakpoint = this.getCurrentBreakpoint();
            
            if (config[currentBreakpoint]) {
                grid.style.gridTemplateColumns = `repeat(${config[currentBreakpoint]}, 1fr)`;
            }
        });
    }

    // Accessibility improvements
    setupAccessibility() {
        // Update aria-labels based on screen size
        this.updateAriaLabels();
        
        // Handle reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.disableAnimations();
        }
        
        // Handle high contrast
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.documentElement.classList.add('high-contrast');
        }
        
        // Handle dark mode
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark-mode');
        }
    }

    updateAriaLabels() {
        const menuToggle = document.querySelector('.btn-menu-mobile');
        if (menuToggle) {
            const isMobile = this.isMobile(this.currentBreakpoint);
            menuToggle.style.display = isMobile ? 'block' : 'none';
        }
    }

    disableAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Utility methods
    static isTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    static getOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }

    static getViewportSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    // Public API
    onBreakpoint(breakpoint, callback) {
        window.addEventListener('breakpointChange', (e) => {
            if (e.detail.newBreakpoint === breakpoint) {
                callback(e.detail);
            }
        });
    }

    getCurrentSize() {
        return this.currentBreakpoint;
    }

    isMobileSize() {
        return this.isMobile(this.currentBreakpoint);
    }

    isTabletSize() {
        return this.isTablet(this.currentBreakpoint);
    }

    isDesktopSize() {
        return this.isDesktop(this.currentBreakpoint);
    }
}

// Image optimization utility
class ResponsiveImages {
    static createPicture(imageSources, alt, className = '') {
        const picture = document.createElement('picture');
        picture.className = className;
        
        // Add source elements for different breakpoints
        Object.entries(imageSources).forEach(([breakpoint, src]) => {
            if (breakpoint !== 'default') {
                const source = document.createElement('source');
                source.media = `(min-width: ${this.getBreakpointValue(breakpoint)}px)`;
                source.srcset = src;
                picture.appendChild(source);
            }
        });
        
        // Add fallback img
        const img = document.createElement('img');
        img.src = imageSources.default || imageSources.xs;
        img.alt = alt;
        img.loading = 'lazy';
        picture.appendChild(img);
        
        return picture;
    }
    
    static getBreakpointValue(breakpoint) {
        const breakpoints = {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            '2xl': 1536
        };
        return breakpoints[breakpoint] || 0;
    }
}

// Initialize responsive manager
let responsiveManager;

document.addEventListener('DOMContentLoaded', () => {
    responsiveManager = new ResponsiveManager();
    
    // Make it globally available
    window.ResponsiveManager = ResponsiveManager;
    window.ResponsiveImages = ResponsiveImages;
    window.responsive = responsiveManager;
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ResponsiveManager, ResponsiveImages };
}