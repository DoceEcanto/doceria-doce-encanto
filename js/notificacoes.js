// ===== NOTIFICACOES.JS - SISTEMA COMPLETO DE NOTIFICAÇÕES =====

class NotificationManager {
    constructor() {
        this.notifications = new Map();
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
        this.position = 'top-right';
        this.container = null;
        this.idCounter = 0;
        this.init();
    }

    init() {
        this.createContainer();
        this.setupEventListeners();
        console.log('Sistema de notificações inicializado!');
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = `notificacoes-container ${this.position}`;
        this.container.setAttribute('aria-live', 'polite');
        this.container.setAttribute('aria-label', 'Notificações');
        document.body.appendChild(this.container);
    }

    setupEventListeners() {
        // Listen for notification events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.notificacao-fechar')) {
                const notification = e.target.closest('.notificacao');
                const id = notification.dataset.id;
                this.hide(id);
            }
        });

        // Listen for custom notification events
        document.addEventListener('mostrarNotificacao', (e) => {
            this.show(e.detail);
        });

        // Listen for page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAll();
            } else {
                this.resumeAll();
            }
        });
    }

    // Método principal para mostrar notificações
    show(options = {}) {
        const config = {
            type: 'info',
            title: '',
            message: '',
            duration: this.defaultDuration,
            persistent: false,
            actions: null,
            icon: null,
            onClick: null,
            onClose: null,
            animate: true,
            sound: false,
            ...options
        };

        // Validações
        if (!config.title && !config.message) {
            console.warn('Notificação precisa de título ou mensagem');
            return null;
        }

        // Limitar número de notificações
        if (this.notifications.size >= this.maxNotifications) {
            this.hideOldest();
        }

        const id = this.generateId();
        const element = this.createElement(config, id);
        
        this.notifications.set(id, {
            element,
            config,
            timer: null,
            paused: false,
            startTime: Date.now()
        });

        this.container.appendChild(element);
        
        // Trigger show animation
        requestAnimationFrame(() => {
            element.classList.add('mostrar');
            
            if (config.animate) {
                this.addShowEffect(element, config.type);
            }
        });

        // Auto hide (se não for persistente)
        if (!config.persistent && config.duration > 0) {
            this.setTimer(id, config.duration);
        }

        // Play sound
        if (config.sound) {
            this.playSound(config.type);
        }

        // Click handler
        if (config.onClick) {
            element.addEventListener('click', config.onClick);
        }

        return id;
    }

    // Ocultar notificação
    hide(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        const { element, config } = notification;
        
        // Clear timer
        if (notification.timer) {
            clearTimeout(notification.timer);
        }

        // Hide animation
        element.classList.add('saindo');
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            this.notifications.delete(id);
            
            // Call onClose callback
            if (config.onClose) {
                config.onClose(id);
            }
        }, 500);
    }

    // Criar elemento da notificação
    createElement(config, id) {
        const element = document.createElement('div');
        element.className = `notificacao ${config.type}`;
        element.dataset.id = id;
        element.setAttribute('role', 'alert');
        element.setAttribute('aria-live', 'assertive');

        // Progress bar
        let progressBar = '';
        if (!config.persistent && config.duration > 0) {
            progressBar = `<div class="notificacao-progresso" style="--duracao: ${config.duration}ms;"></div>`;
        }

        // Actions buttons
        let actionsHtml = '';
        if (config.actions && config.actions.length > 0) {
            element.classList.add('interativa');
            actionsHtml = `
                <div class="notificacao-acoes">
                    ${config.actions.map(action => `
                        <button class="notificacao-btn ${action.type || 'secundario'}" 
                                data-action="${action.action}">
                            ${action.text}
                        </button>
                    `).join('')}
                </div>
            `;
        }

        element.innerHTML = `
            <div class="notificacao-icone">${config.icon || ''}</div>
            <div class="notificacao-conteudo">
                ${config.title ? `<h4 class="notificacao-titulo">${config.title}</h4>` : ''}
                ${config.message ? `<p class="notificacao-mensagem">${config.message}</p>` : ''}
            </div>
            <button class="notificacao-fechar" aria-label="Fechar notificação">&times;</button>
            ${progressBar}
            ${actionsHtml}
        `;

        // Setup action handlers
        if (config.actions) {
            element.addEventListener('click', (e) => {
                const actionBtn = e.target.closest('.notificacao-btn');
                if (actionBtn) {
                    const actionName = actionBtn.dataset.action;
                    const action = config.actions.find(a => a.action === actionName);
                    if (action && action.handler) {
                        action.handler(id, actionName);
                    }
                }
            });
        }

        return element;
    }

    // Efeitos de animação
    addShowEffect(element, type) {
        switch (type) {
            case 'erro':
                element.classList.add('shake');
                setTimeout(() => element.classList.remove('shake'), 500);
                break;
            case 'sucesso':
                element.classList.add('bounce');
                setTimeout(() => element.classList.remove('bounce'), 600);
                break;
            case 'info':
                element.classList.add('pulse');
                setTimeout(() => element.classList.remove('pulse'), 2000);
                break;
        }
    }

    // Timer management
    setTimer(id, duration) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        notification.timer = setTimeout(() => {
            this.hide(id);
        }, duration);
    }

    pauseAll() {
        this.notifications.forEach((notification, id) => {
            if (notification.timer && !notification.paused) {
                clearTimeout(notification.timer);
                notification.paused = true;
                notification.remainingTime = notification.config.duration - (Date.now() - notification.startTime);
            }
        });
    }

    resumeAll() {
        this.notifications.forEach((notification, id) => {
            if (notification.paused) {
                notification.paused = false;
                notification.startTime = Date.now();
                this.setTimer(id, notification.remainingTime);
            }
        });
    }

    // Utility methods
    hideOldest() {
        const oldest = Array.from(this.notifications.keys())[0];
        if (oldest) this.hide(oldest);
    }

    hideAll() {
        Array.from(this.notifications.keys()).forEach(id => this.hide(id));
    }

    generateId() {
        return `notification-${++this.idCounter}-${Date.now()}`;
    }

    setPosition(position) {
        this.position = position;
        this.container.className = `notificacoes-container ${position}`;
    }

    setMaxNotifications(max) {
        this.maxNotifications = max;
    }

    // Sound effects
    playSound(type) {
        const audio = new Audio();
        switch (type) {
            case 'sucesso':
                audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IAAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmoeASGH0fG9dyEGMYzS7sR+KAQfe8Dn5alUFgpEnt/uz2wcBSI';
                break;
            case 'erro':
                audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IAAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmoeASGH0fG9dyEGMYzS7sR+KAQfe8Dn5alUFgpEnt/uz2wcBSI';
                break;
        }
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Ignore errors
    }

    // Métodos de conveniência
    success(title, message, options = {}) {
        return this.show({
            type: 'sucesso',
            title,
            message,
            sound: true,
            ...options
        });
    }

    error(title, message, options = {}) {
        return this.show({
            type: 'erro',
            title,
            message,
            duration: 8000,
            sound: true,
            ...options
        });
    }

    warning(title, message, options = {}) {
        return this.show({
            type: 'aviso',
            title,
            message,
            duration: 6000,
            ...options
        });
    }

    info(title, message, options = {}) {
        return this.show({
            type: 'info',
            title,
            message,
            ...options
        });
    }

    loading(title, message = 'Carregando...', options = {}) {
        return this.show({
            type: 'loading',
            title,
            message,
            persistent: true,
            ...options
        });
    }

    // Notificações específicas para e-commerce
    productAdded(productName, options = {}) {
        return this.success(
            'Produto Adicionado!',
            `${productName} foi adicionado ao seu carrinho`,
            {
                type: 'carrinho',
                actions: [
                    {
                        text: 'Ver Carrinho',
                        type: 'primario',
                        action: 'view-cart',
                        handler: () => {
                            if (window.carrinho) {
                                window.carrinho.abrirCarrinho();
                            }
                        }
                    }
                ],
                ...options
            }
        );
    }

    orderConfirmed(orderNumber, options = {}) {
        return this.success(
            'Pedido Confirmado!',
            `Seu pedido #${orderNumber} foi enviado com sucesso`,
            {
                type: 'pedido',
                duration: 8000,
                ...options
            }
        );
    }

    cartCleared(options = {}) {
        return this.info(
            'Carrinho Limpo',
            'Todos os itens foram removidos do carrinho',
            {
                type: 'carrinho',
                ...options
            }
        );
    }

    networkError(options = {}) {
        return this.error(
            'Erro de Conexão',
            'Verifique sua internet e tente novamente',
            {
                actions: [
                    {
                        text: 'Tentar Novamente',
                        type: 'primario',
                        action: 'retry',
                        handler: () => window.location.reload()
                    }
                ],
                ...options
            }
        );
    }
}

// Inicializar sistema
let notificationManager;

document.addEventListener('DOMContentLoaded', () => {
    notificationManager = new NotificationManager();
    
    // Tornar disponível globalmente
    window.notifications = notificationManager;
    window.NotificationManager = NotificationManager;
    
    // Atalhos globais
    window.showNotification = (options) => notificationManager.show(options);
    window.showSuccess = (title, message, options) => notificationManager.success(title, message, options);
    window.showError = (title, message, options) => notificationManager.error(title, message, options);
    window.showWarning = (title, message, options) => notificationManager.warning(title, message, options);
    window.showInfo = (title, message, options) => notificationManager.info(title, message, options);
    window.showLoading = (title, message, options) => notificationManager.loading(title, message, options);
});

// Export para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NotificationManager };
}