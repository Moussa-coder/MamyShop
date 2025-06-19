// Gestion du panier
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Fonction pour sauvegarder le panier dans le localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Fonction pour afficher une notification
function showNotification(message) {
    // Supprime les notifications existantes pour éviter les doublons
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Style pour la notification
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '15px 25px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: '1001',
        transition: 'opacity 0.5s, transform 0.5s',
        opacity: '0',
        transform: 'translate(-50%, 20px)'
    });

    // Animation d'apparition
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%)';
    }, 10);

    // Animation de disparition
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, 20px)';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Fonction pour mettre à jour le compteur du panier dans la nav
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Fonction pour ajouter au panier
function addToCart(productId, name, price, image) {
    // Assurer que l'ID est une chaîne de caractères pour la cohérence
    const id = String(productId);
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Produit ajouté au panier !');
}

// Fonction pour mettre à jour la quantité d'un produit
function updateQuantity(productId, change) {
    const id = String(productId);
    const item = cart.find(item => item.id === id);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            // Si la quantité devient 0 ou moins, on supprime l'article
            cart = cart.filter(cartItem => cartItem.id !== id);
            showNotification('Produit supprimé du panier');
        }
        saveCart();
        updateCartCount();
        displayCart(); // Rafraîchir l'affichage du panier
    }
}

// Fonction pour supprimer un produit du panier
function removeFromCart(productId) {
    const id = String(productId);
    const itemExists = cart.some(item => item.id === id);
    if (itemExists) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartCount();
        displayCart(); // Rafraîchir l'affichage du panier
        showNotification('Produit supprimé du panier');
    }
}

// Fonction pour vider entièrement le panier
function clearCart() {
    if (cart.length > 0) {
        cart = [];
        saveCart();
        updateCartCount();
        displayCart();
        showNotification('Le panier a été vidé');
    }
}

// Fonction pour calculer le total du panier
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Fonction pour afficher le panier
function displayCart() {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Votre panier est vide</p>
                <a href="index.html" class="continue-shopping">Continuer mes achats</a>
            </div>`;
        return;
    }

    let html = '<div class="cart-items">';
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image-container">
                    <img src="${item.image}" alt="${item.name}" class="item-image">
                </div>
                <div class="item-info">
                    <h2 class="item-name">${item.name}</h2>
                    <p class="item-price">Prix unitaire : ${item.price.toFixed(2)} €</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-change="-1">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-change="1">+</button>
                    </div>
                    <p class="subtotal">Sous-total : ${subtotal.toFixed(2)} €</p>
                </div>
                <div class="item-remove">
                     <button class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`;
    });
    html += '</div>';

    if (cart.length > 0) {
        const total = calculateTotal();
        html += `
            <div class="cart-summary">
                <div class="total">
                    <span>Total : </span>
                    <span class="total-amount">${total.toFixed(2)} €</span>
                </div>
                <div class="cart-actions">
                    <button class="checkout-btn">Valider la commande</button>
                    <button class="clear-cart-btn">Vider le panier</button>
                </div>
            </div>`;
    }

    cartContent.innerHTML = html;
}

// Fonction pour traiter la commande
function processCheckout() {
    if (cart.length === 0) {
        showNotification('Votre panier est vide. Impossible de valider.');
        return;
    }

    // Ici, on pourrait ajouter une logique plus complexe (envoi des données à un serveur, etc.)
    // Pour l'instant, on simule une commande réussie.
    
    showNotification('Commande validée avec succès ! Merci pour votre achat.');

    // On vide le panier après la commande
    cart = [];
    saveCart();
    updateCartCount();
    displayCart();
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
    // Recharge le panier depuis localStorage au cas où une autre page l'aurait modifié
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Met à jour le compteur de panier sur toutes les pages
    updateCartCount();
    
    // Si on est sur la page panier, on affiche le contenu du panier
    const cartContent = document.getElementById('cart-content');
    if (cartContent) {
        displayCart();

        // On utilise la délégation d'événements pour gérer les clics
        cartContent.addEventListener('click', event => {
            const target = event.target;

            // Gestion du bouton de suppression
            const deleteButton = target.closest('.delete-btn');
            if (deleteButton) {
                const cartItem = target.closest('.cart-item');
                const productId = cartItem.dataset.id;
                removeFromCart(productId);
                return; // On arrête ici pour ne pas traiter d'autres clics
            }

            // Gestion des boutons de quantité
            const quantityButton = target.closest('.quantity-btn');
            if (quantityButton) {
                const cartItem = target.closest('.cart-item');
                const productId = cartItem.dataset.id;
                const change = parseInt(quantityButton.dataset.change, 10);
                updateQuantity(productId, change);
            }

            // Gestion du bouton pour vider le panier
            const clearButton = target.closest('.clear-cart-btn');
            if (clearButton) {
                clearCart();
            }

            // Gestion du bouton de validation de commande
            const checkoutButton = target.closest('.checkout-btn');
            if (checkoutButton) {
                processCheckout();
            }
        });
    }

    // Ajoute les écouteurs pour les boutons "Ajouter au panier" sur les pages produits
    // On attache l'écouteur au document pour gérer les produits chargés dynamiquement
    document.body.addEventListener('click', event => {
        const button = event.target.closest('.add-to-cart');
        if (button) {
            const productCard = button.closest('.product-card');
            if (productCard && productCard.dataset.id) {
                const productId = productCard.dataset.id;
                const name = productCard.querySelector('.product-title').textContent;
                const price = productCard.dataset.price;
                const image = productCard.querySelector('.product-image').src;
                
                addToCart(productId, name, price, image);
            }
        }
    });

    // Gestion du menu mobile (si existant)
    const menuButton = document.querySelector('.menu-button');
    const navLinks = document.querySelector('.nav-links');
    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Écouteurs pour les filtres
    const filterInputs = document.querySelectorAll('.filter-group select, .filter-group input');
    filterInputs.forEach(input => {
        input.addEventListener('change', filterProducts);
    });
});


