// ===== SOBRE.JS - FUNCIONALIDADES ESPECÍFICAS DA PÁGINA SOBRE =====

// Loading Screen com proteção
window.addEventListener('load', function () {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
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

// Create Floating Elements
function createFloatingElements() {
    const elementsContainer = document.getElementById('floatingElements');
    if (!elementsContainer) return;
    const symbols = ['🍰', '🧁', '🍪', '🍩', '🎂', '🍓', '💖', '✨'];
    for (let i = 0; i < 12; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        element.style.left = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 12 + 's';
        element.style.animationDuration = (Math.random() * 5 + 12) + 's';
        elementsContainer.appendChild(element);
    }
}

// Smooth Scroll (só ativa se for âncora real)
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const hash = this.getAttribute('href');
            if (hash.length > 1) {
                const target = document.querySelector(hash);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

// Parallax Effect
function setupParallax() {
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const parallaxBg = document.querySelector('.parallax-bg');
        const sobreImagem = document.querySelector('.sobre-imagem img');
        if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        if (sobreImagem) {
            sobreImagem.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    });
}

// Navbar Scroll Effect
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
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

// Interactive Steps
function setupInteractiveSteps() {
    document.querySelectorAll('.passo').forEach(step => {
        step.addEventListener('mouseenter', function () {
            const icon = this.querySelector('.icone-passo img');
            if (icon) icon.style.filter = 'hue-rotate(180deg) brightness(1.2)';
        });
        step.addEventListener('mouseleave', function () {
            const icon = this.querySelector('.icone-passo img');
            if (icon) icon.style.filter = '';
        });
    });
}

// Timeline Animation for Story
function animateStoryTimeline() {
    document.querySelectorAll('.sobre-texto p').forEach(p => {
        p.addEventListener('mouseenter', function () {
            this.style.background = 'linear-gradient(45deg, rgba(255,105,180,0.1), rgba(255,192,203,0.1))';
            this.style.padding = '15px';
            this.style.borderRadius = '8px';
            this.style.borderLeft = '4px solid #ff69b4';
        });
        p.addEventListener('mouseleave', function () {
            this.style.background = '';
            this.style.padding = '';
            this.style.borderRadius = '';
            this.style.borderLeft = '';
        });
    });
}

// Text Reveal Effect animado para o título
function setupTextReveal() {
    const title = document.querySelector('.sobre-texto h2');
    if (title) {
        const text = title.textContent;
        title.innerHTML = '';
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
            span.style.opacity = '0';
            span.style.animation = `fadeInUp 0.1s ease-out ${i * 0.1}s both`;
            title.appendChild(span);
        }
    }
}

// ---- Easter Egg: Confetti Effect ----
function createConfetti() {
    const colors = ['#ff69b4', '#ffc0cb', '#ff1493', '#ffb6c1'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '10000';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s ease-out forwards`;

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

// Logo Easter Egg: só roda se .logo existe
function setupEasterEgg() {
    const logo = document.querySelector('.logo');
    if (!logo) return;
    let logoClickCount = 0;
    logo.addEventListener('click', function () {
        logoClickCount++;
        if (logoClickCount >= 5) {
            createConfetti();
            logoClickCount = 0;
        }
    });
}

// Adiciona confetti animation CSS só uma vez
function addConfettiStyles() {
    if (document.getElementById('confetti-style')) return;
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
        @keyframes confettiFall {
            to {
                transform: translateY(${window.innerHeight + 100}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ---------------- INIT ALL ----------------
document.addEventListener('DOMContentLoaded', function () {
    addConfettiStyles();
    createFloatingElements();
    setupSmoothScroll();
    setupParallax();
    setupNavbarScroll();
    setupInteractiveSteps();
    animateStoryTimeline();
    setupTextReveal();
    setupEasterEgg();
    revealElements();

    window.addEventListener('scroll', revealElements);
    setTimeout(revealElements, 100);
});