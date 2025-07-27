document.addEventListener('DOMContentLoaded', () => {
    const btnsFiltro = document.querySelectorAll('.filtros .btn');
    const cardsProduto = document.querySelectorAll('.catalogo-grid .produto-card');
    const btnTodos = document.querySelector('.filtro-todos');

    // Adiciona evento de clique para cada botão de filtro
    btnsFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe 'filtro-ativo' de todos os botões
            btnsFiltro.forEach(b => b.classList.remove('filtro-ativo'));
            // Adiciona a classe 'filtro-ativo' ao botão clicado
            btn.classList.add('filtro-ativo');

            const categoriaFiltrada = btn.getAttribute('data-categoria');

            // Mostra ou esconde os cards de produto
            cardsProduto.forEach(card => {
                const categoriasDoCard = card.getAttribute('data-categoria').split(' '); // Divide se houver múltiplas categorias

                if (categoriaFiltrada === 'todos' || categoriasDoCard.includes(categoriaFiltrada)) {
                    card.style.display = 'block'; // Mostra o card
                } else {
                    card.style.display = 'none'; // Esconde o card
                }
            });
        });
    });

    // ----- FUNCIONALIDADE DOS BOTÕES "PEDIR AGORA" NA PÁGINA DE CATÁLOGO -----
    // Reutilizamos o código do main.js para os botões de pedir
    const botoesPedirCatalogo = document.querySelectorAll('.catalogo-grid .btn-secondary[data-produto]');

    botoesPedirCatalogo.forEach(botao => {
        botao.addEventListener('click', () => {
            const produtoNome = botao.getAttribute('data-produto');
            const numeroWhatsApp = '+5549998314260'; // <<<<< ATENÇÃO: SUBSTITUA POR SEU NÚMERO REAL

            const mensagem = `Olá! Gostaria de saber mais sobre o produto: ${produtoNome}`;
            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

            window.open(urlWhatsApp, '_blank');
        });
    });
});