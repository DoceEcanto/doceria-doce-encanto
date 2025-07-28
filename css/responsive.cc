/* ===== RESPONSIVE.CSS - SISTEMA RESPONSIVO AVANÇADO ===== */

/* Mobile-First Approach - Base styles for mobile */
:root
{
    /* Responsive spacing scale */
    --space - xs : clamp(0.25rem, 1vw, 0.5rem);
    --space - sm : clamp(0.5rem, 2vw, 1rem);
    --space - md : clamp(1rem, 3vw, 2rem);
    --space - lg : clamp(2rem, 5vw, 4rem);
    --space - xl : clamp(3rem, 8vw, 6rem);

    /* Responsive font scale */
    --text - xs : clamp(0.75rem, 1.5vw, 0.875rem);
    --text - sm : clamp(0.875rem, 2vw, 1rem);
    --text - base : clamp(1rem, 2.5vw, 1.125rem);
    --text - lg : clamp(1.125rem, 3vw, 1.5rem);
    --text - xl : clamp(1.5rem, 4vw, 2rem);
    --text - 2xl : clamp(2rem, 5vw, 3rem);
    --text - 3xl : clamp(2.5rem, 6vw, 4rem);

    /* Container sizes */
    --container - xs : 100 % ;
    --container - sm : 640px;
    --container - md : 768px;
    --container - lg : 1024px;
    --container - xl : 1280px;
    --container - 2xl : 1536px;

    /* Grid breakpoints */
    --bp - xs : 320px;
    --bp - sm : 640px;
    --bp - md : 768px;
    --bp - lg : 1024px;
    --bp - xl : 1280px;
    --bp - 2xl : 1536px;
}

/* Container system responsivo */
.container
{
width:
    100 % ;
margin:
    0 auto;
padding:
    0 var(--space - sm);
    max - width : var(--container - xs);
}

/* Grid system flexível */
.grid
{
display:
    grid;
gap:
    var(--space - md);
    grid - template - columns : 1fr;
}

.grid - auto - fit
{
    grid - template - columns : repeat(auto - fit, minmax(min(280px, 100 %), 1fr));
}

.grid - auto - fill
{
    grid - template - columns : repeat(auto - fill, minmax(min(250px, 100 %), 1fr));
}

/* Flex utilities responsivos */
.flex
{
display:
    flex;
gap:
    var(--space - sm);
}

.flex - col
{
    flex - direction : column;
}

.flex - wrap
{
    flex - wrap : wrap;
}

.items - center { align - items : center; }
.justify - center { justify - content : center; }
.justify - between { justify - content : space - between; }

/* Typography responsiva */
.text - xs { font - size : var(--text - xs); }
.text - sm { font - size : var(--text - sm); }
.text - base { font - size : var(--text - base); }
.text - lg { font - size : var(--text - lg); }
.text - xl { font - size : var(--text - xl); }
.text - 2xl { font - size : var(--text - 2xl); }
.text - 3xl { font - size : var(--text - 3xl); }

/* Spacing responsivo */
.p - xs
{
padding:
    var(--space - xs);
}
.p - sm
{
padding:
    var(--space - sm);
}
.p - md
{
padding:
    var(--space - md);
}
.p - lg
{
padding:
    var(--space - lg);
}
.p - xl
{
padding:
    var(--space - xl);
}

.m - xs
{
margin:
    var(--space - xs);
}
.m - sm
{
margin:
    var(--space - sm);
}
.m - md
{
margin:
    var(--space - md);
}
.m - lg
{
margin:
    var(--space - lg);
}
.m - xl
{
margin:
    var(--space - xl);
}

/* Navbar responsiva */
.navbar
{
padding:
    var(--space - sm) 0;
position:
    relative;
}

.navbar.container
{
display:
    flex;
    align - items : center;
    justify - content : space - between;
    flex - wrap : wrap;
}

.navbar nav
{
order:
    3;
    flex - basis : 100 % ;
    margin - top : var(--space - sm);
background:
    var(--bg - primary);
    border - radius : 8px;
    box - shadow : 0 4px 12px rgba(0, 0, 0, 0.1);
transform:
    translateY(-100 %);
opacity:
    0;
visibility:
    hidden;
transition:
    all 0.3s ease;
}

.navbar nav.active
{
transform:
    translateY(0);
opacity:
    1;
visibility:
    visible;
}

.navbar nav ul
{
    flex - direction : column;
padding:
    var(--space - sm);
gap:
    0;
}

.navbar nav ul li
{
width:
    100 % ;
    border - bottom : 1px solid rgba(0, 0, 0, 0.1);
}

.navbar nav ul li : last - child
{
    border - bottom : none;
}

.navbar nav ul li a
{
display:
    block;
padding:
    var(--space - sm);
width:
    100 % ;
    text - align : center;
    border - radius : 4px;
transition:
    all 0.3s ease;
}

.btn - menu - mobile
{
display:
    block;
background:
    none;
border:
    none;
    font - size : var(--text - xl);
cursor:
    pointer;
padding:
    var(--space - xs);
    border - radius : 4px;
transition:
    background 0.3s ease;
order:
    2;
}

.btn - menu - mobile : hover
{
background:
    rgba(255, 105, 180, 0.1);
}

/* Hero section responsiva */
.hero.container
{
    flex - direction : column;
    text - align : center;
gap:
    var(--space - lg);
}

.hero - text
{
order:
    2;
}

.hero - image
{
order:
    1;
    max - width : 300px;
margin:
    0 auto;
}

.hero - cta
{
    flex - direction : column;
gap:
    var(--space - sm);
    align - items : center;
}

/* Produtos grid responsivo */
.produtos - grid
{
    grid - template - columns : 1fr;
gap:
    var(--space - md);
}

.produto - item
{
    max - width : 100 % ;
margin:
    0 auto;
}

.produto - item img
{
width:
    100 % ;
    aspect - ratio : 1 / 1;
    object - fit : cover;
    border - radius : 8px;
}

/* Categorias navigation responsiva */
.categorias - nav
{
display:
    flex;
    flex - wrap : wrap;
gap:
    var(--space - sm);
    justify - content : center;
    margin - bottom : var(--space - lg);
}

.btn - categoria
{
flex:
    1;
    min - width : 120px;
    max - width : 200px;
padding:
    var(--space - sm);
    font - size : var(--text - sm);
}

/* Depoimentos responsivos */
.depoimentos - slider
{
    grid - template - columns : 1fr;
gap:
    var(--space - lg);
}

.depoimento - item
{
    text - align : center;
padding:
    var(--space - md);
}

.depoimento - avatar
{
    margin - bottom : var(--space - sm);
}

.depoimento - avatar img
{
width:
    80px;
height:
    80px;
    border - radius : 50 % ;
    object - fit : cover;
}

/* Footer responsivo */
.footer - content
{
    flex - direction : column;
    text - align : center;
gap:
    var(--space - lg);
}

.footer - links,
    .footer - social
{
order:
    2;
}

.footer - logo
{
order:
    1;
}

/* Formulários responsivos */
.form - group
{
    margin - bottom : var(--space - md);
}

.form - group label
{
display:
    block;
    margin - bottom : var(--space - xs);
    font - weight : 600;
}

.form - group input,
    .form - group textarea,
    .form - group select
{
width:
    100 % ;
padding:
    var(--space - sm);
border:
    2px solid #e2e8f0;
    border - radius : 8px;
    font - size : var(--text - base);
transition:
    border - color 0.3s ease;
}

.form - group input : focus,
    .form - group textarea : focus,
    .form - group select : focus
{
    border - color : #ff69b4;
outline:
    none;
}

/* Botões responsivos */
.btn
{
padding:
    var(--space - sm) var(--space - md);
    font - size : var(--text - base);
    border - radius : 8px;
border:
    none;
cursor:
    pointer;
transition:
    all 0.3s ease;
    text - decoration : none;
display:
    inline - flex;
    align - items : center;
    justify - content : center;
gap:
    var(--space - xs);
    min - height : 48px;
    font - weight : 600;
}

.btn - primary
{
background:
    linear - gradient(45deg, #ff69b4, #ff1493);
color:
    white;
}

.btn - secondary
{
background:
    white;
color:
#ff69b4;
border:
    2px solid #ff69b4;
}

.btn - block
{
width:
    100 % ;
    justify - content : center;
}

/* Cards responsivos */
.card
{
background:
    white;
    border - radius : 12px;
    box - shadow : 0 4px 12px rgba(0, 0, 0, 0.1);
padding:
    var(--space - md);
transition:
    transform 0.3s ease, box - shadow 0.3s ease;
}

.card : hover
{
transform:
    translateY(-4px);
    box - shadow : 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Utilities de visibilidade */
.mobile - only
{
display:
    block;
}
.tablet - only,
    .desktop - only
{
display:
    none;
}

/* =========================== */
/* TABLET BREAKPOINT (768px+) */
/* =========================== */
@media(min - width : 768px)
{
    :root
    {
        --space - sm : 1rem;
        --space - md : 2rem;
        --space - lg : 3rem;
        --space - xl : 4rem;
    }

    .container
    {
        max - width : var(--container - md);
    padding:
        0 var(--space - md);
    }

    /* Navbar tablet */
    .navbar nav
    {
    order:
        2;
        flex - basis : auto;
        margin - top : 0;
    background:
        transparent;
        box - shadow : none;
    transform:
        none;
    opacity:
        1;
    visibility:
        visible;
    }

    .navbar nav ul
    {
        flex - direction : row;
    padding:
        0;
    gap:
        var(--space - md);
    }

    .navbar nav ul li
    {
    width:
        auto;
        border - bottom : none;
    }

    .navbar nav ul li a
    {
    padding:
        var(--space - xs) var(--space - sm);
        text - align : left;
    }

    .btn - menu - mobile
    {
    display:
        none;
    }

    /* Hero tablet */
    .hero.container
    {
        flex - direction : row;
        align - items : center;
        text - align : left;
    }

    .hero - text
    {
    order:
        1;
    flex:
        1;
    }

    .hero - image
    {
    order:
        2;
    flex:
        0 0 40 % ;
        max - width : none;
    }

    .hero - cta
    {
        flex - direction : row;
        align - items : flex - start;
        justify - content : flex - start;
    }

    /* Grid tablet */
    .grid
    {
        grid - template - columns : repeat(2, 1fr);
    }

    .produtos - grid
    {
        grid - template - columns : repeat(2, 1fr);
    }

    /* Depoimentos tablet */
    .depoimentos - slider
    {
        grid - template - columns : repeat(2, 1fr);
    }

    /* Categorias tablet */
    .btn - categoria
    {
    flex:
        0 1 auto;
        min - width : 100px;
    }

    /* Footer tablet */
    .footer - content
    {
        flex - direction : row;
        text - align : left;
        justify - content : space - between;
        align - items : flex - start;
    }

    .footer - logo
    {
    order:
        1;
    flex:
        1;
    }

    .footer - links
    {
    order:
        2;
    flex:
        1;
    }

    .footer - social
    {
    order:
        3;
    flex:
        1;
        text - align : right;
    }

    /* Utilities tablet */
    .mobile - only
    {
    display:
        none;
    }
    .tablet - only
    {
    display:
        block;
    }
    .desktop - only
    {
    display:
        none;
    }
}

/* ============================= */
/* DESKTOP BREAKPOINT (1024px+) */
/* ============================= */
@media(min - width : 1024px)
{
    :root
    {
        --space - md : 2.5rem;
        --space - lg : 4rem;
        --space - xl : 6rem;
    }

    .container
    {
        max - width : var(--container - lg);
    }

    /* Grid desktop */
    .grid
    {
        grid - template - columns : repeat(3, 1fr);
    }

    .produtos - grid
    {
        grid - template - columns : repeat(3, 1fr);
    }

    /* Hero desktop */
    .hero - image
    {
    flex:
        0 0 45 % ;
    }

    /* Sobre desktop */
    .sobre - content
    {
    display:
        grid;
        grid - template - columns : 1fr 1fr;
    gap:
        var(--space - xl);
        align - items : center;
    }

    /* Formulário desktop */
    .contato - formulario
    {
        max - width : 600px;
    }

    /* Utilities desktop */
    .tablet - only
    {
    display:
        none;
    }
    .desktop - only
    {
    display:
        block;
    }
}

/* ============================== */
/* LARGE DESKTOP (1280px+) */
/* ============================== */
@media(min - width : 1280px)
{
    .container
    {
        max - width : var(--container - xl);
    padding:
        0 var(--space - lg);
    }

    .produtos - grid
    {
        grid - template - columns : repeat(4, 1fr);
    }

    .grid
    {
        grid - template - columns : repeat(4, 1fr);
    }
}

/* ============================== */
/* ULTRA WIDE (1536px+) */
/* ============================== */
@media(min - width : 1536px)
{
    .container
    {
        max - width : var(--container - 2xl);
    }

    .produtos - grid
    {
        grid - template - columns : repeat(5, 1fr);
    }
}

/* ============================== */
/* LANDSCAPE MOBILE */
/* ============================== */
@media(max - height : 600px) and (orientation : landscape)
{
    .hero
    {
        min - height : auto;
    padding:
        var(--space - md) 0;
    }

    .hero.container
    {
        flex - direction : row;
    gap:
        var(--space - md);
    }

    .hero - text
    {
    flex:
        1;
    }

    .hero - image
    {
    flex:
        0 0 40 % ;
        max - width : 300px;
    }

    .page - banner
    {
    padding:
        var(--space - lg) 0;
    }

    .navbar
    {
    padding:
        var(--space - xs) 0;
    }
}

/* ============================== */
/* PRINT STYLES */
/* ============================== */
@media print
{
    :root
    {
        --space - xs : 0.25rem;
        --space - sm : 0.5rem;
        --space - md : 1rem;
        --space - lg : 1.5rem;
        --space - xl : 2rem;
    }

    .navbar,
        .btn,
        .whatsapp - float,
        .btn - voltar - ao - topo,
        .loading - screen,
        .floating - elements,
        .btn - menu - mobile
    {
    display:
        none !important;
    }

    .container
    {
        max - width : none;
    padding:
        0;
    }

    .hero,
        .page - banner
    {
    background:
        none !important;
    color:
# 000 !important;
    }

    .produtos - grid
    {
        grid - template - columns : repeat(2, 1fr);
    gap:
        1rem;
    }

    .produto - item
    {
        break - inside : avoid;
    }

    body
    {
        font - size : 12pt;
        line - height : 1.4;
    color:
# 000;
    background:
#fff;
    }

    h1 { font - size : 18pt; }
    h2 { font - size : 16pt; }
    h3 { font - size : 14pt; }
    p { font - size : 12pt; }
}

/* ============================== */
/* ACCESSIBILITY IMPROVEMENTS */
/* ============================== */
@media(prefers - reduced - motion : reduce)
{
    .card,
        .btn,
        .produto - item
    {
    transition:
        none;
    }

    .navbar nav
    {
    transition:
        none;
    }

    .hero - image,
        .loading - spinner
    {
    animation:
        none;
    }
}

/* High contrast mode */
@media(prefers - contrast : high)
{
    :root
    {
        --bg - primary : #000;
        --text - primary : #fff;
        --accent : #fff;
    }

    .btn - primary
    {
    background:
#fff;
    color:
# 000;
    border:
        2px solid #fff;
    }

    .btn - secondary
    {
    background:
# 000;
    color:
#fff;
    border:
        2px solid #fff;
    }

    .card
    {
    border:
        2px solid #fff;
    }
}

/* Dark mode system preference */
@media(prefers - color - scheme : dark)
{
    :root
    {
        --bg - primary : #1a1a1a;
        --text - primary : #f0f0f0;
        --bg - secondary : #2d2d2d;
    }

    body
    {
    background:
        var(--bg - primary);
    color:
        var(--text - primary);
    }

    .card
    {
    background:
        var(--bg - secondary);
    border:
        1px solid #444;
    }

    .navbar
    {
    background:
        rgba(26, 26, 26, 0.9);
    }
}

/* ============================== */
/* TOUCH IMPROVEMENTS */
/* ============================== */
@media(hover : none) and (pointer : coarse)
{
    .btn,
        .btn - categoria,
        .produto - item
    {
        min - height : 48px;
        min - width : 48px;
    }

    .btn : hover,
        .produto - item : hover
    {
    transform:
        none;
    }

    .btn : active,
        .produto - item : active
    {
    transform:
        scale(0.98);
    }

    /* Increase tap targets */
    nav ul li a
    {
    padding:
        1rem;
    }

    .footer - social a
    {
    padding:
        0.5rem;
        min - width : 48px;
        min - height : 48px;
    display:
        inline - flex;
        align - items : center;
        justify - content : center;
    }
}

/* ============================== */
/* CONTAINER QUERIES (Future) */
/* ============================== */
@supports(container - type : inline - size)
{
    .produtos - section
    {
        container - type : inline - size;
    }

    @container(min - width : 400px)
    {
        .produto - item
        {
        display:
            grid;
            grid - template - columns : auto 1fr;
        gap:
            1rem;
            align - items : center;
        }

        .produto - item img
        {
        width:
            120px;
        height:
            120px;
        }
    }

    @container(min - width : 600px)
    {
        .produtos - grid
        {
            grid - template - columns : repeat(2, 1fr);
        }
    }

    @container(min - width : 900px)
    {
        .produtos - grid
        {
            grid - template - columns : repeat(3, 1fr);
        }
    }
}