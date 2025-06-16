// Gestion du panier
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Fonction pour ajouter au panier
function addToCart(productId, name, price, image) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Produit ajouté au panier');
}

// Fonction pour sauvegarder le panier
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Fonction pour mettre à jour le compteur du panier
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Fonction pour afficher une notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Gestion des filtres
function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const priceRange = document.getElementById('price-filter').value;
    const sortBy = document.getElementById('sort-filter').value;
    
    let products = Array.from(document.querySelectorAll('.product-card'));
    
    // Filtrage par catégorie
    if (category !== 'all') {
        products = products.filter(product => 
            product.dataset.category === category
        );
    }
    
    // Filtrage par prix
    if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        products = products.filter(product => {
            const price = parseFloat(product.dataset.price);
            return price >= min && price <= max;
        });
    }
    
    // Tri des produits
    products.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        
        if (sortBy === 'price-asc') {
            return priceA - priceB;
        } else if (sortBy === 'price-desc') {
            return priceB - priceA;
        }
        return 0;
    });
    
    // Mise à jour de l'affichage
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '';
    products.forEach(product => productsGrid.appendChild(product));
}

// Initialisation des écouteurs d'événements
document.addEventListener('DOMContentLoaded', () => {
    // Écouteurs pour les filtres
    const filterInputs = document.querySelectorAll('.filter-group select, .filter-group input');
    filterInputs.forEach(input => {
        input.addEventListener('change', filterProducts);
    });
    
    // Écouteurs pour les boutons d'ajout au panier
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productId = productCard.dataset.id;
            const name = productCard.querySelector('.product-title').textContent;
            const price = parseFloat(productCard.dataset.price);
            const image = productCard.querySelector('.product-image').src;
            
            addToCart(productId, name, price, image);
        });
    });
});

// Gestion du menu mobile
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}


