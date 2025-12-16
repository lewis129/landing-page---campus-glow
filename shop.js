const list = document.querySelector('.product-list');

products.forEach(product => {
    const message = `Hello I want to order ${product.name} for KSh ${product.price}. Pickup Thika`;
    const whatsappLink = `https://wa.me/254799451882?text=${encodeURIComponent(message)}`;

    list.innerHTML += `
        <div class="product-list">
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>ksh ${product.price}</p>
                <button href="https://wa.me/254799451882?text=I%20want%20to%20order%20${encodeURIComponent(product.name)}%20KSh%20${product.price}">
                    Order on WhatsApp
                </button>
            </div>
        </div>
        `;
})