let allProducts = []; //store all products 
let currentCategory = "all"; //default category
let searchTerm = ""; //default search term 


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
            const rows = csv.split("\n").slice(1); // Skip header 
            allProducts = rows.map(row => {
                const colomns = row.split(",");
                return{
                    name: colomns[0]?.trim(),
                    type : colomns[1]?.trim(),
                    image : colomns[2]?.trim().replace(/^"|$/g, ""),
                    price : colomns[3]?.trim(),
                    active : colomns[4]?.trim(), 
                }
            }).filter(p => p.active === "yes"); // Only include active products
            renderProducts(allProducts);
        })
        .catch(err => {
            console.error("Error fetching the sheet:", err);
            alert("Failed to load products. Please try again later.");
        });
});

//whatsapp order function
function orderOnWhatsapp(name, price, index) {
    const qty = document.getElementById(`qty-${index}`).innerText;
    const total = price * parseInt(qty);

    const message = `Hello campus glow I want to order product: ${name} quantity :${qty} total: ${total}.`;
    const whatsappLink = "https://wa.me/254799451882?text=" + encodeURIComponent(message);
    window.open(whatsappLink, '_blank');
}

// search input eveent listener
document.getElementById("search-input").addEventListener("input", (e) => {
    searchTerm = e.target.value.toLowerCase();
    applyfilter();
});


//applyfilter (search and category)
function applyfilter(){
    let filtered = allProducts;

    // Filter by category
    if (currentCategory !== "all"){
        filtered = filtered.filter(
            p => p.type === currentCategory
        );
    }

    //filter by search term
    if (searchTerm !== ""){
        filtered = filtered.filter(
            product => 
                product.type.toLowerCase().includes(searchTerm) ||
                product.name.toLowerCase().includes(searchTerm)
        )
    }

    renderProducts(filtered); // re-render the filtered products
}

document.querySelectorAll("[data-category]").forEach(span =>{
    span.addEventListener("click", () =>{
        currentCategory = span.dataset.category; //set the current category
        applyfilter()
    

        //optianall ui active state
        document.querySelectorAll("[data-category]").forEach(s => s.classList.remove("active"));
        span.classList.add("active");
    })
})

function changeQty(index, change){
    const qtyE1 = document.getElementById(`qty-${index}`);
    //checcks if element exists
    if (!qtyE1){
        console.error(`Element with id "qty-${index}" not found.`);
        return; //exit the function if element not found
    }
    // parse the current quantity and validate it
    let qty = parseInt(qtyE1.innerText);
    if(isNaN(qty)){
        console.log(`"Invalid quantity, in element "qty-${index}".`);
        qty = 1; //default to 1 if invalid
    }
    //update quantity
    qty += change;

    //ensure quantity does not go below 1
    if (qty < 1) qty = 1;
    //update the elements inner text with new quantity
    qtyE1.innerText = qty;
}
//lightbox functionality
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-img");
const lightboxName = document.getElementById("lightbox-name");
const lightboxClose = document.getElementById("lightbox-close"); 

function openLightbox(imageSrc,){
    lightboxImage.src = imageSrc;
    lightbox.classList.remove("hidden")
}
function closeLightbox(){
    lightboxImage.src ="";
    lightbox.classList.add("hidden");
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
    if(e.target === lightbox){
        closeLightbox();
    }
});


//render products function
function renderProducts(products){
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";//clear existing products

    if (products.length === 0){
        productList.innerHTML = "<p>No products found.</p>";
        return;
    }

    products.forEach((product,index ) => {
        productList.innerHTML += `
        <div class="product-card">
            <div class="image-container">
                <img src="${product.image || "campusglowlogo.jpg"}" alt="${product.name}" class="product-image" onclick="openLightbox('${product.image}')"/>
                <p class="product-cost price-overlay">KSh ${product.price}</p>
                <p class="product-type product-type-overlay">${product.type}</p>
            </div>
            <div class="product-details">
                <h3 class="product-name" onclick="openLightbox('${product.name}')">${product.name}</h3>
                    <button class="q-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span id="qty-${index}">1</span>
                    <button class="q-btn" onclick="changeQty(${index}, 1)">+</button>
                    <div class="product-actions">
                    <button class="add-to-cart" onclick="orderOnWhatsapp('${product.name}', ${product.price}, ${index})">
                        Order Now
                    </button>
                </div>
            </div>
        </div>
        `;
    });
}

