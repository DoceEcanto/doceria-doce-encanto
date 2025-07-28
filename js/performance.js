// ===== PERFORMANCE.JS - OTIMIZAÇÕES DE PERFORMANCE =====

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupCriticalCSS();
        this.setupPreloadImages();
        this.setupServiceWorker();
        this.setupWebVitals();
    }

    // Lazy Loading avançado
    setupLazyLoading() {
        // Intersection Observer para imagens
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Observar todas as imagens lazy
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });

        // Lazy loading para seções
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.scroll-reveal').forEach(section => {
            sectionObserver.observe(section);
        });
    }

    loadImage(img) {
        // Criar placeholder enquanto carrega
        const placeholder = document.createElement('div');
        placeholder.className = 'lazy-placeholder';
        placeholder.style.aspectRatio = img.style.aspectRatio || '1/1';
        
        img.parentNode.insertBefore(placeholder, img);
        img.style.display = 'none';

        img.onload = () => {
            img.style.display = 'block';
            placeholder.remove();
            img.classList.add('loaded');
        };

        img.onerror = () => {
            placeholder.innerHTML = '<span>Erro ao carregar imagem</span>';
        };

        // Trigger loading
        img.src = img.dataset.src || img.src;
    }

    // Critical CSS loading
    setupCriticalCSS() {
        // Função para carregar CSS não-crítico de forma assíncrona
        const loadCSS = (href, media = 'all') => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.media = 'print';
            link.onload = () => link.media = media;
            document.head.appendChild(link);
        };

        // Carregar CSS não-crítico após load
        window.addEventListener('load', () => {
            // Carregar fontes não-críticas
            loadCSS('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');
        });
    }

    // Preload de imagens importantes
    setupPreloadImages() {
        const criticalImages = [
            'img/banner-hero.jpg',
            'img/brigadeiro-tradicional.jpg',
            'img/bolo-morango.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Service Worker para cache
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registrado com sucesso');
                    })
                    .catch(error => {
                        console.log('Falha ao registrar SW');
                    });
            });
        }
    }

    // Web Vitals monitoring
    setupWebVitals() {
        // Função para medir Core Web Vitals
        const measureWebVitals = () => {
            // LCP (Largest Contentful Paint)
            if ('PerformanceObserver' in window) {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

                // FID (First Input Delay)
                const fidObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        console.log('FID:', entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });

                // CLS (Cumulative Layout Shift)
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    console.log('CLS:', clsValue);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            }
        };

        // Executar após load
        window.addEventListener('load', measureWebVitals);
    }

    // Otimização de scroll
    static setupSmoothScroll() {
        // Throttle para scroll events
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Lógica de scroll aqui
                    this.updateScrollPosition();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    updateScrollPosition() {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        // Atualizar indicador de progresso se existir
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }
    }

    // Resource Hints
    static addResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            Object.assign(link, hint);
            document.head.appendChild(link);
        });
    }
}

// Image optimization utility
class ImageOptimizer {
    static createResponsiveImage(src, alt, sizes = '100vw') {
        const img = document.createElement('img');
        
        // Generate srcset for different sizes
        const baseSrc = src.replace(/\.[^/.]+$/, '');
        const ext = src.split('.').pop();
        
        img.srcset = [
            `${baseSrc}-400w.${ext} 400w`,
            `${baseSrc}-800w.${ext} 800w`,
            `${baseSrc}-1200w.${ext} 1200w`
        ].join(', ');
        
        img.sizes = sizes;
        img.src = src; // fallback
        img.alt = alt;
        img.loading = 'lazy';
        img.decoding = 'async';
        
        return img;
    }

    static convertToWebP(img) {
        // Check WebP support
        const supportsWebP = document.createElement('canvas')
            .toDataURL('image/webp')
            .indexOf('data:image/webp') === 0;
        
        if (supportsWebP && img.src.includes('.jpg')) {
            img.src = img.src.replace('.jpg', '.webp');
        }
    }
}

// Critical loading queue
class CriticalResourceLoader {
    constructor() {
        this.queue = [];
        this.loaded = new Set();
    }

    add(resource) {
        this.queue.push(resource);
    }

    loadNext() {
        if (this.queue.length === 0) return;
        
        const resource = this.queue.shift();
        
        return new Promise((resolve, reject) => {
            if (resource.type === 'script') {
                this.loadScript(resource.src).then(resolve).catch(reject);
            } else if (resource.type === 'style') {
                this.loadStyle(resource.src).then(resolve).catch(reject);
            }
        });
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            if (this.loaded.has(src)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                this.loaded.add(src);
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    loadStyle(src) {
        return new Promise((resolve, reject) => {
            if (this.loaded.has(src)) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = src;
            link.onload = () => {
                this.loaded.add(src);
                resolve();
            };
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
    PerformanceOptimizer.addResourceHints();
    PerformanceOptimizer.setupSmoothScroll();
});

// Export for use in other modules
window.PerformanceOptimizer = PerformanceOptimizer;
window.ImageOptimizer = ImageOptimizer;
window.CriticalResourceLoader = CriticalResourceLoader;