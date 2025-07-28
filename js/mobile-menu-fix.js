// ===== MOBILE-MENU-FIX.JS - CORREÇÃO DO MENU MOBILE =====

class MobileMenuManager {
    constructor() {
        this.menuToggle = null;
        this.menu = null;
        this.menuLinks = [];
        this.isOpen = false;
        this.init();
    }

    init() {
        this.setupElements();
        this.createHamburgerIcon();
        this.setupEventListeners();
        this.setupAccessibility();
        console.log('Menu mobile inicializado com sucesso!');
    }

    setupElements() {
        // Buscar elementos
        this.menuToggle = document.querySelector('.btn-menu-mobile');
        this.menu = document.querySelector('.navbar nav');
        this.menuLinks = document.querySelectorAll('.navbar nav a');

        if (!this.menuToggle || !this.menu) {
            console.error('Elementos do menu não encontrados!');
            return;
        }

        console.log('Elementos encontrados:', {
            menuToggle: !!this.menuToggle,
            menu: !!this.menu,
            menuLinks: this.menuLinks.length
        });
    }

    createHamburgerIcon() {
        if (!this.menuToggle) return;

        // Criar ícone hamburger animado
        this.menuToggle.innerHTML = `
            <span class="hamburger"></span>
            <span class="sr-only">Menu</span>
        `;
    }

    setupEventListeners() {
        if (!this.menuToggle || !this.menu) return;

        // Click no botão do menu
        this.menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        // Click nos links do menu (fechar menu)
        this.menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.close();
            });
        });

        // Click fora do menu (fechar)
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.menu.contains(e.target) && 
                !this.menuToggle.contains(e.target)) {
                this.close();
            }
        });

        // Tecla ESC (fechar)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
                this.menuToggle.focus();
            }
        });

        // Resize da janela (fechar menu se mudou para desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.close();
            }
        });

        // Touch events para swipe
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        let startX = 0;
        let startY = 0;

        this.menu.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        this.menu.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = startX - endX;
            const deltaY = Math.abs(startY - endY);
            
            // Swipe para esquerda para fechar
            if (deltaX > 100 && deltaY < 100) {
                this.close();
            }
        }, { passive: true });
    }

    setupAccessibility() {
        if (!this.menuToggle) return;

        // Configurar ARIA
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.menuToggle.setAttribute('aria-controls', 'main-navigation');
        this.menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');

        if (this.menu) {
            this.menu.setAttribute('id', 'main-navigation');
            this.menu.setAttribute('aria-hidden', 'true');
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (!this.menu || !this.menuToggle) return;

        console.log('Abrindo menu mobile...');

        this.isOpen = true;
        
        // Adicionar classes
        this.menu.classList.add('menu-aberto');
        document.body.classList.add('menu-mobile-aberto');
        
        // Atualizar ARIA
        this.menuToggle.setAttribute('aria-expanded', 'true');
        this.menuToggle.setAttribute('aria-label', 'Fechar menu de navegação');
        this.menu.setAttribute('aria-hidden', 'false');

        // Focus no primeiro link
        setTimeout(() => {
            const firstLink = this.menu.querySelector('a');
            if (firstLink) {
                firstLink.focus();
            }
        }, 100);

        // Disparar evento customizado
        window.dispatchEvent(new CustomEvent('mobileMenuOpened'));
    }

    close() {
        if (!this.menu || !this.menuToggle) return;

        console.log('Fechando menu mobile...');

        this.isOpen = false;
        
        // Remover classes
        this.menu.classList.remove('menu-aberto');
        document.body.classList.remove('menu-mobile-aberto');
        
        // Atualizar ARIA
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
        this.menu.setAttribute('aria-hidden', 'true');

        // Disparar evento customizado
        window.dispatchEvent(new CustomEvent('mobileMenuClosed'));
    }

    // Método público para verificar se está aberto
    isMenuOpen() {
        return this.isOpen;
    }

    // Método público para destruir o menu
    destroy() {
        this.close();
        // Remover event listeners se necessário
    }
}

// Classe para debug
class MenuDebugger {
    static checkElements() {
        const elements = {
            menuToggle: document.querySelector('.btn-menu-mobile'),
            menu: document.querySelector('.navbar nav'),
            menuLinks: document.querySelectorAll('.navbar nav a'),
            container: document.querySelector('.navbar .container'),
            navbar: document.querySelector('.navbar')
        };

        console.log('=== DEBUG DO MENU MOBILE ===');
        console.log('Elementos encontrados:');
        Object.entries(elements).forEach(([key, element]) => {
            console.log(`${key}:`, element ? '✅ Encontrado' : '❌ Não encontrado');
            if (element) {
                console.log(`  - Classes: ${element.className}`);
                if (element.style && element.style.display) {
                    console.log(`  - Display: ${element.style.display}`);
                }
            }
        });

        console.log('Largura da tela:', window.innerWidth);
        console.log('É mobile?', window.innerWidth <= 768);
        console.log('========================');

        return elements;
    }

    static testMenu() {
        const menu = window.mobileMenu;
        if (menu) {
            console.log('Testando abertura do menu...');
            menu.open();
            setTimeout(() => {
                console.log('Testando fechamento do menu...');
                menu.close();
            }, 2000);
        } else {
            console.error('Menu não inicializado!');
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, inicializando menu mobile...');
    
    // Debug dos elementos
    MenuDebugger.checkElements();
    
    // Inicializar menu
    window.mobileMenu = new MobileMenuManager();
    
    // Tornar debugger disponível globalmente
    window.MenuDebugger = MenuDebugger;
});

// Export para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MobileMenuManager, MenuDebugger };
}