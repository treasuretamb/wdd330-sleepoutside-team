import { getLocalStorage, setLocalStorage } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart');
  const productListEl = document.querySelector('.product-list');

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    productListEl.innerHTML = '<p>Your cart is empty.</p>';
    document.querySelector('.cart-footer').classList.add('hide');
    updateCartCount(0);
    return;
  }

  const htmlItems = cartItems.map(item => cartItemTemplate(item)).join('');
  productListEl.innerHTML = htmlItems;

  // show and update the cart footer
  const footer = document.querySelector('.cart-footer');
  footer.classList.remove('hide');

  // calculate the total
  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.FinalPrice), 0).toFixed(2);
  footer.querySelector('.cart-total').innerHTML = `Total: $${total}`;

  // attach remove listeners for each 'Reomve' button
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', removeFromCartHandler);
  });

  updateCartCount(cartItems.length);
}

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <span class="remove-item" data-id="${item.Id}" style="cursor:pointer;">X</span>
    </li>`;
}

function removeFromCartHandler(e) {
  const idToRemove = e.target.getAttribute('data-id');
  let cartItems = getLocalStorage('so-cart') || [];
  cartItems = cartItems.filter(item => item.Id !== idToRemove);
  setLocalStorage('so-cart', cartItems);
  renderCartContents();
}

function updateCartCount(count) {
  const cartCountEl = document.querySelector('.cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
}

// update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
  const cartItems = getLocalStorage('so-cart');
  updateCartCount(cartItems ? cartItems.length : 0);
});

renderCartContents();
