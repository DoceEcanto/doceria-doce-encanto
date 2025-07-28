// ===== MODAL-FIX-ADICIONAR-SEMPRE.JS - X ADICIONA AUTOMATICAMENTE =====

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        configurarModalAdicionarSempre();
    }, 2000);
});

function configurarModalAdicionarSempre() {
    console.log('Configurando modal para adicionar sempre...');
    
    // Remover event listeners antigos
    document.removeEventListener('click', handleModalClickAdicionarSempre);
    
    // Criar handler que SEMPRE adiciona
    function handleModalClickAdicionarSempre(e) {
        // Se não é o modal, ignorar
        if (!document.querySelector('.carrinho-modal.ativo')) {
            return;
        }
        
        // Função para adicionar produto
        function adicionarProdutoComObservacoes() {
            const modal = document.querySelector('.carrinho-modal');
            const textarea = modal?.querySelector('textarea');
            const observacoes = textarea?.value.trim() || '';
            
            if (window.carrinho && window.carrinho.produtoTemporario) {
                console.log('🟢 Adicionando produto:', window.carrinho.produtoTemporario.nome);
                console.log('📝 Com observações:', observacoes || 'Nenhuma');
                
                // Adicionar ao carrinho
                window.carrinho.adicionarItem(window.carrinho.produtoTemporario, observacoes);
                
                // Fechar modal
                if (window.modalObservacoes) {
                    window.modalObservacoes.fechar();
                }
                
                // Limpar produto temporário
                window.carrinho.produtoTemporario = null;
                
                return true;
            }
            
            console.error('❌ Produto temporário não encontrado');
            return false;
        }
        
        // Botão X de fechar - ADICIONAR AUTOMATICAMENTE
        if (e.target.closest('.carrinho-modal-fechar')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔴 X clicado - ADICIONANDO automaticamente');
            adicionarProdutoComObservacoes();
            return;
        }
        
        // Click fora do modal - ADICIONAR AUTOMATICAMENTE
        if (e.target.closest('.carrinho-modal') && !e.target.closest('.carrinho-modal-content')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔴 Clicou fora - ADICIONANDO automaticamente');
            adicionarProdutoComObservacoes();
            return;
        }
        
        // Tecla ESC - ADICIONAR AUTOMATICAMENTE
        if (e.key === 'Escape' && document.querySelector('.carrinho-modal.ativo')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔴 ESC pressionado - ADICIONANDO automaticamente');
            adicionarProdutoComObservacoes();
            return;
        }
        
        // Botão cancelar - ADICIONAR AUTOMATICAMENTE
        if (e.target.closest('.btn-modal-cancelar')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔴 Cancelar clicado - ADICIONANDO automaticamente');
            adicionarProdutoComObservacoes();
            return;
        }
        
        // Botão adicionar - ADICIONAR COM LOADING
        if (e.target.closest('.btn-modal-adicionar')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🟢 Botão adicionar clicado');
            
            const btn = e.target.closest('.btn-modal-adicionar');
            
            // Mostrar loading
            btn.classList.add('loading');
            btn.disabled = true;
            btn.textContent = 'Adicionando...';
            
            setTimeout(() => {
                const sucesso = adicionarProdutoComObservacoes();
                
                // Restaurar botão
                btn.classList.remove('loading');
                btn.disabled = false;
                btn.innerHTML = '🛒 Adicionar ao Carrinho';
                
                if (!sucesso) {
                    alert('Erro ao adicionar produto. Tente novamente.');
                }
            }, 800);
            
            return;
        }
    }
    
    // Adicionar event listener para clicks
    document.addEventListener('click', handleModalClickAdicionarSempre);
    
    // Adicionar event listener para teclas
    document.addEventListener('keydown', handleModalClickAdicionarSempre);
    
    console.log('✅ Modal configurado para SEMPRE adicionar!');
}

// Função de teste
function testarModalAdicionarSempre() {
    console.log('=== TESTE MODAL ADICIONAR SEMPRE ===');
    console.log('Modal existe:', !!window.modalObservacoes);
    console.log('Carrinho existe:', !!window.carrinho);
    
    if (window.carrinho) {
        console.log('Produto temporário:', window.carrinho.produtoTemporario);
        console.log('Itens no carrinho:', window.carrinho.getTotalItens());
    }
    
    const modal = document.querySelector('.carrinho-modal');
    console.log('Modal DOM existe:', !!modal);
    console.log('Modal ativo:', modal?.classList.contains('ativo'));
    
    if (modal && modal.classList.contains('ativo')) {
        const textarea = modal.querySelector('textarea');
        console.log('Observações atuais:', textarea?.value || 'Nenhuma');
    }
    
    console.log('================================');
}

window.testarModalAdicionarSempre = testarModalAdicionarSempre;

// Atualizar textos dos botões para deixar claro
function atualizarTextosBotoes() {
    const checkModal = setInterval(() => {
        const modal = document.querySelector('.carrinho-modal');
        if (modal) {
            // Alterar texto do botão cancelar
            const btnCancelar = modal.querySelector('.btn-modal-cancelar');
            if (btnCancelar) {
                btnCancelar.innerHTML = '✅ Adicionar Simples';
                btnCancelar.title = 'Adicionar sem observações especiais';
            }
            
            // Manter botão adicionar como está
            const btnAdicionar = modal.querySelector('.btn-modal-adicionar');
            if (btnAdicionar) {
                btnAdicionar.innerHTML = '🛒 Adicionar com Observações';
                btnAdicionar.title = 'Adicionar com as observações escritas';
            }
            
            clearInterval(checkModal);
        }
    }, 100);
}

// Executar quando modal for criado
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(atualizarTextosBotoes, 3000);
});