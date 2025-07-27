// ----- SCROLL SUAVE PARA LINKS INTERNOS -----
// Seleciona todos os links que começam com '#' (links internos/âncoras)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Previne o comportamento padrão do link (que seria ir para o ID sem animação)
        e.preventDefault();

        // Obtém o ID do elemento de destino do atributo href do link clicado
        const targetId = this.getAttribute('href');
        // Seleciona o elemento de destino no DOM
        const targetElement = document.querySelector(targetId);

        // Verifica se o elemento de destino realmente existe na página
        if (targetElement) {
            // Usa a API de scrollIntoView para um scroll suave até o elemento
            targetElement.scrollIntoView({
                behavior: 'smooth', // Define a animação como suave
                block: 'start'      // Alinha o topo do elemento com o topo da área visível
            });
        }
    });
});


// ----- FUNCIONALIDADE DO MENU MOBILE -----
// Seleciona o botão do menu mobile e a navegação
const btnMenuMobile = document.querySelector('.btn-menu-mobile');
// Assumindo que a navegação está dentro de um elemento com a classe 'navbar'
const navbarNav = document.querySelector('.navbar nav');

// Verifica se ambos os elementos foram encontrados para evitar erros
if (btnMenuMobile && navbarNav) {
    // Adiciona um listener para o clique no botão do menu
    btnMenuMobile.addEventListener('click', () => {
        // Alterna a classe 'active' na navegação para mostrar/esconder o menu
        navbarNav.classList.toggle('active');
    });

    // Fecha o menu ao clicar em um link de navegação (melhora a experiência do usuário)
    // Seleciona todos os links dentro da navegação principal
    document.querySelectorAll('.navbar nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            // Remove a classe 'active' para fechar o menu ao clicar em um link
            navbarNav.classList.remove('active');
        });
    });
}


// ----- LÓGICA DO BOTÃO VOLTAR AO TOPO -----
// Seleciona o botão "Voltar ao Topo" pelo seu ID
const btnVoltarAoTop = document.getElementById('btnVoltarAoTop');

// Verifica se o botão existe na página
if (btnVoltarAoTop) {
    // Adiciona um listener para o evento de scroll na janela
    // Utiliza addEventListener para uma melhor prática, em vez de window.onscroll
    window.addEventListener('scroll', () => {
        // Define um ponto de scroll para exibir o botão (ajustável)
        const scrollThreshold = 200; // Exibe o botão após rolar 200 pixels

        // Verifica se a página foi rolada mais do que o threshold
        // Usa document.documentElement.scrollTop para maior compatibilidade
        if (document.documentElement.scrollTop > scrollThreshold) {
            // Adiciona a classe 'show' para exibir o botão (geralmente com CSS transition)
            btnVoltarAoTop.classList.add('show');
        } else {
            // Remove a classe 'show' para esconder o botão
            btnVoltarAoTop.classList.remove('show');
        }
    });
    // Nota: O link no HTML já está configurado para ir para '#home' com scroll suave graças ao script anterior.
}


// ----- LÓGICA DO FORMULÁRIO DE CONTATO PARA WHATSAPP -----
// Seleciona o formulário de contato pelo seu ID
const formContato = document.getElementById('formContato');

// Verifica se o formulário existe na página
if (formContato) {
    // Adiciona um listener para o evento de submit do formulário
    formContato.addEventListener('submit', function(e) {
        // Impede o envio padrão do formulário (que recarregaria a página)
        e.preventDefault();

        // Captura os valores dos campos do formulário
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const produto = document.getElementById('produto').value; // Campo opcional
        const mensagem = document.getElementById('mensagem').value;

        // **IMPORTANTE:** Substitua '5549999999999' pelo seu número de WhatsApp real,
        // incluindo o código do país e DDD. Ex: '+5511987654321' ou '5511987654321'.
        const numeroWhatsApp = '554999840-6192'; // <-- LEMBRE-SE DE ATUALIZAR ESTE NÚMERO

        // Monta a mensagem que será enviada para o WhatsApp
        let mensagemWhatsApp = `Olá! 👋\n\n`; // Saudação inicial
        mensagemWhatsApp += `Nome: ${nome}\n`;
        mensagemWhatsApp += `Telefone: ${telefone}\n`;
        // Adiciona o produto apenas se ele foi preenchido
        if (produto) {
            mensagemWhatsApp += `Produto de Interesse: ${produto}\n`;
        }
        // Adiciona a mensagem do usuário, substituindo quebras de linha por '%0A' para codificação correta na URL
        mensagemWhatsApp += `Mensagem:\n${mensagem.replace(/\n/g, '%0A')}\n\n`;

        // Cria o link para o WhatsApp, codificando a mensagem para garantir que caracteres especiais funcionem
        const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`;

        // Abre o link do WhatsApp em uma nova aba/janela
        window.open(linkWhatsApp, '_blank');
    });
}

/*
   NOTA SOBRE FILTRO DE CARDÁPIO:
   A funcionalidade de filtro de cardápio por categoria (botões na página de produtos)
   ainda não foi implementada neste arquivo JavaScript. Se você desejar implementar
   o carregamento dinâmico ou filtragem de produtos, será necessário adicionar um
   script específico para essa lógica, possivelmente lendo os dados dos produtos
   (seja de um array no próprio JS ou de uma API) e manipulando a exibição dos elementos
   na página de produtos.
*/