// ==========================================================
// CONFIGURAÇÃO DO FIREBASE - SUBSTITUA PELOS SEUS DADOS!
// ==========================================================
const firebaseConfig = {
    apiKey: "SUA_API_KEY", // <--- SUBSTITUA PELA SUA API KEY
    authDomain: "SEU_AUTH_DOMAIN", // <--- SUBSTITUA PELO SEU AUTH DOMAIN
    projectId: "SEU_PROJECT_ID", // <--- SUBSTITUA PELO SEU PROJECT ID
    storageBucket: "SEU_STORAGE_BUCKET", // <--- SUBSTITUA PELO SEU STORAGE BUCKET
    messagingSenderId: "SEU_MESSAGING_SENDER_ID", // <--- SUBSTITUA PELO SEU MESSAGING SENDER ID
    appId: "SEU_APP_ID" // <--- SUBSTITUA PELO SEU APP ID
};

// Inicializa o Firebase com a configuração
firebase.initializeApp(firebaseConfig);

// Referências aos serviços do Firebase
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Elementos do DOM
const loginSection = document.getElementById('login-section');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('login-error');
const adminDashboard = document.getElementById('admin-dashboard');
const logoutBtn = document.getElementById('logout-btn');
const productForm = document.getElementById('productForm');
const formMessage = document.getElementById('form-message');
const productListDiv = document.getElementById('productList');
const productImageInput = document.getElementById('productImage');
const currentProductImagePreview = document.getElementById('currentProductImagePreview');

let currentProductId = null; // Guarda o ID do produto que está sendo editado

// ==========================================================
// LÓGICA DE AUTENTICAÇÃO
// ==========================================================

// Função para gerenciar a exibição das seções (login ou dashboard)
function toggleAuthSections(user) {
    if (user) {
        // Usuário está logado
        loginSection.style.display = 'none';
        adminDashboard.style.display = 'block';
        loadProducts(); // Carrega os produtos quando o usuário está logado
    } else {
        // Usuário não está logado
        loginSection.style.display = 'block';
        adminDashboard.style.display = 'none';
        loginError.textContent = ''; // Limpa mensagens de erro ao voltar para o login
        productForm.reset(); // Limpa o formulário de produto
        currentProductId = null; // Reseta o ID de edição
        currentProductImagePreview.style.display = 'none'; // Esconde o preview da imagem
    }
}

// Monitora mudanças no estado de autenticação do usuário
auth.onAuthStateChanged((user) => {
    toggleAuthSections(user);
});

// Listener para o formulário de login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    loginError.textContent = ''; // Limpa erros anteriores

    try {
        await auth.signInWithEmailAndPassword(email, password);
        // A função toggleAuthSections será chamada automaticamente pelo onAuthStateChanged
    } catch (error) {
        loginError.textContent = error.message;
    }
});

// Listener para o botão de logout
logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        // A função toggleAuthSections será chamada automaticamente pelo onAuthStateChanged
    } catch (error) {
        console.error("Erro ao fazer logout: ", error);
        alert("Ocorreu um erro ao sair. Tente novamente.");
    }
});

// ==========================================================
// LÓGICA DE GERENCIAMENTO DE PRODUTOS
// ==========================================================

// Função para carregar os produtos existentes do Firestore
async function loadProducts() {
    productListDiv.innerHTML = ''; // Limpa a lista atual

    try {
        // Busca todos os produtos, ordenados por data de criação
        const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();

        if (snapshot.empty) {
            productListDiv.innerHTML = '<p>Nenhum produto cadastrado ainda.</p>';
            return;
        }

        snapshot.forEach(doc => {
            const product = doc.data();
            const productId = doc.id;

            // Cria o HTML para cada item de produto na lista do admin
            const productHtml = `
                <div class="product-admin-item" data-id="${productId}">
                    <img src="${product.imageUrl || '../img/placeholder.png'}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px; border-radius: 4px;">
                    <span><strong>${product.name}</strong></span>
                    <span>R$ ${product.price?.toFixed(2) || 'N/A'}</span>
                    <div class="admin-actions">
                        <button class="btn btn-secondary btn-sm" onclick="editProduct('${productId}', ${JSON.stringify(product).replace(/'/g, "\\'")})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${productId}', '${product.imageUrl || ''}')">Excluir</button>
                    </div>
                </div>
            `;
            productListDiv.innerHTML += productHtml;
        });
    } catch (error) {
        console.error("Erro ao carregar produtos: ", error);
        productListDiv.innerHTML = '<p>Erro ao carregar produtos. Tente novamente.</p>';
    }
}

// Função para popular o formulário com dados de um produto existente (chamada pelo botão Editar)
window.editProduct = async (productId, productDataString) => {
    currentProductId = productId; // Guarda o ID do produto que está sendo editado
    const productData = JSON.parse(productDataString);

    // Preenche o formulário
    document.getElementById('productName').value = productData.name || '';
    document.getElementById('productDescription').value = productData.description || '';
    document.getElementById('productPrice').value = productData.price !== undefined ? productData.price.toFixed(2) : '';
    document.getElementById('productCategory').value = productData.category || '';

    // Mostra preview da imagem existente
    currentProductImagePreview.src = productData.imageUrl || '';
    currentProductImagePreview.style.display = productData.imageUrl ? 'block' : 'none';

    // Limpa o input de file para evitar que a imagem antiga seja considerada para upload novamente
    productImageInput.value = '';

    // Atualiza o título do formulário e o texto do botão
    document.querySelector('#productForm h3').textContent = 'Editar Produto';
    document.querySelector('#productForm button[type="submit"]').textContent = 'Atualizar Produto';

    // Rola para o topo do formulário
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
};

// Função para excluir um produto (chamada pelo botão Excluir)
window.deleteProduct = async (productId, imageUrl) => {
    if (!confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
        return;
    }

    try {
        // 1. Excluir do Firestore
        await db.collection('products').doc(productId).delete();

        // 2. Excluir a imagem do Cloud Storage, se houver uma URL
        if (imageUrl) {
            const storageRef = storage.refFromURL(imageUrl);
            await storageRef.delete();
        }

        formMessage.textContent = 'Produto excluído com sucesso!';
        formMessage.style.color = 'green';
        loadProducts(); // Atualiza a lista de produtos

    } catch (error) {
        console.error("Erro ao excluir produto: ", error);
        formMessage.textContent = `Erro ao excluir produto: ${error.message}`;
        formMessage.style.color = 'red';
    }
};

// Listener para o formulário de produto (Adicionar/Editar)
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMessage.textContent = ''; // Limpa mensagens anteriores

    // Coleta os dados do formulário
    const productName = document.getElementById('productName').value.trim();
    const productDescription = document.getElementById('productDescription').value.trim();
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productCategory = document.getElementById('productCategory').value.trim();
    const file = productImageInput.files[0];

    // Verifica se o preço é um número válido
    if (isNaN(productPrice)) {
        formMessage.textContent = 'Por favor, insira um preço válido.';
        formMessage.style.color = 'red';
        return;
    }

    // Monta o objeto com os dados do produto
    const productData = {
        name: productName,
        description: productDescription,
        price: productPrice,
        // Converte categorias para um array de strings e remove espaços extras
        category: productCategory.split(',').map(cat => cat.trim()).filter(Boolean),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp() // Timestamp de atualização
    };

    // Adiciona createdAt apenas se for um novo produto
    if (!currentProductId) {
        productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    }

    try {
        let imageUrl = currentProductImagePreview.src; // Começa com a imagem antiga, se houver

        // Se um novo arquivo de imagem foi selecionado
        if (file) {
            // Cria uma referência para o arquivo no Cloud Storage
            // Usa timestamp para nomear o arquivo e evitar colisões
            const fileName = `${Date.now()}_${file.name}`;
            const storageRef = storage.ref(`product-images/${fileName}`);

            // Inicia o upload do arquivo
            const uploadTask = storageRef.put(file);

            // Monitora o progresso do upload (opcional, mas bom para feedback)
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    formMessage.textContent = `Upload da imagem: ${progress.toFixed(0)}%`;
                    formMessage.style.color = 'blue';
                },
                (error) => {
                    // Tratamento de erro no upload
                    console.error("Erro no upload: ", error);
                    formMessage.textContent = `Erro no upload da imagem: ${error.message}`;
                    formMessage.style.color = 'red';
                    return; // Interrompe o processo se houver erro no upload
                },
                async () => {
                    // Callback executado quando o upload é concluído com sucesso
                    imageUrl = await storageRef.getDownloadURL(); // Obtém a URL pública da imagem
                    productData.imageUrl = imageUrl; // Atualiza o objeto de dados com a nova URL

                    // Salva ou atualiza o produto no Firestore
                    if (currentProductId) {
                        await db.collection('products').doc(currentProductId).update(productData);
                        formMessage.textContent = 'Produto atualizado com sucesso!';
                        formMessage.style.color = 'green';
                    } else {
                        await db.collection('products').add(productData);
                        formMessage.textContent = 'Produto adicionado com sucesso!';
                        formMessage.style.color = 'green';
                    }

                    // Limpa o formulário e recarrega a lista
                    productForm.reset();
                    currentProductId = null;
                    currentProductImagePreview.style.display = 'none';
                    document.querySelector('#productForm h3').textContent = 'Adicionar Novo Produto';
                    document.querySelector('#productForm button[type="submit"]').textContent = 'Salvar Produto';
                    loadProducts();
                }
            );
            // Se houver upload, a lógica de salvamento continua dentro do callback de sucesso acima.
            // Retornamos aqui para evitar a lógica de salvamento sem imagem.
            return;

        } else {
            // Se não houve upload de nova imagem, usa a URL existente ou nenhuma imagem
            productData.imageUrl = imageUrl; // Mantém a URL antiga se houver

            // Salva ou atualiza o produto no Firestore
            if (currentProductId) {
                await db.collection('products').doc(currentProductId).update(productData);
                formMessage.textContent = 'Produto atualizado com sucesso!';
                formMessage.style.color = 'green';
            } else {
                await db.collection('products').add(productData);
                formMessage.textContent = 'Produto adicionado com sucesso!';
                formMessage.style.color = 'green';
            }

            // Limpa o formulário e recarrega a lista
            productForm.reset();
            currentProductId = null;
            currentProductImagePreview.style.display = 'none';
            document.querySelector('#productForm h3').textContent = 'Adicionar Novo Produto';
            document.querySelector('#productForm button[type="submit"]').textContent = 'Salvar Produto';
            loadProducts();
        }

    } catch (error) {
        console.error("Erro ao salvar produto: ", error);
        formMessage.textContent = `Erro ao salvar produto: ${error.message}`;
        formMessage.style.color = 'red';
    }
});

// Listener para o input de arquivo para mostrar um preview da imagem
productImageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentProductImagePreview.src = e.target.result;
            currentProductImagePreview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        currentProductImagePreview.style.display = 'none';
        currentProductImagePreview.src = '';
    }
});