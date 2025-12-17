document.addEventListener("DOMContentLoaded", () => {
    console.log("shop.js loaded");
  
    const productList = document.getElementById("product-list"); // Ensure this matches your HTML

    if (!productList) {
        alert("product-list div not found");
    }

    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQyUPTpUR0znjL-yNHlRvOcQuGeWcm5TUiCgOVQ912rPoJ_tJKFdT0dSKG81eG3SSrUmlb5w-imqWqW/pub?output=csv"; // Use the correct CSV link

    fetch(sheetURL)
        .then(res => res.text())
        .then(csv => {
            const rows = csv.split("\n").slice(1); // Skip header row

            rows.forEach(row => {
                const colomns = row.split(",")
                const name = colomns[0]?.trim();
                const type = colomns[1]?.trim();
                const image = colomns[2]?.trim().replace(/^"|$/g, "");
                const price = colomns[3]?.trim();
                const active = colomns[4]?.trim();

                if (active?.trim() !== "yes") return; // Skip inactive products

                productList.innerHTML += `
                <div class="product-card">
                    <img src="${image || "https://via.placeholder.com/150"}" alt="${name}" class="product-image"/>
                    <div class="product-details">
                        <p class="product-type">${type}</p>
                        <h3 class="product-name">${name}</h3>
                        <p class="product-cost">KSh ${price}</p>
                        <button class="add-to-cart" onclick="orderOnWhatsapp('${name}', ${price})">
                            Order on WhatsApp
                        </button>
                    </div>
                </div>
                `;
            });
        })
        .catch(err => {
            console.error("Error fetching the sheet:", err);
            alert("Failed to load products. Please try again later.");
        });
});

function orderOnWhatsapp(name, price) {
    const message = `Hello I want to order product: ${name} for KSh ${price}. Pickup Thika`;
    const whatsappLink = "https://wa.me/254799451882?text=" + encodeURIComponent(message);
    window.open(whatsappLink, '_blank');
}