// ===== CARRINHO.JS - SISTEMA COMPLETO DO CARRINHO CORRIGIDO =====

class CarrinhoManager {
    constructor() {
        this.itens = this.carregarCarrinho();
        this.isAberto = false;
        this.produtoTemporario = null; // ADICIONADO
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
        this.adicionarIconeHeader();
        this.criarSidebar();
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

        const overlay = document.createElement('div');
        overlay.className = 'carrinho-overlay';

        document.body.appendChild(overlay);
        document.body.appendChild(sidebar);
    }

    adicionarBotoesProdutos() {
        const produtos = document.querySelectorAll('.produto-item');
        
        produtos.forEach((produto, index) => {
            const nome = produto.querySelector('h3')?.textContent || 'Produto';
            const precoTexto = produto.querySelector('.preco')?.textContent || 'R$ 0,00';
            const preco = this.extrairPreco(precoTexto);
            const imagem = produto.querySelector('img')?.src || '';
            const descricao = produto.querySelector('p:not(.preco)')?.textContent || '';

            const btnAdicionar = document.createElement('button');
            btnAdicionar.className = 'btn-adicionar-carrinho';
            btnAdicionar.innerHTML = '🛒 Adicionar ao Carrinho';
            
            btnAdicionar.dataset.produto = JSON.stringify({
                id: `produto-${index}`,
                nome,
                preco,
                imagem,
                descricao
            });

            const btnExistente = produto.querySelector('.btn-secondary');
            if (btnExistente) {
                btnExistente.parentNode.replaceChild(btnAdicionar, btnExistente);
            } else {
                produto.appendChild(btnAdicionar);
            }
        });
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.carrinho-header')) {
                this.abrirCarrinho();
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('.carrinho-fechar') || e.target.closest('.carrinho-overlay')) {
                this.fecharCarrinho();
            }
        });

        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-adicionar-carrinho');
            if (btn) {
                e.preventDefault();
                const produto = JSON.parse(btn.dataset.produto);
                this.mostrarModalObservacoes(produto);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('.carrinho-aumentar')) {
                const id = e.target.closest('.carrinho-item').dataset.id;
                this.aumentarQuantidade(id);
            }
            
            if (e.target.closest('.carrinho-diminuir')) {
                const id = e.target.closest('.carrinho-item').dataset.id;
                this.diminuirQuantidade(id);
            }
            
            if (e.target.closest('.carrinho-remover')) {
                const id = e.target.closest('.carrinho-item').dataset.id;
                this.removerItem(id);
            }
            
            if (e.target.closest('.btn-limpar')) {
                this.limparCarrinho();
            }
        });

        // EVENTO CORRIGIDO PARA O MODAL
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-modal-adicionar')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botão modal adicionar clicado!');
                this.adicionarComObservacoes();
            }
            
            if (e.target.closest('.btn-modal-cancelar')) {
                this.fecharModalObservacoes();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (window.modalObservacoes && window.modalObservacoes.isAberto()) {
                    this.fecharModalObservacoes();
                } else if (this.isAberto) {
                    this.fecharCarrinho();
                }
            }
        });
    }

    // MÉTODOS DO MODAL CORRIGIDOS
    mostrarModalObservacoes(produto) {
        console.log('Mostrando modal para produto:', produto);
        this.produtoTemporario = produto;
        
        if (window.modalObservacoes) {
            window.modalObservacoes.mostrar(produto);
        } else {
            console.error('Modal de observações não encontrado!');
            // Fallback: adicionar sem observações
            this.adicionarItem(produto, '');
        }
    }

    fecharModalObservacoes() {
        if (window.modalObservacoes) {
            window.modalObservacoes.fechar();
        }
        this.produtoTemporario = null;
    }

    adicionarComObservacoes() {
        console.log('adicionarComObservacoes chamado');
        
        if (!this.produtoTemporario) {
            console.error('Nenhum produto temporário encontrado!');
            return;
        }

        // Pegar observações do modal
        const modal = document.querySelector('.carrinho-modal');
        const textarea = modal?.querySelector('textarea');
        const observacoes = textarea?.value.trim() || '';
        
        console.log('Produto temporário:', this.produtoTemporario);
        console.log('Observações:', observacoes);

        // Adicionar ao carrinho
        this.adicionarItem(this.produtoTemporario, observacoes);
        
        // Fechar modal
        this.fecharModalObservacoes();
    }

    // Adicionar item ao carrinho
    adicionarItem(produto, observacoes = '') {
        console.log('Adicionando item:', produto, 'Obs:', observacoes);
        
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
        this.animarProdutoAdicionado(produto.id);
    }

    removerItem(id) {
        this.itens = this.itens.filter(item => item.id !== id);
        this.salvarCarrinho();
        this.atualizarInterface();
        this.mostrarNotificacao('Item removido do carrinho', 'remove');
    }

    aumentarQuantidade(id) {
        const item = this.itens.find(item => item.id === id);
        if (item) {
            item.quantidade += 1;
            this.salvarCarrinho();
            this.atualizarInterface();
        }
    }

    diminuirQuantidade(id) {
        const item = this.itens.find(item => item.id === id);
        if (item && item.quantidade > 1) {
            item.quantidade -= 1;
            this.salvarCarrinho();
            this.atualizarInterface();
        }
    }

    limparCarrinho() {
        if (this.itens.length === 0) return;
        
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            this.itens = [];
            this.salvarCarrinho();
            this.atualizarInterface();
            this.mostrarNotificacao('Carrinho limpo!', 'clear');
        }
    }

    abrirCarrinho() {
        const sidebar = document.querySelector('.carrinho-sidebar');
        const overlay = document.querySelector('.carrinho-overlay');
        
        sidebar.classList.add('aberto');
        overlay.classList.add('ativo');
        this.isAberto = true;
        
        document.body.style.overflow = 'hidden';
    }

    fecharCarrinho() {
        const sidebar = document.querySelector('.carrinho-sidebar');
        const overlay = document.querySelector('.carrinho-overlay');
        
        sidebar.classList.remove('aberto');
        overlay.classList.remove('ativo');
        this.isAberto = false;
        
        document.body.style.overflow = '';
    }

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
        const numeroWhatsApp = '5549998406192';
        
        btnFinalizar.href = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    }

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

    mostrarNotificacao(texto, tipo = 'add') {
        // Usar sistema de notificações se disponível
        if (window.notifications) {
            if (texto.includes('adicionado ao carrinho')) {
                const productName = texto.replace(' adicionado ao carrinho!', '');
                window.notifications.productAdded(productName);
            } else if (tipo === 'remove') {
                window.notifications.info('Item Removido', texto);
            } else if (tipo === 'clear') {
                window.notifications.warning('Carrinho Limpo', texto);
            } else {
                window.notifications.success('Carrinho Atualizado', texto);
            }
            return;
        }

        // Fallback para notificação simples
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

        setTimeout(() => notificacao.classList.add('mostrar'), 100);

        setTimeout(() => {
            notificacao.classList.remove('mostrar');
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);

        notificacao.querySelector('.carrinho-notificacao-fechar').onclick = () => {
            notificacao.classList.remove('mostrar');
            setTimeout(() => notificacao.remove(), 300);
        };
    }

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

    extrairPreco(textoPreco) {
        const match = textoPreco.match(/[\d,]+/);
        return match ? parseFloat(match[0].replace(',', '.')) : 0;
    }

    salvarCarrinho() {
        localStorage.setItem('carrinhoDoceEncanto', JSON.stringify(this.itens));
    }

    carregarCarrinho() {
        const dados = localStorage.getItem('carrinhoDoceEncanto');
        return dados ? JSON.parse(dados) : [];
    }

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
    
    window.carrinho = carrinho;
    window.CarrinhoManager = CarrinhoManager;
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CarrinhoManager };
}