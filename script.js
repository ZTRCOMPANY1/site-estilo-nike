document.addEventListener("DOMContentLoaded", function () {
    carregarProdutos();
});

const produtos = [
    { id: 1, nome: "Tênis Nike", preco: 1, estoque: 10, imagem: "imagens/3.jpeg" },
    { id: 2, nome: "Camiseta Adidas", preco: 1, estoque: 15, imagem: "imagens/2.jpeg" },
    { id: 3, nome: "Boné Puma", preco: 10, estoque: 20, imagem: "imagens/3.jpeg" }
];

const carrinho = [];

function carregarProdutos() {
    const container = document.getElementById("produtos");
    produtos.forEach(produto => {
        const item = document.createElement("div");
        item.classList.add("produto");
        
        let tamanhoHTML = '';
        if (produto.id === 2) {  // Camisetas
            tamanhoHTML = `
                <label for="tamanho-${produto.id}">Tamanho:</label>
                <select id="tamanho-${produto.id}">
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                </select>
            `;
        } else if (produto.id === 1) {  // Tênis
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
         else if (produto.id === 3) {  // Bone
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
    document.getElementById("carrinho").classList.remove("hidden");
}

function fecharCarrinho() {
    document.getElementById("carrinho").classList.add("hidden");
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
