// ===== NOTIFICACOES-INTEGRACAO.JS - INTEGRAÇÃO COM OUTROS SISTEMAS =====

class NotificationIntegration {
    constructor() {
        this.init();
    }

    init() {
        this.setupCarrinhoIntegration();
        this.setupFormIntegration();
        this.setupGeneralIntegration();
        console.log('Integração de notificações inicializada!');
    }

    // Integração com o carrinho
    setupCarrinhoIntegration() {
        // Substituir as notificações antigas do carrinho
        if (window.carrinho) {
            this.integrateWithExistingCart();
        } else {
            // Aguardar carrinho ser inicializado
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.integrateWithExistingCart(), 1000);
            });
        }
    }

    integrateWithExistingCart() {
        if (!window.carrinho || !window.notifications) return;

        // Override do método mostrarNotificacao do carrinho
        const originalMostrarNotificacao = window.carrinho.mostrarNotificacao;
        
        window.carrinho.mostrarNotificacao = (texto, tipo = 'add') => {
            // Remover notificações antigas do carrinho se existirem
            const notificacoesAntigas = document.querySelectorAll('.carrinho-notificacao');
            notificacoesAntigas.forEach(n => n.remove());

            // Determinar tipo de notificação
            let notificationType = 'sucesso';
            let title = 'Carrinho Atualizado';
            
            if (tipo === 'remove') {
                notificationType = 'info';
                title = 'Item Removido';
            } else if (tipo === 'clear') {
                notificationType = 'aviso';
                title = 'Carrinho Limpo';
            } else if (texto.includes('adicionado')) {
                notificationType = 'carrinho';
                title = 'Item Adicionado';
            }

            // Mostrar nova notificação
            if (texto.includes('adicionado ao carrinho')) {
                const productName = texto.replace(' adicionado ao carrinho!', '');
                window.notifications.productAdded(productName);
            } else {
                window.notifications.show({
                    type: notificationType,
                    title: title,
                    message: texto,
                    duration: tipo === 'clear' ? 6000 : 4000
                });
            }
        };

        console.log('Carrinho integrado com notificações!');
    }

    // Integração com formulários
    setupFormIntegration() {
        // Interceptar submissões de formulário
        document.addEventListener('submit', (e) => {
            const form = e.target;
            
            if (form.matches('#form-contato, .contato-form, .contact-form')) {
                this.handleContactForm(e);
            }
        });

        // Validação de campos em tempo real
        document.addEventListener('blur', (e) => {
            if (e.target.matches('input[required], textarea[required]')) {
                this.validateField(e.target);
            }
        }, true);
    }

    handleContactForm(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Mostrar loading
        const loadingId = window.notifications.loading(
            'Enviando Mensagem',
            'Aguarde enquanto processamos seu contato...'
        );

        // Simular envio (substituir por lógica real)
        setTimeout(() => {
            // Esconder loading
            window.notifications.hide(loadingId);
            
            // Mostrar sucesso
            window.notifications.success(
                'Mensagem Enviada!',
                'Entraremos em contato em breve. Obrigado!',
                {
                    duration: 8000,
                    actions: [
                        {
                            text: 'WhatsApp',
                            type: 'primario',
                            action: 'whatsapp',
                            handler: () => {
                                window.open('https://wa.me/5549998406192', '_blank');
                            }
                        }
                    ]
                }
            );
            
            // Limpar formulário
            form.reset();
        }, 2000);
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;

        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Este campo é obrigatório');
            return false;
        }

        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Digite um email válido');
                return false;
            }
        }

        if (name === 'telefone' && value) {
            const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
            if (!phoneRegex.test(value)) {
                this.showFieldError(field, 'Formato: (11) 99999-9999');
                return false;
            }
        }

        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        // Remover erro anterior
        this.clearFieldError(field);
        
        // Adicionar classe de erro
        field.classList.add('error');
        
        // Criar elemento de erro
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            animation: fadeIn 0.3s ease;
        `;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Integração geral
    setupGeneralIntegration() {
        // Erros de JavaScript
        window.addEventListener('error', (e) => {
            console.error('Erro capturado:', e.error);
            
            if (!window.notifications) return;
            
            window.notifications.error(
                'Ops! Algo deu errado',
                'Tente recarregar a página',
                {
                    persistent: true,
                    actions: [
                        {
                            text: 'Recarregar',
                            type: 'primario',
                            action: 'reload',
                            handler: () => window.location.reload()
                        }
                    ]
                }
            );
        });

        // Status de conexão
        window.addEventListener('online', () => {
            window.notifications?.success(
                'Conexão Restaurada',
                'Você está online novamente!',
                { duration: 3000 }
            );
        });

        window.addEventListener('offline', () => {
            window.notifications?.warning(
                'Sem Conexão',
                'Algumas funcionalidades podem não funcionar',
                { duration: 6000 }
            );
        });

        // PWA install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            
            setTimeout(() => {
                window.notifications?.info(
                    'Instalar App',
                    'Adicione nosso app à sua tela inicial!',
                    {
                        persistent: true,
                        actions: [
                            {
                                text: 'Instalar',
                                type: 'primario',
                                action: 'install',
                                handler: () => {
                                    e.prompt();
                                }
                            },
                            {
                                text: 'Mais Tarde',
                                type: 'secundario',
                                action: 'later',
                                handler: (id) => {
                                    window.notifications.hide(id);
                                }
                            }
                        ]
                    }
                );
            }, 3000);
        });
    }

    // Notificações específicas para e-commerce
    showWelcome() {
        window.notifications?.show({
            type: 'info',
            title: '🍰 Bem-vindo à Doce Encanto!',
            message: 'Explore nossos deliciosos doces artesanais',
            duration: 6000,
            actions: [
                {
                    text: 'Ver Cardápio',
                    type: 'primario',
                    action: 'menu',
                    handler: () => {
                        window.location.href = '/produtos/';
                    }
                }
            ]
        });
    }

    showPromotion(promo) {
        window.notifications?.show({
            type: 'carrinho',
            title: '🎉 Promoção Especial!',
            message: promo.message,
            duration: 10000,
            persistent: false,
            actions: [
                {
                    text: 'Ver Oferta',
                    type: 'primario',
                    action: 'promo',
                    handler: () => {
                        window.location.href = promo.link;
                    }
                }
            ]
        });
    }
}

// Inicializar integração
document.addEventListener('DOMContentLoaded', () => {
    new NotificationIntegration();
    
    // Exemplo de uso após 2 segundos
    setTimeout(() => {
        if (window.notifications) {
            // Mostrar boas-vindas apenas na primeira visita
            if (!localStorage.getItem('visitou-antes')) {
                new NotificationIntegration().showWelcome();
                localStorage.setItem('visitou-antes', 'true');
            }
        }
    }, 2000);
});