// ===== CONTATO.JS - FUNCIONALIDADES ESPECÍFICAS DA PÁGINA CONTATO =====

// Loading Screen
window.addEventListener('load', function () {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;
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

// Create Floating Elements
function createFloatingElements() {
    const elementsContainer = document.getElementById('floatingElements');
    if (!elementsContainer) return;
    const symbols = ['📞', '💌', '📱', '✉️', '📧', '💬', '📲', '💖'];

    for (let i = 0; i < 10; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        element.style.left = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 12 + 's';
        element.style.animationDuration = (Math.random() * 5 + 12) + 's';
        elementsContainer.appendChild(element);
    }
}

// Enhanced Form Handling
function setupFormEnhancements() {
    const form = document.getElementById('formContato');
    if (!form) return;
    const inputs = form.querySelectorAll('input, textarea');
    const typingIndicator = document.getElementById('typingIndicator');
    let typingTimer;

    // Add focus animations
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentNode.style.transform = 'scale(1.02)';
            this.parentNode.style.background = 'rgba(255,105,180,0.05)';
            this.parentNode.style.borderRadius = '8px';
            this.parentNode.style.padding = '10px';
        });
        input.addEventListener('blur', function () {
            this.parentNode.style.transform = '';
            this.parentNode.style.background = '';
            this.parentNode.style.borderRadius = '';
            this.parentNode.style.padding = '';
        });
        // Typing indicator
        input.addEventListener('input', function () {
            if (!typingIndicator) return;
            clearTimeout(typingTimer);
            typingIndicator.classList.add('show');
            typingTimer = setTimeout(() => {
                typingIndicator.classList.remove('show');
            }, 1000);
        });
    });

    // Form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const produto = document.getElementById('produto').value || '';
        const mensagem = document.getElementById('mensagem').value;

        // Create WhatsApp message
        let whatsappMessage = `Olá! Meu nome é ${nome}.\n`;
        whatsappMessage += `Telefone: ${telefone}\n`;
        if (produto) {
            whatsappMessage += `Produto desejado: ${produto}\n`;
        }
        whatsappMessage += `Mensagem: ${mensagem}`;

        const whatsappUrl = `https://wa.me/5549998406192?text=${encodeURIComponent(whatsappMessage)}`;

        // Show success animation
        showSuccessAnimation();

        // Open WhatsApp after animation
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1000);
    });
}

// Success Animation
function showSuccessAnimation() {
    const form = document.getElementById('formContato');
    if (!form) return;
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
        <h3>🎉 Mensagem Preparada!</h3>
        <p>Você será redirecionado para o WhatsApp em instantes...</p>
    `;

    form.appendChild(successDiv);

    // Remove success message after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Phone Number Formatting
function setupPhoneFormatting() {
    const phoneInput = document.getElementById('telefone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length >= 2) {
            value = value.replace(/^(\d{2})(\d{0,5})(\d{0,4}).*/, '(\$1) \$2-\$3');
        }
        e.target.value = value;
    });
}

// Interactive Contact Items
function setupContactInteractions() {
    const contactItems = document.querySelectorAll('.contato-info ul li');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            ripple.style.background = 'rgba(255,105,180,0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.top = '50%';
            ripple.style.left = '50%';
            ripple.style.transform = 'translate(-50%, -50%) scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';

            this.style.position = 'relative';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Smooth Scroll
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
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

// Form Validation with Visual Feedback
function setupFormValidation() {
    const form = document.getElementById('formContato');
    const submitBtn = document.querySelector('.btn-enviar-contato');
    if (!form || !submitBtn) return;

    form.addEventListener('input', function () {
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const mensagem = document.getElementById('mensagem').value;

        if (nome && telefone && mensagem) {
            submitBtn.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
            submitBtn.innerHTML = '🚀 Pronto para Enviar!';
        } else {
            submitBtn.style.background = '';
            submitBtn.innerHTML = 'Enviar via WhatsApp';
        }
    });
}

// WhatsApp Button Animation
function setupWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (!whatsappBtn) return;
    whatsappBtn.addEventListener('mouseenter', function () {
        this.innerHTML = '💬';
    });
    whatsappBtn.addEventListener('mouseleave', function () {
        this.innerHTML = '📱';
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function () {
    createFloatingElements();
    setupFormEnhancements();
    setupPhoneFormatting();
    setupContactInteractions();
    setupSmoothScroll();
    setupNavbarScroll();
    setupFormValidation();
    setupWhatsAppButton();
    revealElements();

    // Scroll listener
    window.addEventListener('scroll', revealElements);

    // Initial reveal
    setTimeout(revealElements, 100);
});