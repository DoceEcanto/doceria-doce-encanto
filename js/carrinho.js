// ===== CARRINHO.JS - SISTEMA COMPLETO DO CARRINHO =====

class CarrinhoManager {
    constructor() {
        this.itens = this.carregarCarrinho();
        this.isAberto = false;
        this.init();
    }

    init() {
        this.criarElementosCarrinho();
        this.setupEventListeners();
        this.atualizarInterface();
        console.log('Carrinho inicializado com sucesso!');
    }

    // Criar elementos HTML do carrinho
    criarElementosCarrinho() {
        // Adicionar ícone do carrinho no header
        this.adicionarIconeHeader();
        
        // Criar sidebar do carrinho
        this.criarSidebar();
        
        // Criar modal de observações
        this.criarModalObservacoes();
        
        // Adicionar botões nos produtos
        this.adicionarBotoesProdutos();
    }

    adicionarIconeHeader() {
        const navbar = document.querySelector('.navbar .container');
        if (!navbar) return;

        const carrinhoIcon = document.createElement('button');
        carrinhoIcon.className = 'carrinho-header';
        carrinhoIcon.innerHTML = `
            🛒
            <span class="carrinho-count" style="display: none;">0</span>
        `;
        carrinhoIcon.setAttribute('aria-label', 'Abrir carrinho');
        
        navbar.appendChild(carrinhoIcon);
    }

    criarSidebar() {
        const sidebar = document.createElement('div');
        sidebar.className = 'carrinho-sidebar';
        sidebar.innerHTML = `
            <div class="carrinho-header-sidebar">
                <h3>Seu Carrinho</h3>
                <button class="carrinho-fechar" aria-label="Fechar carrinho">&times;</button>
            </div>
            <div class="carrinho-itens">
                <div class="carrinho-vazio">
                    <div class="carrinho-vazio-icon">🛒</div>
                    <h4>Carrinho vazio</h4>
                    <p>Adicione alguns docinhos deliciosos!</p>
                </div>
            </div>
            <div class="carrinho-footer">
                <div class="carrinho-total">
                    <span>Total:</span>
                    <span class="carrinho-total-valor">R$ 0,00</span>
                </div>
                <div class="carrinho-botoes">
                    <a href="contato.html#contato" class="btn-finalizar">
                        Finalizar Pedido pelo WhatsApp
                    </a>
                    <button class="btn-limpar">Limpar Carrinho</button>
                </div>
            </div>
        `;

        // Criar overlay
        const overlay = document.createElement('div');
        overlay.className = 'carrinho-overlay';

        document.body.appendChild(overlay);
        document.body.appendChild(sidebar);
    }

    criarModalObservacoes() {
        const modal = document.createElement('div');
        modal.className = 'carrinho-modal';
        modal.innerHTML = `
            <div class="carrinho-modal-content">
                <h4>Adicionar observações</h4>
                <textarea placeholder="Ex: Sem açúcar, embalagem especial, etc..."></textarea>
                <div class="carrinho-modal-botoes">
                    <button class="btn-modal-adicionar">Adicionar ao Carrinho</button>
                    <button class="btn-modal-cancelar">Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    adicionarBotoesProdutos() {
        const produtos = document.querySelectorAll('.produto-item');
        
        produtos.forEach((produto, index) => {
            // Extrair informações do produto
            const nome = produto.querySelector('h3')?.textContent || 'Produto';
            const precoTexto = produto.querySelector('.preco')?.textContent || 'R$ 0,00';
            const preco = this.extrairPreco(precoTexto);
            const imagem = produto.querySelector('img')?.src || '';
            const descricao = produto.querySelector('p:not(.preco)')?.textContent || '';

            // Criar botão de adicionar
            const btnAdicionar = document.createElement('button');
            btnAdicionar.className = 'btn-adicionar-carrinho';
            btnAdicionar.innerHTML = '🛒 Adicionar ao Carrinho';
            
            // Dados do produto
            btnAdicionar.dataset.produto = JSON.stringify({
                id: `produto-${index}`,
                nome,
                preco,
                imagem,
                descricao
            });

            // Substituir ou adicionar o botão
            const btnExistente = produto.querySelector('.btn-secondary');
            if (btnExistente) {
                btnExistente.parentNode.replaceChild(btnAdicionar, btnExistente);
            } else {
                produto.appendChild(btnAdicionar);
            }
        });
    }

    setupEventListeners() {
        // Abrir carrinho
        document.addEventListener('click', (e) => {
            if (e.target.closest('.carrinho-header')) {
                this.abrirCarrinho();
            }
        });

        // Fechar carrinho
        document.addEventListener('click', (e) => {
            if (e.target.closest('.carrinho-fechar') || e.target.closest('.carrinho-overlay')) {
                this.fecharCarrinho();
            }
        });

        // Adicionar ao carrinho
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-adicionar-carrinho');
            if (btn) {
                e.preventDefault();
                const produto = JSON.parse(btn.dataset.produto);
                this.mostrarModalObservacoes(produto);
            }
        });

        // Controles do carrinho
        document.addEventListener('click', (e) => {
            // Aumentar quantidade
            if (e.target.closest('.carrinho-aumentar')) {
                const id = e.target.closest('.carrinho-item').dataset.id;
                this.aumentarQuantidade(id);
            }
            
            // Diminuir quantidade
            if (e.target.closest('.carrinho-diminuir')) {
                const id = e.target.closest('.carrinho-item').dataset.id;
                this.diminuirQuantidade(id);
            }
            
            // Remover item
            if (e.target.closest('.carrinho-remover')) {
                const id = e.target.closest('.carrinho-item').dataset.id;
                this.removerItem(id);
            }
            
            // Limpar carrinho
            if (e.target.closest('.btn-limpar')) {
                this.limparCarrinho();
            }
        });

        // Modal de observações
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-modal-adicionar')) {
                this.adicionarComObservacoes();
            }
            
            if (e.target.closest('.btn-modal-cancelar') || 
                (e.target.closest('.carrinho-modal') && !e.target.closest('.carrinho-modal-content'))) {
                this.fecharModalObservacoes();
            }
        });

        // Tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (document.querySelector('.carrinho-modal.ativo')) {
                    this.fecharModalObservacoes();
                } else if (this.isAberto) {
                    this.fecharCarrinho();
                }
            }
        });
    }

    // Gerenciamento do modal de observações
    mostrarModalObservacoes(produto) {
        this.produtoTemporario = produto;
        const modal = document.querySelector('.carrinho-modal');
        const textarea = modal.querySelector('textarea');
        
        textarea.value = '';
        modal.classList.add('ativo');
        textarea.focus();
    }

    fecharModalObservacoes() {
        const modal = document.querySelector('.carrinho-modal');
        modal.classList.remove('ativo');
        this.produtoTemporario = null;
    }

    adicionarComObservacoes() {
        if (!this.produtoTemporario) return;
        
        const modal = document.querySelector('.carrinho-modal');
        const observacoes = modal.querySelector('textarea').value.trim();
        
        this.adicionarItem(this.produtoTemporario, observacoes);
        this.fecharModalObservacoes();
    }

    // Adicionar item ao carrinho
    adicionarItem(produto, observacoes = '') {
        const itemExistente = this.itens.find(item => 
            item.id === produto.id && item.observacoes === observacoes
        );

        if (itemExistente) {
            itemExistente.quantidade += 1;
        } else {
            this.itens.push({
                ...produto,
                observacoes,
                quantidade: 1,
                timestamp: Date.now()
            });
        }

        this.salvarCarrinho();
        this.atualizarInterface();
        this.mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
        
        // Animar produto
        this.animarProdutoAdicionado(produto.id);
    }

    // Remover item
    removerItem(id) {
        this.itens = this.itens.filter(item => item.id !== id);
        this.salvarCarrinho();
        this.atualizarInterface();
        this.mostrarNotificacao('Item removido do carrinho', 'remove');
    }

    // Aumentar quantidade
    aumentarQuantidade(id) {
        const item = this.itens.find(item => item.id === id);
        if (item) {
            item.quantidade += 1;
            this.salvarCarrinho();
            this.atualizarInterface();
        }
    }

    // Diminuir quantidade
    diminuirQuantidade(id) {
        const item = this.itens.find(item => item.id === id);
        if (item && item.quantidade > 1) {
            item.quantidade -= 1;
            this.salvarCarrinho();
            this.atualizarInterface();
        }
    }

    // Limpar carrinho
    limparCarrinho() {
        if (this.itens.length === 0) return;
        
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            this.itens = [];
            this.salvarCarrinho();
            this.atualizarInterface();
            this.mostrarNotificacao('Carrinho limpo!', 'clear');
        }
    }

    // Abrir/fechar carrinho
    abrirCarrinho() {
        const sidebar = document.querySelector('.carrinho-sidebar');
        const overlay = document.querySelector('.carrinho-overlay');
        
        sidebar.classList.add('aberto');
        overlay.classList.add('ativo');
        this.isAberto = true;
        
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
    }

    fecharCarrinho() {
        const sidebar = document.querySelector('.carrinho-sidebar');
        const overlay = document.querySelector('.carrinho-overlay');
        
        sidebar.classList.remove('aberto');
        overlay.classList.remove('ativo');
        this.isAberto = false;
        
        // Restaurar scroll do body
        document.body.style.overflow = '';
    }

    // Atualizar interface
    atualizarInterface() {
        this.atualizarContador();
        this.atualizarListaItens();
        this.atualizarTotal();
        this.atualizarLinkWhatsApp();
    }

    atualizarContador() {
        const contador = document.querySelector('.carrinho-count');
        const totalItens = this.itens.reduce((total, item) => total + item.quantidade, 0);
        
        if (contador) {
            contador.textContent = totalItens;
            contador.style.display = totalItens > 0 ? 'flex' : 'none';
        }
    }

    atualizarListaItens() {
        const container = document.querySelector('.carrinho-itens');
        if (!container) return;

        if (this.itens.length === 0) {
            container.innerHTML = `
                <div class="carrinho-vazio">
                    <div class="carrinho-vazio-icon">🛒</div>
                    <h4>Carrinho vazio</h4>
                    <p>Adicione alguns docinhos deliciosos!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.itens.map(item => `
            <div class="carrinho-item" data-id="${item.id}">
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="carrinho-item-info">
                    <div class="carrinho-item-nome">${item.nome}</div>
                    <div class="carrinho-item-preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                    ${item.observacoes ? `<div class="carrinho-item-observacoes">${item.observacoes}</div>` : ''}
                </div>
                <div class="carrinho-quantidade">
                    <button class="carrinho-diminuir" ${item.quantidade <= 1 ? 'disabled' : ''}>-</button>
                    <span>${item.quantidade}</span>
                    <button class="carrinho-aumentar">+</button>
                </div>
                <button class="carrinho-remover" aria-label="Remover item">🗑️</button>
            </div>
        `).join('');
    }

    atualizarTotal() {
        const totalElement = document.querySelector('.carrinho-total-valor');
        const total = this.itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
        
        if (totalElement) {
            totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        }
    }

    atualizarLinkWhatsApp() {
        const btnFinalizar = document.querySelector('.btn-finalizar');
        if (!btnFinalizar || this.itens.length === 0) return;

        const mensagem = this.gerarMensagemWhatsApp();
        const numeroWhatsApp = '5549998406192'; // Substitua pelo número real
        
        btnFinalizar.href = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    }

    // Gerar mensagem para WhatsApp
    gerarMensagemWhatsApp() {
        let mensagem = '🍰 *Pedido - Doce Encanto* 🍰\n\n';
        
        this.itens.forEach((item, index) => {
            mensagem += `${index + 1}. ${item.nome}\n`;
            mensagem += `   Quantidade: ${item.quantidade}x\n`;
            mensagem += `   Preço: R$ ${item.preco.toFixed(2).replace('.', ',')}\n`;
            if (item.observacoes) {
                mensagem += `   Obs: ${item.observacoes}\n`;
            }
            mensagem += '\n';
        });
        
        const total = this.itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
        mensagem += `💰 *Total: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
        mensagem += 'Gostaria de confirmar este pedido! 😊';
        
        return mensagem;
    }

    // Mostrar notificação
    mostrarNotificacao(texto, tipo = 'add') {
        // Remover notificação existente
        const notificacaoExistente = document.querySelector('.carrinho-notificacao');
        if (notificacaoExistente) {
            notificacaoExistente.remove();
        }

        const notificacao = document.createElement('div');
        notificacao.className = 'carrinho-notificacao';
        
        const icon = tipo === 'add' ? '✅' : tipo === 'remove' ? '🗑️' : '🔄';
        notificacao.innerHTML = `
            ${icon} ${texto}
            <button class="carrinho-notificacao-fechar">&times;</button>
        `;

        document.body.appendChild(notificacao);

        // Mostrar
        setTimeout(() => notificacao.classList.add('mostrar'), 100);

        // Auto remover
        setTimeout(() => {
            notificacao.classList.remove('mostrar');
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);

        // Fechar manualmente
        notificacao.querySelector('.carrinho-notificacao-fechar').onclick = () => {
            notificacao.classList.remove('mostrar');
            setTimeout(() => notificacao.remove(), 300);
        };
    }

    // Animar produto adicionado
    animarProdutoAdicionado(produtoId) {
        const produtos = document.querySelectorAll('.produto-item');
        produtos.forEach(produto => {
            const btn = produto.querySelector('.btn-adicionar-carrinho');
            if (btn && btn.dataset.produto) {
                const dadosProduto = JSON.parse(btn.dataset.produto);
                if (dadosProduto.id === produtoId) {
                    produto.classList.add('adicionando');
                    setTimeout(() => produto.classList.remove('adicionando'), 500);
                }
            }
        });
    }

    // Utilitários
    extrairPreco(textoPreco) {
        const match = textoPreco.match(/[\d,]+/);
        return match ? parseFloat(match[0].replace(',', '.')) : 0;
    }

    // Persistência
    salvarCarrinho() {
        localStorage.setItem('carrinhoDoceEncanto', JSON.stringify(this.itens));
    }

    carregarCarrinho() {
        const dados = localStorage.getItem('carrinhoDoceEncanto');
        return dados ? JSON.parse(dados) : [];
    }

    // API pública
    getItens() {
        return [...this.itens];
    }

    getTotalItens() {
        return this.itens.reduce((total, item) => total + item.quantidade, 0);
    }

    getTotalValor() {
        return this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    isCarrinhoAberto() {
        return this.isAberto;
    }
}

// Inicializar carrinho
let carrinho;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando sistema de carrinho...');
    carrinho = new CarrinhoManager();
    
    // Tornar disponível globalmente
    window.carrinho = carrinho;
    window.CarrinhoManager = CarrinhoManager;
});

// Export para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CarrinhoManager };
}