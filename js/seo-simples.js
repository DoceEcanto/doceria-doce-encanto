// ===== SEO-SIMPLES.JS - VERSÃO SEGURA SEM ERROS =====

// Aguardar página carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando SEO simples...');
    
    try {
        // Aguardar um pouco mais para evitar conflitos
        setTimeout(function() {
            iniciarSEOSeguro();
        }, 1000);
    } catch (error) {
        console.error('Erro no SEO:', error);
    }
});

function iniciarSEOSeguro() {
    try {
        console.log('Aplicando melhorias de SEO...');
        
        // 1. Melhorar meta description se não existir
        melhorarMetaDescription();
        
        // 2. Adicionar alt text em imagens
        melhorarImagensAltText();
        
        // 3. Melhorar títulos das páginas
        melhorarTituloPagina();
        
        console.log('SEO aplicado com sucesso!');
        
    } catch (error) {
        console.error('Erro ao aplicar SEO:', error);
        // Não quebrar a página, apenas logar o erro
    }
}

function melhorarMetaDescription() {
    try {
        const metaDescription = document.querySelector('meta[name="description"]');
        
        if (!metaDescription) {
            const meta = document.createElement('meta');
            meta.setAttribute('name', 'description');
            meta.setAttribute('content', 'Doce Encanto - Docinhos artesanais por cento em Chapecó SC. Brigadeiros, beijinhos, ninhos, morango do amor. Entrega rápida!');
            document.head.appendChild(meta);
            console.log('Meta description adicionada');
        }
    } catch (error) {
        console.error('Erro na meta description:', error);
    }
}

function melhorarImagensAltText() {
    try {
        const imagens = document.querySelectorAll('img');
        let contador = 0;
        
        imagens.forEach(function(img) {
            if (!img.alt || img.alt.trim() === '') {
                const src = img.src.toLowerCase();
                
                if (src.includes('brigadeiro')) {
                    img.alt = 'Brigadeiros artesanais gourmet da Doce Encanto';
                } else if (src.includes('beijinho')) {
                    img.alt = 'Beijinhos com coco da Doce Encanto';
                } else if (src.includes('ninho')) {
                    img.alt = 'Ninhos especiais da Doce Encanto';
                } else if (src.includes('morango')) {
                    img.alt = 'Morango do amor da Doce Encanto';
                } else if (src.includes('maca')) {
                    img.alt = 'Maçã do amor da Doce Encanto';
                } else if (src.includes('logo')) {
                    img.alt = 'Logo da Doce Encanto - Docinhos Artesanais';
                } else {
                    img.alt = 'Docinhos artesanais da Doce Encanto';
                }
                
                contador++;
            }
        });
        
        if (contador > 0) {
            console.log('Alt text adicionado em ' + contador + ' imagens');
        }
    } catch (error) {
        console.error('Erro nas imagens:', error);
    }
}

function melhorarTituloPagina() {
    try {
        const currentTitle = document.title;
        const currentPath = window.location.pathname;
        
        // Se o título não contém "Doce Encanto", melhorar
        if (!currentTitle.includes('Doce Encanto')) {
            let novoTitulo = '';
            
            if (currentPath.includes('/produtos/')) {
                novoTitulo = 'Cardápio de Docinhos por Cento - Brigadeiros, Beijinhos | Doce Encanto';
            } else if (currentPath.includes('/sobre/')) {
                novoTitulo = 'Nossa História - Especialistas em Docinhos Artesanais | Doce Encanto';
            } else if (currentPath.includes('/contato/')) {
                novoTitulo = 'Faça seu Pedido - Contato e Encomendas | Doce Encanto Chapecó';
            } else if (currentPath.includes('/galeria/')) {
                novoTitulo = 'Galeria de Docinhos - Veja Nossos Trabalhos | Doce Encanto';
            } else {
                novoTitulo = 'Doce Encanto - Docinhos por Cento em Chapecó SC | Brigadeiros, Beijinhos';
            }
            
            if (novoTitulo) {
                document.title = novoTitulo;
                console.log('Título da página atualizado');
            }
        }
    } catch (error) {
        console.error('Erro no título:', error);
    }
}

// Função para testar se tudo está funcionando
function testarSEO() {
    console.log('=== TESTE DE SEO ===');
    console.log('Título:', document.title);
    
    const metaDesc = document.querySelector('meta[name="description"]');
    console.log('Meta description:', metaDesc ? metaDesc.content : 'Não encontrada');
    
    const imagensSemAlt = document.querySelectorAll('img:not([alt]), img[alt=""]');
    console.log('Imagens sem alt:', imagensSemAlt.length);
    
    console.log('SEO está funcionando!');
}

// Disponibilizar função de teste globalmente
window.testarSEO = testarSEO;