// ===== CARDAPIO.JS - FUNCIONALIDADES ESPECÍFICAS DA PÁGINA CARDÁPIO =====

// Remover loading animation após carregamento
window.addEventListener('load', function () {
    setTimeout(() => {
        const loading = document.querySelector('.loading-animation');
        if (loading) {
            loading.style.display = 'none';
        }
    }, 2000);
});

// Scroll reveal animation
function revelarElementos() {
    const elementos = document.querySelectorAll('.scroll-reveal');

    elementos.forEach(elemento => {
        const elementoTop = elemento.getBoundingClientRect().top;
        const elementoVisivel = elementoTop < window.innerHeight - 100;

        if (elementoVisivel) {
            elemento.classList.add('revealed');
        }
    });
}

// Criar partículas flutuantes
function criarParticulas() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 5 + 8) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Smooth scroll para links
function smoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            // Evitar conflito com links vazios ou 'href="#"'
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

// Animação dos botões de categoria
function animarCategorias() {
    const buttons = document.querySelectorAll('.btn-categoria');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active de todos
            buttons.forEach(btn => btn.classList.remove('active'));
            // Adiciona active no clicado
            this.classList.add('active');

            // Anima produtos
            const produtos = document.querySelectorAll('.produto-item');
            produtos.forEach((produto, index) => {
                produto.style.animation = 'none';
                setTimeout(() => {
                    produto.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;
                }, 10);
            });
        });
    });
}

// Sistema de filtro de categorias
function setupCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.btn-categoria');
    const productItems = document.querySelectorAll('.produto-item');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedCategory = this.getAttribute('data-categoria');
            
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter products
            let visibleIndex = 0;
            productItems.forEach((item) => {
                const itemCategory = item.getAttribute('data-categoria');
                
                if (selectedCategory === 'todos' || itemCategory === selectedCategory) {
                    item.style.display = 'block';
                    item.style.animation = `fadeInUp 0.5s ease-out ${visibleIndex * 0.1}s both`;
                    visibleIndex++;
                } else {
                    item.style.display = 'none';
                    item.style.animation = '';
                }
            });
        });
    });
}

// Efeito de hover 3D nos produtos
function setup3DProductCards() {
    const produtos = document.querySelectorAll('.produto-item');

    produtos.forEach(produto => {
        produto.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });

        produto.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });
}

// Enhanced Button Ripple Effect
function setupButtonRipples() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255,255,255,0.6)';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'buttonRipple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            ripple.className = 'ripple-effect';

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Product Quick View
function setupQuickView() {
    const productItems = document.querySelectorAll('.produto-item');

    productItems.forEach(item => {
        // Add quick view on double click
        item.addEventListener('dblclick', function() {
            const productName = this.querySelector('h3') ? this.querySelector('h3').textContent : '';
            const productPrice = this.querySelector('.preco') ? this.querySelector('.preco').textContent : '';
            let productDesc = '';
            // Pega primeiro <p> de descrição que não seja preco
            this.querySelectorAll('p').forEach(p => {
                if (!p.classList.contains('preco') && !productDesc) productDesc = p.textContent;
            });
            
            showQuickViewModal(productName, productPrice, productDesc);
        });
    });
}

// Quick View Modal
function showQuickViewModal(name, price, description) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('quickViewModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quickViewModal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3 id="modal-product-name"></h3>
                    <p id="modal-product-desc"></p>
                    <p id="modal-product-price"></p>
                    <a href="../contato.html#contato" class="btn btn-primary">Pedir Agora</a>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add modal styles
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            #quickViewModal {
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                z-index: 10000;
                display: none;
            }
            .modal-overlay {
                width: 100%; height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .modal-content {
                background: white;
                padding: 30px 20px;
                border-radius: 10px;
                max-width: 500px;
                width: 95vw;
                text-align: center;
                position: relative;
                animation: modalSlideIn 0.3s ease-out;
                box-sizing: border-box;
                margin: 20px;
            }
            .close-modal {
                position: absolute;
                top: 10px; right: 15px;
                font-size: 24px;
                cursor: pointer;
                color: #999;
            }
            .close-modal:hover { color: #ff69b4; }
            @keyframes modalSlideIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @media (max-width: 500px) {
                .modal-content { padding: 16px 4px; min-width: 0; }
            }
        `;
        document.head.appendChild(modalStyle);

        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.modal-overlay')) {
                modal.style.display = 'none';
            }
        });
    }

    // Update modal content
    document.getElementById('modal-product-name').textContent = name;
    document.getElementById('modal-product-desc').textContent = description;
    document.getElementById('modal-product-price').textContent = price;
    
    // Show modal
    modal.style.display = 'block';
}

// Add CSS for button ripple animation
function addButtonRippleCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes buttonRipple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        .ripple-effect {
            position: absolute !important;
            z-index: 10;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
}

// Inicializar tudo quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
    addButtonRippleCSS();
    criarParticulas();
    smoothScroll();
    animarCategorias();
    setupCategoryFilter();
    setup3DProductCards();
    setupButtonRipples();
    setupQuickView();
    revelarElementos();

    // Listener para scroll
    window.addEventListener('scroll', revelarElementos);

    // Adicionar classe revealed nos elementos já visíveis
    setTimeout(() => {
        revelarElementos();
    }, 100);
});