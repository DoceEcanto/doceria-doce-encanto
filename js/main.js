// ----- SCROLL SUAVE PARA LINKS INTERNOS -----
// Seleciona todos os links que começam com '#' (âncoras internas), mas ignora se for só '#'
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId.length > 1) {
            // Só bloqueia se o destino existir e não for só '#'
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// ----- FUNCIONALIDADE DO MENU MOBILE -----
const btnMenuMobile = document.querySelector('.btn-menu-mobile');
const navbarNav = document.querySelector('.navbar nav');

if (btnMenuMobile && navbarNav) {
    btnMenuMobile.addEventListener('click', () => {
        navbarNav.classList.toggle('active');
    });

    // Fecha o menu ao clicar em qualquer link do menu
    navbarNav.querySelectorAll('ul li a').forEach(link => {
        link.addEventListener('click', () => {
            navbarNav.classList.remove('active');
        });
    });
}

// ----- LÓGICA DO BOTÃO VOLTAR AO TOPO -----
const btnVoltarAoTop = document.getElementById('btnVoltarAoTop');
if (btnVoltarAoTop) {
    window.addEventListener('scroll', () => {
        const scrollThreshold = 200;
        if (document.documentElement.scrollTop > scrollThreshold || window.scrollY > scrollThreshold) {
            btnVoltarAoTop.classList.add('show');
        } else {
            btnVoltarAoTop.classList.remove('show');
        }
    });
    // O HTML já faz o scroll suave via script acima
}

// ----- LÓGICA DO FORMULÁRIO DE CONTATO PARA WHATSAPP -----
const formContato = document.getElementById('formContato');
if (formContato) {
    formContato.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const produto = document.getElementById('produto') ? document.getElementById('produto').value : '';
        const mensagem = document.getElementById('mensagem').value;

        // WhatsApp SEM hífen (só números, DDI e DDD)
        const numeroWhatsApp = '5549998406192';

        // Gera a mensagem de forma clara e com quebras de linha reais
        let mensagemWhatsApp = `Olá! 👋\n\nNome: ${nome}\nTelefone: ${telefone}\n`;
        if (produto) mensagemWhatsApp += `Produto de Interesse: ${produto}\n`;
        mensagemWhatsApp += `Mensagem:\n${mensagem}\n\n`;

        const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`;
        window.open(linkWhatsApp, '_blank');
    });
}

/*
   NOTA SOBRE FILTRO DE CARDÁPIO:
   Não implementado aqui. Para filtro dinâmico de produtos, será necessário logic JS extra.
*/