  // Données des produits (à remplacer par une API)
        const products = [
            {
                id: 1,
                name: "T-shirt Premium",
                category: "vetements",
                price: 29.99,
                image: "../images/products/tshirt.jpg",
                description: "T-shirt premium en coton bio",
                colors: ["black", "white", "blue"],
                sizes: ["S", "M", "L", "XL"],
                badge: "Nouveau"
            },
            // Ajoutez plus de produits ici
        ];

        // État de l'application
        let currentPage = 1;
        const productsPerPage = 12;
        let filteredProducts = [...products];

        // Fonctions utilitaires
        function updateProductsDisplay() {
            const start = (currentPage - 1) * productsPerPage;
            const end = start + productsPerPage;
            const paginatedProducts = filteredProducts.slice(start, end);

            const productsGrid = document.getElementById('products-grid');
            productsGrid.innerHTML = paginatedProducts.map(product => `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-category">${product.category}</p>
                        <p class="product-price">${product.price.toFixed(2)} €</p>
                        <div class="product-actions">
                            <button class="add-to-cart" onclick="addToCart(${product.id})">
                                Ajouter au panier
                            </button>
                            <button class="wishlist-btn">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            updatePagination();
        }

        function updatePagination() {
            const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
            const pagination = document.getElementById('pagination');
            
            let paginationHtml = '';
            if (currentPage > 1) {
                paginationHtml += `<button onclick="changePage(${currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </button>`;
            }
            
            for (let i = 1; i <= totalPages; i++) {
                paginationHtml += `
                    <button class="${i === currentPage ? 'active' : ''}" 
                            onclick="changePage(${i})">${i}</button>
                `;
            }
            
            if (currentPage < totalPages) {
                paginationHtml += `<button onclick="changePage(${currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </button>`;
            }
            
            pagination.innerHTML = paginationHtml;
        }

        function changePage(page) {
            currentPage = page;
            updateProductsDisplay();
            window.scrollTo(0, 0);
        }

        // Gestion des filtres
        function applyFilters() {
            const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
                .map(input => input.value);
            
            const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked'))
                .map(input => input.value.toUpperCase());
            
            const priceMin = parseFloat(document.querySelector('.price-range input:first-child').value) || 0;
            const priceMax = parseFloat(document.querySelector('.price-range input:last-child').value) || Infinity;

            filteredProducts = products.filter(product => {
                const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
                const sizeMatch = selectedSizes.length === 0 || product.sizes.some(size => selectedSizes.includes(size));
                const priceMatch = product.price >= priceMin && product.price <= priceMax;

                return categoryMatch && sizeMatch && priceMatch;
            });

            currentPage = 1;
            updateProductsDisplay();
        }

        // Gestion du tri
        document.getElementById('sort-select').addEventListener('change', (e) => {
            const sortValue = e.target.value;
            
            switch(sortValue) {
                case 'price-asc':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'newest':
                    filteredProducts.sort((a, b) => b.id - a.id);
                    break;
                default: // 'popular'
                    filteredProducts = [...products];
            }
            
            currentPage = 1;
            updateProductsDisplay();
        });

        // Gestion des filtres mobiles
        const filterToggle = document.getElementById('filter-toggle');
        const filters = document.getElementById('filters');

        filterToggle.addEventListener('click', () => {
            filters.classList.toggle('active');
        });

        // Event listeners pour les filtres
        document.querySelectorAll('input[type="checkbox"], .price-range input').forEach(input => {
            input.addEventListener('change', applyFilters);
        });

        document.querySelectorAll('.color-option').forEach(color => {
            color.addEventListener('click', () => {
                color.classList.toggle('selected');
                applyFilters();
            });
        });

        // Initialisation
        document.addEventListener('DOMContentLoaded', () => {
            updateProductsDisplay();
            updateCartCount();
        });