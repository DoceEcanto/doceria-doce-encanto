// ===== SISTEMA-BUSCA.JS - SISTEMA DE BUSCA AVANÇADO =====

class SistemaBusca {
    constructor() {
        this.produtos = [];
        this.produtosFiltrados = [];
        this.ultimaBusca = '';
        this.filtrosAtivos = {
            categorias: [],
            preco: '',
            disponibilidade: ['disponivel']
        };
        this.ordenacaoAtual = 'relevancia';
        this.visualizacaoAtual = 'grid';
        this.init();
    }

    init() {
        this.carregarProdutos();
        this.setupEventListeners();
        this.setupBuscaInstantanea();
        console.log('Sistema de Busca inicializado!');
    }

    carregarProdutos() {
        // Dados dos produtos (pode vir de uma API ou base de dados)
        this.produtos = [
            {
                id: 1,
                nome: 'Cento de Brigadeiros Tradicionais',
                categoria: 'brigadeiro',
                preco: 85.00,
                descricao: 'Brigadeiros cremosos feitos com chocolate belga premium',
                imagem: 'images/brigadeiros-tradicionais.jpg',
                disponivel: true,
                promocao: false,
                popularidade: 95,
                keywords: ['brigadeiro', 'tradicional', 'chocolate', 'festa', 'cento'],
                tags: ['mais-vendido', 'tradicional']
            },
            {
                id: 2,
                nome: 'Cento de Beijinhos Gourmet',
                categoria: 'beijinho',
                preco: 80.00,
                descricao: 'Beijinhos com coco fresco e leite condensado especial',
                imagem: 'images/beijinhos-gourmet.jpg',
                disponivel: true,
                promocao: true,
                popularidade: 88,
                keywords: ['beijinho', 'coco', 'branco', 'festa', 'gourmet'],
                tags: ['promocao', 'gourmet']
            },
            {
                id: 3,
                nome: 'Cento de Ninhos Especiais',
                categoria: 'ninho',
                preco: 90.00,
                descricao: 'Docinhos de leite ninho cremosos e irresistíveis',
                imagem: 'images/ninhos-especiais.jpg',
                disponivel: true,
                promocao: false,
                popularidade: 92,
                keywords: ['ninho', 'leite', 'cremoso', 'especial', 'infantil'],
                tags: ['especial', 'cremoso']
            },
            {
                id: 4,
                nome: 'Morango do Amor Premium',
                categoria: 'morango',
                preco: 120.00,
                descricao: 'Morangos frescos cobertos com chocolate belga',
                imagem: 'images/morango-amor.jpg',
                disponivel: true,
                promocao: false,
                popularidade: 85,
                keywords: ['morango', 'amor', 'chocolate', 'fruta', 'premium', 'romântico'],
                tags: ['premium', 'romantico']
            },
            {
                id: 5,
                nome: 'Maçã do Amor Colorida',
                categoria: 'maca',
                preco: 110.00,
                descricao: 'Maçãs crocantes com cobertura doce colorida',
                imagem: 'images/maca-amor.jpg',
                disponivel: true,
                promocao: true,
                popularidade: 78,
                keywords: ['maçã', 'amor', 'colorida', 'crocante', 'festa junina'],
                tags: ['promocao', 'colorida']
            },
            {
                id: 6,
                nome: 'Brigadeiros Gourmet Sortidos',
                categoria: 'brigadeiro',
                preco: 95.00,
                descricao: 'Mix de brigadeiros: tradicional, branco, pistache, café',
                imagem: 'images/brigadeiros-sortidos.jpg',
                disponivel: true,
                promocao: false,
                popularidade: 90,
                keywords: ['brigadeiro', 'gourmet', 'sortido', 'mix', 'variado', 'pistache', 'café'],
                tags: ['gourmet', 'sortido']
            }
        ];

        this.produtosFiltrados = [...this.produtos];
        this.renderizarProdutos();
    }

    setupEventListeners() {
        // Input de busca
        const buscaInput = document.getElementById('buscaInput');
        if (buscaInput) {
            buscaInput.addEventListener('input', (e) => {
                this.buscarInstantaneo(e.target.value);
            });

            buscaInput.addEventListener('focus', () => {
                this.mostrarSugestoes();
            });

            buscaInput.addEventListener('blur', () => {
                // Delay para permitir clique nas sugestões
                setTimeout(() => this.ocultarSugestoes(), 200);
            });
        }

        // Teclas de atalho
        document.addEventListener('keydown', (e) => {
            // Ctrl + F para focar na busca
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                buscaInput?.focus();
            }

            // ESC para limpar busca
            if (e.key === 'Escape') {
                this.limparBusca();
            }
        });
    }

    setupBuscaInstantanea() {
        let timeout;
        const buscaInput = document.getElementById('buscaInput');
        
        if (buscaInput) {
            buscaInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.buscarInstantaneo(e.target.value);
                }, 300); // Delay de 300ms para evitar muitas buscas
            });
        }
    }

    buscarInstantaneo(termo) {
        this.ultimaBusca = termo.toLowerCase().trim();
        this.aplicarFiltrosCompletos();
    }

    buscarProdutos() {
        const buscaInput = document.getElementById('buscaInput');
        const termo = buscaInput?.value || '';
        this.buscarInstantaneo(termo);
    }

    buscarTermo(termo) {
        const buscaInput = document.getElementById('buscaInput');
        if (buscaInput) {
            buscaInput.value = termo;
            this.buscarInstantaneo(termo);
        }
        this.ocultarSugestoes();
    }

    aplicarFiltrosCompletos() {
        let resultados = [...this.produtos];

        // Filtro por busca textual
        if (this.ultimaBusca) {
            resultados = resultados.filter(produto => {
                const textoCompleto = [
                    produto.nome,
                    produto.descricao,
                    produto.categoria,
                    ...produto.keywords,
                    ...produto.tags
                ].join(' ').toLowerCase();

                return textoCompleto.includes(this.ultimaBusca);
            });
        }

        // Filtro por categorias
        if (this.filtrosAtivos.categorias.length > 0) {
            resultados = resultados.filter(produto => 
                this.filtrosAtivos.categorias.includes(produto.categoria)
            );
        }

        // Filtro por preço
        if (this.filtrosAtivos.preco) {
            const [min, max] = this.filtrosAtivos.preco.split('-').map(Number);
            resultados = resultados.filter(produto => 
                produto.preco >= min && produto.preco <= max
            );
        }

        // Filtro por disponibilidade
        if (this.filtrosAtivos.disponibilidade.includes('disponivel')) {
            resultados = resultados.filter(produto => produto.disponivel);
        }

        if (this.filtrosAtivos.disponibilidade.includes('promocao')) {
            resultados = resultados.filter(produto => produto.promocao);
        }

        // Aplicar ordenação
        this.ordenarResultados(resultados);

        this.produtosFiltrados = resultados;
        this.renderizarProdutos();
        this.atualizarInfoResultados();
    }

    aplicarFiltros() {
        // Coletar filtros de categoria
        const checkboxesCategorias = document.querySelectorAll('.filtro-checkbox input[type="checkbox"]:not([value="disponivel"]):not([value="promocao"])');
        this.filtrosAtivos.categorias = Array.from(checkboxesCategorias)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        // Coletar filtro de preço
        const radioPreco = document.querySelector('input[name="preco"]:checked');
        this.filtrosAtivos.preco = radioPreco ? radioPreco.value : '';

        // Coletar filtros de disponibilidade
        const checkboxesDisponibilidade = document.querySelectorAll('.filtro-checkbox input[value="disponivel"], .filtro-checkbox input[value="promocao"]');
        this.filtrosAtivos.disponibilidade = Array.from(checkboxesDisponibilidade)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        this.aplicarFiltrosCompletos();
    }

    ordenarProdutos() {
        const ordenacao = document.getElementById('ordenacao')?.value || 'relevancia';
        this.ordenacaoAtual = ordenacao;
        this.ordenarResultados(this.produtosFiltrados);
        this.renderizarProdutos();
    }

    ordenarResultados(produtos) {
        switch (this.ordenacaoAtual) {
            case 'preco-menor':
                produtos.sort((a, b) => a.preco - b.preco);
                break;
            case 'preco-maior':
                produtos.sort((a, b) => b.preco - a.preco);
                break;
            case 'nome-az':
                produtos.sort((a, b) => a.nome.localeCompare(b.nome));
                break;
            case 'nome-za':
                produtos.sort((a, b) => b.nome.localeCompare(a.nome));
                break;
            case 'popular':
                produtos.sort((a, b) => b.popularidade - a.popularidade);
                break;
            case 'relevancia':
            default:
                // Ordenação por relevância (produtos em promoção primeiro, depois por popularidade)
                produtos.sort((a, b) => {
                    if (a.promocao && !b.promocao) return -1;
                    if (!a.promocao && b.promocao) return 1;
                    return b.popularidade - a.popularidade;
                });
                break;
        }
    }

    renderizarProdutos() {
        const container = document.querySelector('.produtos-grid, .produtos-container');
        if (!container) return;

        if (this.produtosFiltrados.length === 0) {
            this.renderizarNenhumResultado();
            return;
        }

        const isListaView = this.visualizacaoAtual === 'lista';
        container.className = isListaView ? 'produtos-lista' : 'produtos-grid';

        const html = this.produtosFiltrados.map(produto => 
            this.criarHTMLProduto(produto, isListaView)
        ).join('');

        container.innerHTML = html;

        // Adicionar animação de entrada
        setTimeout(() => {
            const items = container.querySelectorAll('.produto-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('fade-in');
                }, index * 100);
            });
        }, 50);
    }

    criarHTMLProduto(produto, isLista = false) {
        const promocaoTag = produto.promocao ? '<span class="produto-promocao">🏷️ Promoção</span>' : '';
        const precoFormatado = produto.preco.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        });

        if (isLista) {
            return `
                <div class="produto-item produto-lista-item" data-id="${produto.id}">
                    <div class="produto-imagem-container">
                        <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem">
                        ${promocaoTag}
                    </div>
                    <div class="produto-info-lista">
                        <h3 class="produto-nome">${produto.nome}</h3>
                        <p class="produto-descricao">${produto.descricao}</p>
                        <div class="produto-detalhes">
                            <span class="produto-categoria">${this.getCategoriaDisplay(produto.categoria)}</span>
                            <span class="produto-popularidade">⭐ ${produto.popularidade}% satisfação</span>
                        </div>
                        <div class="produto-preco-container">
                            <span class="preco">${precoFormatado}</span>
                            <button class="btn-adicionar-carrinho" onclick="adicionarAoCarrinho(${produto.id})">
                                🛒 Adicionar ao Carrinho
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="produto-item" data-id="${produto.id}">
                    <div class="produto-imagem-container">
                        <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem">
                        ${promocaoTag}
                    </div>
                    <div class="produto-info">
                        <h3 class="produto-nome">${produto.nome}</h3>
                        <p class="produto-descricao">${produto.descricao}</p>
                        <div class="produto-preco-container">
                            <span class="preco">${precoFormatado}</span>
                            <button class="btn-adicionar-carrinho" onclick="adicionarAoCarrinho(${produto.id})">
                                🛒 Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    getCategoriaDisplay(categoria) {
        const categorias = {
            'brigadeiro': '🍫 Brigadeiros',
            'beijinho': '🥥 Beijinhos',
            'ninho': '🥛 Ninhos',
            'morango': '🍓 Morango do Amor',
            'maca': '🍎 Maçã do Amor'
        };
        return categorias[categoria] || categoria;
    }

    renderizarNenhumResultado() {
        const container = document.querySelector('.produtos-grid, .produtos-container, .produtos-lista');
        if (!container) return;

        container.innerHTML = `
            <div class="nenhum-resultado">
                <div class="nenhum-resultado-icon">🔍</div>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros ou usar termos diferentes na busca.</p>
                <div class="sugestoes-busca">
                    <p><strong>Sugestões:</strong></p>
                    <div class="sugestoes-tags">
                        <span class="tag-sugestao" onclick="buscarTermo('brigadeiro')">Brigadeiros</span>
                        <span class="tag-sugestao" onclick="buscarTermo('beijinho')">Beijinhos</span>
                        <span class="tag-sugestao" onclick="buscarTermo('ninho')">Ninhos</span>
                    </div>
                </div>
                <button class="btn-limpar-busca" onclick="limparTudo()">
                    Mostrar Todos os Produtos
                </button>
            </div>
        `;
    }

    atualizarInfoResultados() {
        const infoElement = document.getElementById('resultadosInfo');
        if (!infoElement) return;

        const total = this.produtosFiltrados.length;
        const totalGeral = this.produtos.length;
        
        let texto = '';
        if (this.ultimaBusca || this.temFiltrosAtivos()) {
            texto = `Mostrando ${total} de ${totalGeral} produtos`;
            if (this.ultimaBusca) {
                texto += ` para "${this.ultimaBusca}"`;
            }
        } else {
            texto = `Mostrando todos os ${total} produtos`;
        }

        const countElement = infoElement.querySelector('.resultados-count');
        if (countElement) {
            countElement.textContent = texto;
        }
    }

    temFiltrosAtivos() {
        return this.filtrosAtivos.categorias.length > 0 || 
               this.filtrosAtivos.preco !== '' || 
               !this.filtrosAtivos.disponibilidade.includes('disponivel') ||
               this.filtrosAtivos.disponibilidade.includes('promocao');
    }

    // Métodos de controle da interface
    mostrarSugestoes() {
        const sugestoes = document.getElementById('buscaSugestoes');
        if (sugestoes) {
            sugestoes.style.display = 'block';
        }
    }

    ocultarSugestoes() {
        const sugestoes = document.getElementById('buscaSugestoes');
        if (sugestoes) {
            sugestoes.style.display = 'none';
        }
    }

    limparBusca() {
        const buscaInput = document.getElementById('buscaInput');
        if (buscaInput) {
            buscaInput.value = '';
        }
        
        this.ultimaBusca = '';
        this.aplicarFiltrosCompletos();
        
        const clearBtn = document.querySelector('.busca-clear');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
    }

    limparFiltros() {
        // Limpar checkboxes de categoria
        document.querySelectorAll('.filtro-checkbox input[type="checkbox"]:not([value="disponivel"])').forEach(cb => {
            cb.checked = false;
        });

        // Limpar radio de preço
        document.querySelectorAll('input[name="preco"]').forEach(radio => {
            radio.checked = false;
        });

        // Manter apenas "disponível" marcado
        const disponivelCheckbox = document.querySelector('.filtro-checkbox input[value="disponivel"]');
        if (disponivelCheckbox) {
            disponivelCheckbox.checked = true;
        }

        // Resetar filtros ativos
        this.filtrosAtivos = {
            categorias: [],
            preco: '',
            disponibilidade: ['disponivel']
        };

        this.aplicarFiltrosCompletos();
    }

    alterarVisualizacao(tipo) {
        this.visualizacaoAtual = tipo;
        
        // Atualizar botões ativos
        document.querySelectorAll('.btn-visualizacao').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`.btn-visualizacao.${tipo}`)?.classList.add('active');
        
        // Re-renderizar produtos
        this.renderizarProdutos();
    }
}

// Funções globais para os event handlers
function toggleFiltros() {
    const content = document.getElementById('filtrosContent');
    const toggle = document.querySelector('.filtros-toggle');
    const text = toggle?.querySelector('.filtros-toggle-text');
    const icon = toggle?.querySelector('i');
    
    if (content) {
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';
        
        if (text) {
            text.textContent = isVisible ? 'Mostrar Filtros' : 'Ocultar Filtros';
        }
        
        if (icon) {
            icon.className = isVisible ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
        }
    }
}

function buscarProdutos() {
    if (window.sistemaBusca) {
        window.sistemaBusca.buscarProdutos();
    }
}

function buscarTermo(termo) {
    if (window.sistemaBusca) {
        window.sistemaBusca.buscarTermo(termo);
    }
}

function aplicarFiltros() {
    if (window.sistemaBusca) {
        window.sistemaBusca.aplicarFiltros();
    }
}

function limparBusca() {
    if (window.sistemaBusca) {
        window.sistemaBusca.limparBusca();
    }
}

function limparFiltros() {
    if (window.sistemaBusca) {
        window.sistemaBusca.limparFiltros();
    }
}

function limparTudo() {
    limparBusca();
    limparFiltros();
}

function ordenarProdutos() {
    if (window.sistemaBusca) {
        window.sistemaBusca.ordenarProdutos();
    }
}

function alterarVisualizacao(tipo) {
    if (window.sistemaBusca) {
        window.sistemaBusca.alterarVisualizacao(tipo);
    }
}

// ===== FUNÇÃO CORRIGIDA PARA ADICIONAR AO CARRINHO =====

function adicionarAoCarrinho(produtoId) {
    try {
        console.log('Tentando adicionar produto ao carrinho:', produtoId);
        
        // Verificar se o sistema de busca existe
        if (!window.sistemaBusca) {
            console.error('Sistema de busca não encontrado');
            return;
        }

        // Encontrar o produto
        const produto = window.sistemaBusca.produtos.find(p => p.id === produtoId);
        if (!produto) {
            console.error('Produto não encontrado:', produtoId);
            return;
        }

        console.log('Produto encontrado:', produto);

        // ===== INTEGRAÇÃO COM SEU CARRINHO EXISTENTE =====
        
        // Opção 1: Se você tem o sistema de carrinho antigo
        if (window.carrinho && typeof window.carrinho.adicionarItem === 'function') {
            const produtoCarrinho = {
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                categoria: produto.categoria,
                observacoes: ''
            };
            
            window.carrinho.adicionarItem(produtoCarrinho);
            console.log('Produto adicionado via sistema antigo');
            return;
        }

        // Opção 2: Se você tem modal de observações
        if (window.modalObservacoes && typeof window.modalObservacoes.abrir === 'function') {
            const produtoModal = {
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                categoria: produto.categoria
            };
            
            window.modalObservacoes.abrir(produtoModal);
            console.log('Modal de observações aberto');
            return;
        }

        // Opção 3: Integração com sistema de carrinho mais recente
        if (window.gerenciadorCarrinho && typeof window.gerenciadorCarrinho.adicionarProduto === 'function') {
            window.gerenciadorCarrinho.adicionarProduto(produto);
            console.log('Produto adicionado via gerenciador novo');
            return;
        }

        // Opção 4: Fallback - criar sistema básico temporário
        console.log('Criando sistema básico de carrinho...');
        criarCarrinhoBasico(produto);
        
    } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        
        // Mostrar mensagem amigável ao usuário
        mostrarMensagemErro('Houve um problema ao adicionar o produto. Tente novamente.');
    }
}

// Função auxiliar para criar carrinho básico
function criarCarrinhoBasico(produto) {
    try {
        // Verificar se já existe um carrinho no localStorage
        let carrinho = JSON.parse(localStorage.getItem('carrinhoDoces') || '[]');
        
        // Adicionar produto
        const produtoCarrinho = {
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1,
            imagem: produto.imagem,
            categoria: produto.categoria,
            dataAdicao: new Date().toISOString()
        };
        
        // Verificar se produto já existe
        const existeIndex = carrinho.findIndex(item => item.id === produto.id);
        
        if (existeIndex >= 0) {
            carrinho[existeIndex].quantidade += 1;
            console.log('Quantidade aumentada para:', carrinho[existeIndex].quantidade);
        } else {
            carrinho.push(produtoCarrinho);
            console.log('Novo produto adicionado ao carrinho');
        }
        
        // Salvar no localStorage
        localStorage.setItem('carrinhoDoces', JSON.stringify(carrinho));
        
        // Mostrar notificação de sucesso
        mostrarNotificacaoSucesso(`${produto.nome} adicionado ao carrinho!`);
        
        // Atualizar contador do carrinho se existir
        atualizarContadorCarrinho(carrinho.length);
        
    } catch (error) {
        console.error('Erro no carrinho básico:', error);
        mostrarMensagemErro('Erro ao salvar no carrinho');
    }
}

// Função para mostrar notificação de sucesso
function mostrarNotificacaoSucesso(mensagem) {
    // Remover notificação existente
    const existente = document.querySelector('.notificacao-sucesso');
    if (existente) {
        existente.remove();
    }
    
    // Criar nova notificação
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao-sucesso';
    notificacao.innerHTML = `
        <div class="notificacao-content">
            <span class="notificacao-icon">🛒</span>
            <span class="notificacao-texto">${mensagem}</span>
            <button class="notificacao-fechar" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Adicionar estilos inline
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notificacao);
    
    // Auto remover após 3 segundos
    setTimeout(() => {
        if (notificacao.parentElement) {
            notificacao.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notificacao.remove(), 300);
        }
    }, 3000);
}

// Função para mostrar mensagem de erro
function mostrarMensagemErro(mensagem) {
    const erro = document.createElement('div');
    erro.className = 'notificacao-erro';
    erro.innerHTML = `
        <div class="notificacao-content">
            <span class="notificacao-icon">⚠️</span>
            <span class="notificacao-texto">${mensagem}</span>
            <button class="notificacao-fechar" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    erro.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(erro);
    
    setTimeout(() => {
        if (erro.parentElement) {
            erro.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => erro.remove(), 300);
        }
    }, 4000);
}

// Função para atualizar contador do carrinho
function atualizarContadorCarrinho(quantidade) {
    const contadores = document.querySelectorAll('.carrinho-count, .cart-count, #carrinhoCount');
    contadores.forEach(contador => {
        if (contador) {
            contador.textContent = quantidade;
            contador.style.display = quantidade > 0 ? 'block' : 'none';
        }
    });
}

// Função para ver carrinho (opcional)
function verCarrinho() {
    try {
        const carrinho = JSON.parse(localStorage.getItem('carrinhoDoces') || '[]');
        
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        let mensagem = 'Itens no seu carrinho:\n\n';
        let total = 0;
        
        carrinho.forEach((item, index) => {
            const subtotal = item.preco * item.quantidade;
            total += subtotal;
            mensagem += `${index + 1}. ${item.nome}\n`;
            mensagem += `   Quantidade: ${item.quantidade}\n`;
            mensagem += `   Preço: R$ ${item.preco.toFixed(2)}\n`;
            mensagem += `   Subtotal: R$ ${subtotal.toFixed(2)}\n\n`;
        });
        
        mensagem += `Total: R$ ${total.toFixed(2)}\n\n`;
        mensagem += 'Entre em contato pelo WhatsApp para finalizar o pedido!';
        
        alert(mensagem);
        
    } catch (error) {
        console.error('Erro ao ver carrinho:', error);
        alert('Erro ao carregar carrinho');
    }
}

// Adicionar estilos CSS para as notificações
const estilosNotificacao = document.createElement('style');
estilosNotificacao.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notificacao-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notificacao-fechar {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notificacao-fechar:hover {
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
    }
`;

document.head.appendChild(estilosNotificacao);

// Disponibilizar função globalmente
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.verCarrinho = verCarrinho;

// Inicializar sistema quando página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.sistemaBusca = new SistemaBusca();
});

// ===== FUNÇÃO DE DEBUG PARA IDENTIFICAR PROBLEMAS =====

function debugarSistemas() {
    console.log('=== DEBUG DOS SISTEMAS ===');
    console.log('window.sistemaBusca:', !!window.sistemaBusca);
    console.log('window.carrinho:', !!window.carrinho);
    console.log('window.modalObservacoes:', !!window.modalObservacoes);
    console.log('window.gerenciadorCarrinho:', !!window.gerenciadorCarrinho);
    
    if (window.sistemaBusca) {
        console.log('Produtos no sistema de busca:', window.sistemaBusca.produtos.length);
    }
    
    const carrinhoLocal = localStorage.getItem('carrinhoDoces');
    console.log('Carrinho no localStorage:', carrinhoLocal ? JSON.parse(carrinhoLocal) : 'vazio');
    
    console.log('========================');
}

// Disponibilizar função de debug
window.debugarSistemas = debugarSistemas;

// Auto-executar debug após 2 segundos (para teste)
setTimeout(() => {
    console.log('Sistema de busca carregado. Digite debugarSistemas() no console para verificar integrações.');
}, 2000);