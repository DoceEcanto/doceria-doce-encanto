// ===== HOME.JS - FUNCIONALIDADES ESPECÍFICAS DA PÁGINA HOME =====

// Loading Screen
window.addEventListener('load', function () {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
});

// Scroll Reveal Animation
function revealElements() {
    const elements = document.querySelectorAll('.scroll-reveal');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = elementTop < window.innerHeight - 100;

        if (elementVisible) {
            element.classList.add('revealed');
        }
    });
}

// Create Floating Hearts
function createFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');

    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '💖';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 8 + 's';
        heart.style.animationDuration = (Math.random() * 5 + 8) + 's';
        heartsContainer.appendChild(heart);
    }
}

// Smooth Scroll
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Parallax Effect
function setupParallax() {
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image img');

        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Button Ripple Effect
function setupButtonRipple() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '20px';
            ripple.style.height = '20px';

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Navbar Scroll Effect
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255,255,255,0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = '';
            navbar.style.backdropFilter = '';
            navbar.style.boxShadow = '';
        }
    });
}

// Product Card 3D Effect
function setup3DCards() {
    const cards = document.querySelectorAll('.produto-item');

    cards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.03)`;
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });
}

// Hero Text Animation Enhancement
function enhanceHeroAnimation() {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        // Add dynamic sparkle effect
        setInterval(() => {
            const sparkle = document.createElement('span');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animation = 'sparkle 2s ease-out forwards';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1';
            
            heroTitle.style.position = 'relative';
            heroTitle.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 2000);
        }, 3000);
    }
}

// Add sparkle animation CSS
function addSparkleAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkle {
            0% {
                opacity: 0;
                transform: scale(0) rotate(0deg);
            }
            50% {
                opacity: 1;
                transform: scale(1) rotate(180deg);
            }
            100% {
                opacity: 0;
                transform: scale(0) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function () {
    addSparkleAnimation();
    createFloatingHearts();
    setupSmoothScroll();
    setupParallax();
    setupButtonRipple();
    setupNavbarScroll();
    setup3DCards();
    enhanceHeroAnimation();
    revealElements();

    // Scroll listener
    window.addEventListener('scroll', revealElements);

    // Initial reveal
    setTimeout(revealElements, 100);
});