// ===== MODAL-OBSERVACOES.JS - MODAL SUPER BONITO =====

class ModalObservacoes {
    constructor() {
        this.modal = null;
        this.produtoAtual = null;
        this.sugestoes = [
            'Sem açúcar',
            'Diet/Light',
            'Sem glúten',
            'Vegano',
            'Embalagem especial',
            'Entrega urgente',
            'Cartão personalizado',
            'Fatias individuais',
            'Sem lactose',
            'Decoração extra'
        ];
        this.maxCaracteres = 500;
        this.init();
    }

    init() {
        this.criarModal();
        this.setupEventListeners();
        console.log('Modal de observações inicializado!');
    }

    criarModal() {
        // Remover modal existente se houver
        const modalExistente = document.querySelector('.carrinho-modal');
        if (modalExistente) {
            modalExistente.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'carrinho-modal';
        modal.innerHTML = `
            <div class="carrinho-modal-content">
                <div class="carrinho-modal-header">
                    <h3>Personalize seu Pedido</h3>
                    <button class="carrinho-modal-fechar" aria-label="Fechar">&times;</button>
                </div>
                
                <div class="carrinho-modal-body">
                    <div class="produto-preview">
                        <img src="" alt="" class="produto-preview-img">
                        <div class="produto-info">
                            <h4 class="produto-preview-nome"></h4>
                            <div class="produto-preco"></div>
                        </div>
                    </div>
                    
                    <label class="observacoes-label">
                        Observações Especiais
                    </label>
                    
                    <div class="observacoes-desc">
                        💡 <strong>Dica:</strong> Conte-nos sobre preferências dietéticas, decorações especiais, 
                        embalagens personalizadas ou qualquer detalhe importante para seu pedido.
                    </div>
                    
                    <div class="sugestoes-rapidas">
                        <div class="sugestoes-titulo">📝 Sugestões Rápidas:</div>
                        <div class="sugestoes-lista"></div>
                    </div>
                    
                    <textarea 
                        placeholder="Ex: Sem açúcar, embalagem para presente, cartão com mensagem 'Parabéns!', entrega às 15h..."
                        maxlength="${this.maxCaracteres}"></textarea>
                    
                    <div class="caracteres-contador">
                        <span class="contador-atual">0</span>/${this.maxCaracteres} caracteres
                    </div>
                </div>
                
                <div class="carrinho-modal-footer">
                    <div class="carrinho-modal-botoes">
                        <button class="btn-modal-cancelar">Cancelar</button>
                        <button class="btn-modal-adicionar">Adicionar ao Carrinho</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.modal = modal;
        
        this.criarSugestoes();
    }

    criarSugestoes() {
        const container = this.modal.querySelector('.sugestoes-lista');
        
        this.sugestoes.forEach(sugestao => {
            const btn = document.createElement('button');
            btn.className = 'sugestao-btn';
            btn.textContent = sugestao;
            btn.type = 'button';
            
            btn.addEventListener('click', () => {
                this.adicionarSugestao(sugestao);
            });
            
            container.appendChild(btn);
        });
    }

    setupEventListeners() {
        // Fechar modal
        document.addEventListener('click', (e) => {
            if (e.target.closest('.carrinho-modal-fechar') || 
                (e.target.closest('.carrinho-modal') && !e.target.closest('.carrinho-modal-content'))) {
                this.fechar();
            }
        });

        // Botões do modal
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-modal-adicionar')) {
                this.confirmarAdicao();
            }
            
            if (e.target.closest('.btn-modal-cancelar')) {
                this.fechar();
            }
        });

        // Contador de caracteres
        document.addEventListener('input', (e) => {
            if (e.target.closest('.carrinho-modal textarea')) {
                this.atualizarContador(e.target);
            }
        });

        // Tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('ativo')) {
                this.fechar();
            }
        });

        // Auto-resize do textarea
        document.addEventListener('input', (e) => {
            if (e.target.closest('.carrinho-modal textarea')) {
                this.autoResize(e.target);
            }
        });
    }

    mostrar(produto) {
        this.produtoAtual = produto;
        this.preencherDadosProduto(produto);
        this.limparFormulario();
        
        // Mostrar modal
        this.modal.classList.add('ativo');
        
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
        
        // Focus no textarea
        setTimeout(() => {
            const textarea = this.modal.querySelector('textarea');
            textarea.focus();
        }, 400);

        // Animar entrada
        this.animarEntrada();
    }

    fechar() {
        if (!this.modal) return;

        this.modal.classList.remove('ativo');
        
        // Restaurar scroll do body
        document.body.style.overflow = '';
        
        // Limpar dados
        setTimeout(() => {
            this.produtoAtual = null;
        }, 400);
    }

    preencherDadosProduto(produto) {
        const img = this.modal.querySelector('.produto-preview-img');
        const nome = this.modal.querySelector('.produto-preview-nome');
        const preco = this.modal.querySelector('.produto-preco');
        
        img.src = produto.imagem;
        img.alt = produto.nome;
        nome.textContent = produto.nome;
        preco.textContent = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;
    }

    limparFormulario() {
        const textarea = this.modal.querySelector('textarea');
        textarea.value = '';
        this.atualizarContador(textarea);
    }

    adicionarSugestao(sugestao) {
        const textarea = this.modal.querySelector('textarea');
        const valorAtual = textarea.value.trim();
        
        // Verificar se já tem a sugestão
        if (valorAtual.includes(sugestao)) {
            this.mostrarFeedback('⚠️ Esta opção já foi adicionada!', 'warning');
            return;
        }
        
        // Adicionar sugestão
        let novoValor = valorAtual;
        if (novoValor) {
            novoValor += valorAtual.endsWith('.') || valorAtual.endsWith(',') ? ' ' : ', ';
        }
        novoValor += sugestao;
        
        // Verificar limite de caracteres
        if (novoValor.length > this.maxCaracteres) {
            this.mostrarFeedback('❌ Limite de caracteres excedido!', 'error');
            return;
        }
        
        textarea.value = novoValor;
        this.atualizarContador(textarea);
        this.autoResize(textarea);
        
        // Feedback visual
        this.mostrarFeedback(`✅ "${sugestao}" adicionado!`, 'success');
        
        // Animar sugestão usada
        const btnSugestao = Array.from(this.modal.querySelectorAll('.sugestao-btn'))
            .find(btn => btn.textContent === sugestao);
        
        if (btnSugestao) {
            btnSugestao.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            btnSugestao.style.color = 'white';
            btnSugestao.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                btnSugestao.style.background = '';
                btnSugestao.style.color = '';
                btnSugestao.style.transform = '';
            }, 1000);
        }
    }

    mostrarFeedback(mensagem, tipo) {
        // Criar elemento de feedback
        const feedback = document.createElement('div');
        feedback.className = `feedback-sugestao ${tipo}`;
        feedback.textContent = mensagem;
        feedback.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: ${tipo === 'success' ? '#10b981' : tipo === 'warning' ? '#f59e0b' : '#ef4444'};
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 600;
            z-index: 10;
            animation: feedbackSlide 0.3s ease;
        `;
        
        this.modal.querySelector('.carrinho-modal-content').appendChild(feedback);
        
        // Remover após 2 segundos
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }

    atualizarContador(textarea) {
        const contador = this.modal.querySelector('.contador-atual');
        const contadorContainer = this.modal.querySelector('.caracteres-contador');
        const length = textarea.value.length;
        
        contador.textContent = length;
        
        // Alterar cor se próximo do limite
        if (length > this.maxCaracteres * 0.9) {
            contadorContainer.classList.add('limite');
        } else {
            contadorContainer.classList.remove('limite');
        }
    }

    autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }

    confirmarAdicao() {
    console.log('confirmarAdicao chamado no modal');
    
    if (!this.produtoAtual) {
        console.error('Nenhum produto atual encontrado');
        return;
    }
    
    const textarea = this.modal.querySelector('textarea');
    const observacoes = textarea.value.trim();
    const btnAdicionar = this.modal.querySelector('.btn-modal-adicionar');
    
    console.log('Produto atual:', this.produtoAtual);
    console.log('Observações:', observacoes);
    
    // Loading state
    btnAdicionar.classList.add('loading');
    btnAdicionar.disabled = true;
    
    // Simular processamento e chamar carrinho
    setTimeout(() => {
        try {
            // Usar o método do carrinho diretamente
            if (window.carrinho) {
                window.carrinho.produtoTemporario = this.produtoAtual;
                window.carrinho.adicionarComObservacoes();
            } else {
                console.error('Carrinho não encontrado');
            }
        } catch (error) {
            console.error('Erro ao adicionar:', error);
        } finally {
            // Restaurar botão
            btnAdicionar.classList.remove('loading');
            btnAdicionar.disabled = false;
        }
    }, 800);
}

    mostrarSucessoPersonalizado(observacoes) {
        let mensagem = `${this.produtoAtual.nome} foi adicionado ao carrinho! 🎉`;
        
        if (observacoes) {
            mensagem += `\n\n📝 Observações: ${observacoes}`;
        }
        
        if (window.notifications) {
            window.notifications.success(
                'Produto Personalizado!',
                mensagem,
                {
                    duration: 6000,
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
                    ]
                }
            );
        }
    }

    animarEntrada() {
        const elementos = this.modal.querySelectorAll('.produto-preview, .observacoes-label, .sugestoes-rapidas, textarea, .carrinho-modal-botoes');
        
        elementos.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.4s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });
    }

    // API pública
    isAberto() {
        return this.modal && this.modal.classList.contains('ativo');
    }

    getProdutoAtual() {
        return this.produtoAtual;
    }
}

// CSS para animação do feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes feedbackSlide {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// Inicializar modal
let modalObservacoes;

document.addEventListener('DOMContentLoaded', () => {
    modalObservacoes = new ModalObservacoes();
    window.modalObservacoes = modalObservacoes;
});

// Export para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModalObservacoes };
}