// ==========================================================
// CONFIGURAÇÃO DO FIREBASE (MESMA DO ADMIN)
// ==========================================================
const firebaseConfig = {
    apiKey: "SUA_API_KEY", // <--- SUBSTITUA PELOS SEUS DADOS
    authDomain: "SEU_AUTH_DOMAIN",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializa o Firebase
// Verifique se o Firebase já foi inicializado antes de tentar inicializar novamente.
// Isso é importante se você já tem inicialização no main.js
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Referência para o serviço de Firestore
const db = firebase.firestore();

// Função para exibir os produtos no cardápio
async function displayProducts() {
    const listaProdutosDiv = document.getElementById('lista-produtos');
    if (!listaProdutosDiv) return; // Sai se o elemento não existir

    listaProdutosDiv.innerHTML = ''; // Limpa o conteúdo anterior

    try {
        // Busca todos os produtos. Você pode adicionar .orderBy() se quiser ordenar por nome, data, etc.
        const snapshot = await db.collection('products').get();

        if (snapshot.empty) {
            listaProdutosDiv.innerHTML = '<p>Nosso cardápio está vazio no momento. Volte em breve!</p>';
            return;
        }

        snapshot.forEach(doc => {
            const product = doc.data();

            // Formata a categoria para ser usada no atributo data-categoria (ex: "bolos,tortas")
            const categories = product.category?.join(',') || 'todos';

            // Cria o HTML para o item do produto, usando a estrutura existente
            const productHtml = `
                <div class="produto-item" data-categoria="${categories.toLowerCase()}">
                    <img src="${product.imageUrl || '../img/placeholder.png'}" alt="${product.name || 'Sem nome'}">
                    <h3>${product.name || 'Produto sem nome'}</h3>
                    <p>${product.description || 'Descrição não disponível.'}</p>
                    <p class="preco">A partir de R$ ${product.price?.toFixed(2) || 'N/A'}</p>
                    <a href="../contato.html#contato" class="btn btn-secondary" aria-label="Pedir ${product.name || 'este produto'}">Pedir Agora</a>
                </div>
            `;
            listaProdutosDiv.innerHTML += productHtml;
        });

        // Após carregar os produtos, você pode precisar re-inicializar
        // a lógica de filtros do seu catálogo, se ela depender de elementos específicos
        // que agora são criados dinamicamente.
        // Exemplo: if (typeof initializeProductFilters === 'function') { initializeProductFilters(); }

    } catch (error) {
        console.error("Erro ao carregar produtos para exibição: ", error);
        listaProdutosDiv.innerHTML = '<p>Ocorreu um erro ao carregar nossos produtos. Por favor, tente mais tarde.</p>';
    }
}

// Chama a função para exibir os produtos quando a página carregar
document.addEventListener('DOMContentLoaded', displayProducts);