// ----- SCROLL SUAVE PARA LINKS INTERNOS -----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Obtém o ID do elemento de destino do atributo href
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        // Verifica se o elemento de destino existe
        if (targetElement) {
            // Usa a API de scrollIntoView para um scroll suave
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


// ----- FUNCIONALIDADE DO MENU MOBILE -----
const btnMenuMobile = document.querySelector('.btn-menu-mobile');
const navbarNav = document.querySelector('.navbar nav'); // Supondo que o nav esteja dentro da .navbar

if (btnMenuMobile && navbarNav) {
    btnMenuMobile.addEventListener('click', () => {
        navbarNav.classList.toggle('active'); // Altera a classe para mostrar/esconder o menu
    });

    // Fecha o menu ao clicar em um link de navegação (opcional, mas recomendado)
    document.querySelectorAll('.navbar nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            navbarNav.classList.remove('active'); // Remove a classe para fechar o menu
        });
    });
}


// ----- LÓGICA DO BOTÃO VOLTAR AO TOPO -----
const btnVoltarAoTopo = document.getElementById('btnVoltarAoTop');

if (btnVoltarAoTopo) {
    // Mostra o botão quando o usuário rola a página para baixo por mais de 200px
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        // Verifica se a página foi rolada mais de 200px (você pode ajustar esse valor)
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            btnVoltarAoTopo.classList.add('show');
        } else {
            btnVoltarAoTopo.classList.remove('show');
        }
    }
    // O link já está configurado para ir para '#home' e com scroll suave graças ao script anterior.
}


// ----- LÓGICA DO FORMULÁRIO DE CONTATO PARA WHATSAPP -----
const formContato = document.getElementById('formContato');

if (formContato) {
    formContato.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede o envio padrão do formulário

        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const produto = document.getElementById('produto').value;
        const mensagem = document.getElementById('mensagem').value;

        // Formata o número de telefone para o link do WhatsApp (remove espaços, hífens, etc.)
        // Substitua '5549999999999' pelo seu número de WhatsApp com DDD e código do país.
        const numeroWhatsApp = '5549999999999';

        // Monta a mensagem
        let mensagemWhatsApp = `Olá! 👋\n\n`;
        mensagemWhatsApp += `Nome: ${nome}\n`;
        mensagemWhatsApp += `Telefone: ${telefone}\n`;
        if (produto) {
            mensagemWhatsApp += `Produto de Interesse: ${produto}\n`;
        }
        mensagemWhatsApp += `Mensagem:\n${mensagem.replace(/\n/g, '%0A')}\n\n`; // %0A é o código para quebra de linha em URLs

        // Cria o link para o WhatsApp
        const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`;

        // Abre o WhatsApp em uma nova aba
        window.open(linkWhatsApp, '_blank');
    });
}

// Nota: A funcionalidade de filtro de cardápio por categoria (botões na página de produtos)
// ainda não foi implementada. Seria necessário um script adicional para isso.