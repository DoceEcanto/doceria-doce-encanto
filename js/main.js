// ===== MAIN.JS - FUNCIONALIDADES GLOBAIS DO SITE =====

// Função para controlar a visibilidade do menu mobile
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
    // Pode ser útil adicionar/remover uma classe no body para travar o scroll
    document.body.classList.toggle('no-scroll');
}

// Função para marcar o link ativo na navbar
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.navbar nav ul li a');
    const currentPath = window.location.pathname; // Pega o caminho da URL (ex: "/produtos/")
    const currentPage = window.location.pathname.split('/').pop(); // Pega apenas o nome do arquivo (ex: "index.html" ou "produtos/")

    navLinks.forEach(link => {
        // Remove a classe 'active' de todos os links primeiro
        link.classList.remove('active');

        // Verifica se o link é para a página atual
        // Para a home, o caminho será '/' ou '/index.html'
        if (link.getAttribute('href') === 'index.html#home' || link.getAttribute('href') === './index.html' || link.getAttribute('href') === '/' || link.getAttribute('href') === '' ) {
            // Se estiver na página principal (ou subdiretório onde index.html está)
            if (currentPath === '/' || currentPath.endsWith('/index.html')) {
                link.classList.add('active');
            }
        } else if (link.getAttribute('href') === currentPage || link.getAttribute('href') === `../${currentPage}`) {
            // Para outras páginas, compara o href com o nome do arquivo atual
            link.classList.add('active');
        } else if (link.getAttribute('href') === 'produtos/' && currentPage === 'index.html' && window.location.href.includes('/produtos/')) {
            // Caso especial para a página de produtos quando acessada diretamente pelo /produtos/
             link.classList.add('active');
        } else if (link.getAttribute('href') === '../index.html') { // Correção para links que retornam à home
             if (currentPath === '/' || currentPath.endsWith('/index.html')) {
                link.classList.add('active');
            }
        }
    });
}


// Efeito de scroll para links internos (como o botão voltar ao topo)
function smoothScrollToTop() {
    const btnVoltarAoTop = document.getElementById('btnVoltarAoTop');
    if (btnVoltarAoTop) {
        btnVoltarAoTop.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href'); // Pega o target, ex: "#home"
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Começa a rolagem no topo do elemento
                });
            }
        });
    }
}

// Animação de scroll para os elementos que devem aparecer
function revealOnScroll() {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    const observerOptions = {
        root: null, // Usa o viewport como root
        rootMargin: '0px',
        threshold: 0.1 // Aciona quando 10% do elemento está visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Pega a animação específica do data-attribute, se existir
                const animationClass = entry.target.dataset.animation || 'animate-fade-in';
                entry.target.classList.add(animationClass);
                // Opcional: remover o observer para que a animação não seja repetida
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    scrollElements.forEach(el => {
        observer.observe(el);
    });
}


// Event listener para o botão Voltar ao Topo (se ele existe na página)
function setupVoltarAoTop() {
    const btnVoltarAoTop = document.getElementById('btnVoltarAoTop');
    if (!btnVoltarAoTop) return;

    // Mostra o botão quando o usuário rola a página para baixo
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) { // 200px é um bom threshold
            btnVoltarAoTop.classList.add('show');
        } else {
            btnVoltarAoTop.classList.remove('show');
        }
    });
}

// Inicializar todas as funcionalidades globais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o menu mobile
    // Se toggleMobileMenu estiver definida em outro arquivo (ex: home.js), este listener garante que ela seja chamada.
    // Se não, você pode definir a função aqui ou garantir que ela seja carregada antes.
    const menuButton = document.querySelector('.btn-menu-mobile');
    if (menuButton) {
        menuButton.addEventListener('click', toggleMobileMenu);
    }

    // Ativa o link correto na navbar
    setActiveNavLink();

    // Configura o scroll suave para o botão voltar ao topo
    smoothScrollToTop();

    // Configura a animação de scroll reveal
    revealOnScroll();

    // Configura a visibilidade do botão voltar ao topo
    setupVoltarAoTop();

    // Adiciona o 'no-scroll' para quando o menu mobile estiver aberto (se não estiver em cardapio.js)
    // Se toggleMobileMenu já adiciona essa classe, pode omitir aqui.
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        const menuButton = document.querySelector('.btn-menu-mobile');
        const closeButton = mobileMenu.querySelector('.btn-close-mobile');

        if (menuButton) {
            menuButton.addEventListener('click', () => {
                document.body.classList.toggle('no-scroll');
            });
        }
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                document.body.classList.toggle('no-scroll');
            });
        }
    }

    // Se você tem uma tela de loading global que precisa ser desativada aqui
    // (já que cardapio.js também tenta desativar), certifique-se de que apenas uma função faça isso,
    // ou que ambas funcionem sem conflito.
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            // Opcional: remover do DOM após a animação
            loadingScreen.addEventListener('transitionend', () => {
                loadingScreen.style.display = 'none';
            });
        }, 1500); // Espera um pouco mais para garantir que tudo carregue
    }
});