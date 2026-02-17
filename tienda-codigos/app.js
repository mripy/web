// Variables y Elementos del DOM
const productsContainer = document.getElementById('products-container');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total-price');
const cartCountElement = document.querySelector('.cart-count');

// Estado del Carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});

// Helper para formatear moneda
function formatCurrency(amount) {
    return "Gs. " + amount.toLocaleString('es-PY');
}

// Renderizar Productos en la Tienda
function renderProducts() {
    productsContainer.innerHTML = "";
    products.forEach(product => {
        const productEl = document.createElement('div');
        productEl.classList.add('product-card');
        productEl.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${formatCurrency(product.price)}</div>
                <button class="add-to-cart-btn" data-id="${product.id}">Agregar al Carrito</button>
            </div>
        `;
        productsContainer.appendChild(productEl);

        // Agregar evento al botón
        const btn = productEl.querySelector('.add-to-cart-btn');
        btn.addEventListener('click', () => addToCart(product.id));
    });
}


// Toast Notification
function showToast(message) {
    // Check if toast exists, if not create it
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = "toast show";

    setTimeout(function () {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}

// Agregar al Carrito (Modificada para incluir Toast)
function addToCart(id) {
    if (cart.some(item => item.id === id)) {
        changeNumberOfUnits('plus', id);
        showToast("Cantidad actualizada en el carrito");
    } else {
        const item = products.find(product => product.id === id);
        cart.push({
            ...item,
            numberOfUnits: 1,
        });
        showToast("Producto agregado al carrito");
    }
    updateCartUI();
}

// Actualizar UI del Carrito
function updateCartUI() {
    renderCartItems();
    renderSubtotal();

    // Guardar en LocalStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Renderizar Items del Carrito
function renderCartItems() {
    cartItemsContainer.innerHTML = ""; // Limpiar carrito

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--light-text); margin-top: 2rem;">Tu carrito está vacío</p>';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">${formatCurrency(item.price)}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeNumberOfUnits('minus', ${item.id})">-</button>
                    <span>${item.numberOfUnits}</span>
                    <button class="qty-btn" onclick="changeNumberOfUnits('plus', ${item.id})">+</button>
                    <button class="remove-btn" onclick="removeItemFromCart(${item.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Actualizar contador del icono
    cartCountElement.textContent = cart.reduce((acc, item) => acc + item.numberOfUnits, 0);
}

// Calcular y Renderizar Subtotal
function renderSubtotal() {
    let totalPrice = 0;
    let totalItems = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.numberOfUnits;
        totalItems += item.numberOfUnits;
    });

    cartTotalElement.textContent = formatCurrency(totalPrice);
}

// Eliminar Item del Carrito
function removeItemFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// Cambiar número de unidades
function changeNumberOfUnits(action, id) {
    cart = cart.map(item => {
        let numberOfUnits = item.numberOfUnits;

        if (item.id === id) {
            if (action === 'minus' && numberOfUnits > 1) {
                numberOfUnits--;
            } else if (action === 'plus' && numberOfUnits < 10) { // Límite arbitrario
                numberOfUnits++;
            }
        }

        return {
            ...item,
            numberOfUnits,
        };
    });

    updateCartUI();
}

// Finalizar Compra (WhatsApp)
function checkout() {
    if (cart.length === 0) {
        showToast("El carrito está vacío");
        return;
    }

    const phoneNumber = "595981454256";
    let message = "Hola, me gustaría realizar el siguiente pedido:\n\n";

    cart.forEach(item => {
        message += `- ${item.name} (x${item.numberOfUnits}): ${formatCurrency(item.price * item.numberOfUnits)}\n`;
    });

    const total = cart.reduce((acc, item) => acc + (item.price * item.numberOfUnits), 0);
    message += `\nTotal: ${formatCurrency(total)}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Event Listeners para Abrir/Cerrar Carrito
cartBtn.addEventListener('click', () => {
    cartModal.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

// Cerrar al hacer click fuera del modal (overlay)
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

// Event Listener para el botón de checkout
document.querySelector('.checkout-btn').addEventListener('click', checkout);

// Exponer funciones globales para el HTML (onclick)
window.changeNumberOfUnits = changeNumberOfUnits;
window.removeItemFromCart = removeItemFromCart;
