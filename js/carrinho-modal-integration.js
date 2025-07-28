// ===== CARRINHO-MODAL-INTEGRATION.JS - INTEGRAÇÃO DO NOVO MODAL =====

document.addEventListener('DOMContentLoaded', () => {
    // Aguardar carrinho e modal serem inicializados
    setTimeout(() => {
        if (window.carrinho && window.modalObservacoes) {
            integrarModalComCarrinho();
        }
    }, 1000);
});

function integrarModalComCarrinho() {
    // Override do método mostrarModalObservacoes do carrinho
    if (window.carrinho.mostrarModalObservacoes) {
        window.carrinho.mostrarModalObservacoes = function(produto) {
            window.modalObservacoes.mostrar(produto);
        };
    }
    
    // Override do método fecharModalObservacoes
    if (window.carrinho.fecharModalObservacoes) {
        window.carrinho.fecharModalObservacoes = function() {
            window.modalObservacoes.fechar();
        };
    }
    
    // Override do método adicionarComObservacoes
    if (window.carrinho.adicionarComObservacoes) {
        window.carrinho.adicionarComObservacoes = function() {
            // Este método agora é gerenciado pelo próprio modal
            console.log('Método delegado para o modal de observações');
        };
    }
    
    console.log('Modal integrado com sucesso ao carrinho!');
}