// ===== SEO-DOCINHOS.JS - SEO OTIMIZADO PARA DOCINHOS =====

class SEODocinhos {
    constructor() {
        this.baseTitle = 'Doce Encanto';
        this.baseDomain = 'https://seudominio.com';
        this.defaultImage = '/images/docinhos-og.jpg';
        this.produtos = {
            'brigadeiro': {
                nome: 'Brigadeiros Artesanais',
                descricao: 'Brigadeiros cremosos feitos com chocolate belga',
                preco: 85.00,
                keywords: 'brigadeiros artesanais, brigadeiro gourmet, doce festa'
            },
            'beijinho': {
                nome: 'Beijinhos Gourmet',
                descricao: 'Beijinhos com coco fresco e leite condensado especial',
                preco: 80.00,
                keywords: 'beijinhos coco, doce branco, festa infantil'
            },
            'ninho': {
                nome: 'Ninhos Especiais',
                descricao: 'Docinhos de leite ninho cremosos e irresistíveis',
                preco: 90.00,
                keywords: 'ninho doce, leite ninho, doces especiais'
            },
            'morango-amor': {
                nome: 'Morango do Amor',
                descricao: 'Morangos frescos cobertos com chocolate especial',
                preco: 120.00,
                keywords: 'morango chocolate, frutas amor, doces românticos'
            },
            'maca-amor': {
                nome: 'Maçã do Amor',
                descricao: 'Maçãs crocantes com cobertura doce colorida',
                preco: 110.00,
                keywords: 'maçã doce, doce festa junina, cobertura colorida'
            }
        };
        this.init();
    }

    init() {
        this.setupPageSpecificSEO();
        this.addDocinhosStructuredData();
        this.optimizeForLocalSEO();
        this.addFAQs();
        this.setupDocinhosBreadcrumbs();
        console.log('SEO para Docinhos inicializado!');
    }

    setupPageSpecificSEO() {
        const page = this.getCurrentPage();
        const seoData = this.getDocinhosPageSEO(page);
        
        this.updateMetaTags(seoData);
        this.updateOpenGraph(seoData);
    }

    getCurrentPage() {
        const path = window.location.pathname;
        
        if (path.includes('/produtos/')) return 'produtos';
        if (path.includes('/sobre/')) return 'sobre';
        if (path.includes('/contato/')) return 'contato';
        if (path.includes('/galeria/')) return 'galeria';
        
        return 'home';
    }

    getDocinhosPageSEO(page) {
        const seoPages = {
            home: {
                title: 'Doce Encanto - Docinhos por Cento em Chapecó SC | Brigadeiros, Beijinhos, Ninhos',
                description: '🍬 Especialistas em docinhos por cento em Chapecó! Brigadeiros artesanais, beijinhos gourmet, ninhos especiais, morango do amor, maçã do amor. Encomende já!',
                keywords: 'docinhos por cento chapecó, brigadeiros artesanais, beijinhos gourmet, ninhos doces, festa docinhos, cento doces',
                type: 'website',
                image: '/images/home-docinhos.jpg'
            },
            produtos: {
                title: 'Cardápio de Docinhos por Cento - Brigadeiros, Beijinhos, Ninhos | Doce Encanto',
                description: '🧁 Veja nosso cardápio completo: cento de brigadeiros R\$85, beijinhos R\$80, ninhos R\$90, morango do amor R\$120. Qualidade artesanal garantida!',
                keywords: 'preço cento brigadeiros, cardápio docinhos, beijinhos preço, ninhos valor, morango amor preço',
                type: 'product.group',
                image: '/images/cardapio-docinhos.jpg'
            },
            sobre: {
                title: 'Nossa Especialidade em Docinhos - Tradição Artesanal | Doce Encanto',
                description: '👩‍🍳 Conheça nossa história e especialidade em docinhos por cento. Receitas exclusivas, ingredientes premium e muito amor em cada brigadeiro, beijinho e ninho.',
                keywords: 'história doce encanto, especialista docinhos, receitas artesanais, tradição brigadeiros',
                type: 'article',
                image: '/images/sobre-docinhos.jpg'
            },
            contato: {
                title: 'Encomende seu Cento de Docinhos - Whatsapp | Doce Encanto Chapecó',
                description: '📞 Faça sua encomenda! Cento de brigadeiros, beijinhos, ninhos e mais. Atendimento rápido pelo WhatsApp, entrega em Chapecó e região.',
                keywords: 'encomendar docinhos chapecó, whatsapp brigadeiros, pedido cento doces',
                type: 'business.business',
                image: '/images/contato-docinhos.jpg'
            },
            galeria: {
                title: 'Galeria de Docinhos Artesanais - Veja Nossos Centos | Doce Encanto',
                description: '📸 Veja nossa galeria com centos de brigadeiros, beijinhos, ninhos e mais! Docinhos perfeitos para festas, eventos e comemorações especiais.',
                keywords: 'fotos docinhos artesanais, galeria brigadeiros, centos doces imagens',
                type: 'article',
                image: '/images/galeria-docinhos.jpg'
            }
        };

        return seoPages[page] || seoPages.home;
    }

    addDocinhosStructuredData() {
        // Adicionar dados estruturados para cada tipo de docinho
        Object.keys(this.produtos).forEach(key => {
            const produto = this.produtos[key];
            this.addProdutoSchema(produto, key);
        });
        
        // Adicionar dados da empresa especializada
        this.addEmpresaDocinhosSchema();
        
        // Adicionar menu estruturado
        this.addMenuSchema();
    }

    addProdutoSchema(produto, id) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": `Cento de ${produto.nome}`,
            "description": `100 unidades de ${produto.descricao.toLowerCase()}`,
            "image": `${this.baseDomain}/images/${id}-cento.jpg`,
            "brand": {
                "@type": "Brand",
                "name": "Doce Encanto"
            },
            "category": "Docinhos Brasileiros",
            "offers": {
                "@type": "Offer",
                "price": produto.preco.toString(),
                "priceCurrency": "BRL",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2024-12-31",
                "seller": {
                    "@type": "Organization",
                    "name": "Doce Encanto"
                }
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "75"
            },
            "additionalProperty": [
                {
                    "@type": "PropertyValue",
                    "name": "Quantidade",
                    "value": "100 unidades"
                },
                {
                    "@type": "PropertyValue",
                    "name": "Tipo",
                    "value": "Artesanal"
                }
            ]
        };
        
        this.insertStructuredData(schema, `produto-${id}`);
    }

    addEmpresaDocinhosSchema() {
        const schema = {
            "@context": "https://schema.org",
            "@type": ["FoodEstablishment", "LocalBusiness"],
            "name": "Doce Encanto",
            "alternateName": "Doce Encanto Docinhos",
            "description": "Especializada em docinhos artesanais por cento: brigadeiros, beijinhos, ninhos, morango do amor e maçã do amor",
            "url": this.baseDomain,
            "logo": this.baseDomain + "/images/logo.png",
            "image": [
                this.baseDomain + "/images/loja-fachada.jpg",
                this.baseDomain + "/images/docinhos-showcase.jpg",
                this.baseDomain + "/images/brigadeiros-artesanais.jpg"
            ],
            "telephone": "+55-49-99840-6192",
            "email": "contato@doceencanto.com",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rua das Flores, 123",
                "addressLocality": "Chapecó",
                "addressRegion": "SC",
                "postalCode": "89800-000",
                "addressCountry": "BR"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": -27.0965,
                "longitude": -52.6146
            },
            "openingHours": [
                "Mo-Fr 08:00-18:00",
                "Sa 08:00-16:00"
            ],
            "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Pix"],
            "priceRange": "R$ 80 - R$ 120",
            "servesCuisine": "Docinhos Brasileiros",
            "speciality": [
                "Brigadeiros Artesanais",
                "Beijinhos Gourmet", 
                "Ninhos Especiais",
                "Morango do Amor",
                "Maçã do Amor",
                "Docinhos por Cento"
            ],
            "knowsAbout": [
                "Docinhos artesanais",
                "Brigadeiros gourmet",
                "Festas e eventos",
                "Doces personalizados"
            ],
            "areaServed": {
                "@type": "City",
                "name": "Chapecó",
                "containedInPlace": {
                    "@type": "State",
                    "name": "Santa Catarina"
                }
            },
            "hasMenu": this.baseDomain + "/produtos/",
            "takeaway": true,
            "delivery": true,
            "sameAs": [
                "https://wa.me/5549998406192"
            ]
        };
        
        this.insertStructuredData(schema, 'empresa-docinhos');
    }

    addMenuSchema() {
        const menuItems = Object.keys(this.produtos).map(key => {
            const produto = this.produtos[key];
            return {
                "@type": "MenuItem",
                "name": `Cento de ${produto.nome}`,
                "description": produto.descricao,
                "offers": {
                    "@type": "Offer",
                    "price": produto.preco.toString(),
                    "priceCurrency": "BRL"
                }
            };
        });

        const schema = {
            "@context": "https://schema.org",
            "@type": "Menu",
            "name": "Cardápio de Docinhos por Cento",
            "description": "Nosso cardápio especializado em docinhos artesanais por cento",
            "hasMenuSection": {
                "@type": "MenuSection",
                "name": "Docinhos por Cento",
                "description": "Docinhos artesanais vendidos por cento (100 unidades)",
                "hasMenuItem": menuItems
            }
        };
        
        this.insertStructuredData(schema, 'menu-docinhos');
    }

    optimizeForLocalSEO() {
        // Adicionar termos locais específicos
        const localTerms = [
            'docinhos chapecó',
            'brigadeiros chapecó sc',
            'beijinhos artesanais chapecó',
            'festa docinhos chapecó',
            'cento doces chapecó',
            'confeitaria chapecó'
        ];
        
        this.addLocalKeywords(localTerms);
        this.addLocalContent();
    }

    addLocalKeywords(terms) {
        const currentKeywords = document.querySelector('meta[name="keywords"]')?.content || '';
        const newKeywords = currentKeywords + ', ' + terms.join(', ');
        this.updateMeta('keywords', newKeywords);
    }

    addLocalContent() {
        // Adicionar menções locais no conteúdo se ainda não existir
        const heroSection = document.querySelector('.hero, .banner');
        if (heroSection && !heroSection.querySelector('.local-seo-text')) {
            const localText = document.createElement('div');
            localText.className = 'local-seo-text sr-only';
            localText.innerHTML = `
                <p>Doce Encanto é a confeitaria especializada em docinhos por cento em Chapecó, Santa Catarina. 
                Atendemos toda a região de Chapecó com nossos brigadeiros artesanais, beijinhos gourmet e ninhos especiais.</p>
            `;
            heroSection.appendChild(localText);
        }
    }

    // Utilitários (mesmos métodos da classe anterior)
    updateMeta(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    updateMetaTags(seoData) {
        document.title = seoData.title;
        this.updateMeta('description', seoData.description);
        this.updateMeta('keywords', seoData.keywords);
        this.updateCanonical();
    }

    updateOpenGraph(seoData) {
        this.updateMetaProperty('og:title', seoData.title);
        this.updateMetaProperty('og:description', seoData.description);
        this.updateMetaProperty('og:type', seoData.type);
        this.updateMetaProperty('og:image', this.baseDomain + seoData.image);
        this.updateMetaProperty('og:url', window.location.href);
        
        this.updateMeta('twitter:title', seoData.title);
        this.updateMeta('twitter:description', seoData.description);
        this.updateMeta('twitter:image', this.baseDomain + seoData.image);
    }

    updateMetaProperty(property, content) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    updateCanonical() {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', window.location.href);
    }

    insertStructuredData(schema, id) {
        const existing = document.getElementById(`schema-${id}`);
        if (existing) existing.remove();
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = `schema-${id}`;
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }
}

// Inicializar SEO para Docinhos
document.addEventListener('DOMContentLoaded', () => {
    window.seoDocinhos = new SEODocinhos();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SEODocinhos };
}