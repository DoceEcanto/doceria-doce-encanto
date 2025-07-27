document.addEventListener('DOMContentLoaded', () => {
    // Seleção de elementos
    const btnsFiltro = document.querySelectorAll('.filtros .btn');
    const cardsProduto = document.querySelectorAll('.catalogo-grid .produto-card');
    const btnTodos = document.querySelector('.filtro-todos');
    const btnPedir = document.querySelectorAll('.catalogo-grid .btn-secondary[data-produto]');

    // Função para obter as categorias de um produto
    function getCategories(card) {
        const categoria = card.getAttribute('data-categoria') || '';
        return categoria.split(' ').map(c => c.trim()).filter(Boolean);
    }

    // Função para aplicar o filtro
    function aplicarFiltro(categoria) {
        cardsProduto.forEach(card => {
            const categorias = getCategories(card);
            if (categoria === 'todos' || categorias.includes(categoria)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Função para remover classe ativa de todos os filtros
    function limparFiltros() {
        btnsFiltro.forEach(btn => btn.classList.remove('filtro-ativo'));
    }

    // Lógica de clique nos botões de filtro
    btnsFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            limparFiltros();
            btn.classList.add('filtro-ativo');
            const categoria = btn.getAttribute('data-categoria');
            aplicarFiltro(categoria);
        });
    });

    // Garante que o filtro "Todos" esteja ativo ao carregar a página
    if (btnTodos) {
        limparFiltros();
        btnTodos.classList.add('filtro-ativo');
        aplicarFiltro('todos');
    }

    // Lógica dos botões "Pedir Agora"
    function abrirWhatsApp(produto) {
        const numeroWhatsApp = '+5549998314260'; // <<<<< ATENÇÃO: SUBSTITUA POR SEU NÚMERO REAL
        const mensagem = `Olá! Gostaria de saber mais sobre o produto: ${produto}`;
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
        window.open(urlWhatsApp, '_blank');
    }

    btnPedir.forEach(botao => {
        botao.addEventListener('click', () => {
            const produto = botao.getAttribute('data-produto');
            if (produto) {
                abrirWhatsApp(produto);
            }
        });
    });
});