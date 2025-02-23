document.addEventListener("DOMContentLoaded", function () {
    carregarProdutos();
});

const produtos = [
    { id: 1, nome: "Tênis Nike", preco: 200, estoque: 10, imagem: "imagens/3.jpeg", categoria: "tenis" },
    { id: 2, nome: "Camiseta Adidas", preco: 80, estoque: 15, imagem: "imagens/2.jpeg", categoria: "camiseta" },
    { id: 3, nome: "Boné Puma", preco: 50, estoque: 20, imagem: "imagens/3.jpeg", categoria: "bone" },
    { id: 4, nome: "Tênis Adidas", preco: 250, estoque: 5, imagem: "imagens/2.jpeg", categoria: "tenis" },
    { id: 5, nome: "Camiseta Nike", preco: 90, estoque: 8, imagem: "imagens/1.jpeg", categoria: "camiseta" }
];

const carrinho = [];

function carregarProdutos(produtosFiltrados = produtos) {
    const container = document.getElementById("produtos");
    container.innerHTML = ""; // Limpa os produtos antes de recarregar

    produtosFiltrados.forEach(produto => {
        const item = document.createElement("div");
        item.classList.add("produto");

        let tamanhoHTML = '';
        if (produto.categoria === "camiseta") { 
            tamanhoHTML = `
                <label for="tamanho-${produto.id}">Tamanho:</label>
                <select id="tamanho-${produto.id}">
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                </select>
            `;
        } else if (produto.categoria === "tenis") { 
            tamanhoHTML = `
                <label for="tamanho-${produto.id}">Tamanho:</label>
                <select id="tamanho-${produto.id}">
                    <option value="38">38</option>
                    <option value="39">39</option>
                    <option value="40">40</option>
                    <option value="41">41</option>
                </select>
            `;
        }

        item.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem">
            <h3>${produto.nome}</h3>
            <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
            <p>Estoque: <span id="estoque-${produto.id}">${produto.estoque}</span></p>
            ${tamanhoHTML}
            <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
        `;
        container.appendChild(item);
    });
}






function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    const tamanhoSelecionado = document.getElementById(`tamanho-${id}`);
    
    // Verifica se o tamanho foi selecionado
    if (!tamanhoSelecionado || !tamanhoSelecionado.value) {
        alert("Por favor, selecione o tamanho do produto.");
        return;
    }

    if (produto.estoque > 0) {
        // Adiciona o produto com o tamanho selecionado ao carrinho
        carrinho.push({ produto, tamanho: tamanhoSelecionado.value });
        produto.estoque--;
        document.getElementById(`estoque-${id}`).innerText = produto.estoque;
        atualizarCarrinho();  // Atualiza o carrinho visualmente
    } else {
        alert("Estoque esgotado!");
    }
}


function atualizarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    const totalElement = document.getElementById("total");
    const cartCount = document.getElementById("cart-count");
    lista.innerHTML = "";  // Limpa a lista atual

    let total = 0;
    
    carrinho.forEach((item, index) => {
        total += item.produto.preco;  // Soma o preço do produto

        // Cria o item de carrinho com nome do produto, tamanho e botão para remover
        const itemElement = document.createElement("li");
        itemElement.innerHTML = `
            ${item.produto.nome} (${item.tamanho}) - R$ ${item.produto.preco.toFixed(2)}
            <button onclick="removerDoCarrinho(${index})">Remover</button>
        `;
        lista.appendChild(itemElement);
    });

    // Atualiza o total e o contador de itens no carrinho
    totalElement.innerText = total.toFixed(2);
    cartCount.innerText = carrinho.length;
}


function removerDoCarrinho(index) {
    const item = carrinho[index];
    item.produto.estoque++;  // Devolve o estoque
    document.getElementById(`estoque-${item.produto.id}`).innerText = item.produto.estoque;

    carrinho.splice(index, 1);  // Remove o item do carrinho
    atualizarCarrinho();  // Atualiza o carrinho visualmente
}

function abrirCarrinho() {
    document.querySelector(".overlay").classList.add("mostrar");
    document.querySelector(".carrinho").classList.add("mostrar");
}

function fecharCarrinho() {
    document.querySelector(".overlay").classList.remove("mostrar");
    document.querySelector(".carrinho").classList.remove("mostrar");
}


function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    
    let mensagem = "Está disponível ainda esses produtos:\n";
    let total = 0;

    carrinho.forEach(item => {
        mensagem += `- ${item.produto.nome} (${item.tamanho}) - R$ ${item.produto.preco.toFixed(2)}\n`;
        total += item.produto.preco;
    });

    mensagem += `\nTotal: R$ ${total.toFixed(2)}`;
    const telefone = "47996444458";
    const url = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;
    
    window.location.href = url;
}


function filtrarProdutos() {
    const categoriaSelecionada = document.getElementById("categoria").value;
    const ordemPreco = document.getElementById("preco").value;

    let produtosFiltrados = produtos;

    // Filtrar por categoria
    if (categoriaSelecionada !== "todos") {
        produtosFiltrados = produtosFiltrados.filter(produto => produto.categoria === categoriaSelecionada);
    }

    // Ordenar por preço
    if (ordemPreco === "mais-barato") {
        produtosFiltrados.sort((a, b) => a.preco - b.preco);
    } else if (ordemPreco === "mais-caro") {
        produtosFiltrados.sort((a, b) => b.preco - a.preco);
    }

    carregarProdutos(produtosFiltrados); // Atualiza a exibição com os produtos filtrados
}
