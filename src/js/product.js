import ExternalServices from '../js/ExternalServices.mjs';
import {
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
  loadHeaderFooter,
} from '../js/utils.mjs';

loadHeaderFooter();

function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, duration);
}

const dataSource = new ExternalServices('tents');
const productId = getProductIdFromUrl();
console.log('Product ID from URL:', productId);

if (productId) {
  dataSource
    .findProductById(productId, 'tents')
    .then((product) => {
      if (!product) {
        document.querySelector('.product-detail').innerHTML =
          '<p>Product not found.</p>';
        return;
      }
      renderProductDetails(product);
    })
    .catch((err) => {
      console.error('Error fetching product:', err);
      document.querySelector('.product-detail').innerHTML =
        '<p>Error loading product details.</p>';
    });
} else {
  document.querySelector('.product-detail').innerHTML =
    '<p>Invalid product ID.</p>';
}

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('product');
}

function renderProductDetails(product) {
  const container = document.querySelector('.product-detail');
  // Compute discount where applicable
  let discountHtml = '';
  if (product.FinalPrice < product.SuggestedRetailPrice) {
    const discountAmount = (
      product.SuggestedRetailPrice - product.FinalPrice
    ).toFixed(2);
    discountHtml = `<p class='discount-indicator'>Discount: $${discountAmount}</p>`;
  }

  container.innerHTML = `
    <h2>${product.Name}</h2>
    <img src="${product.Image}" alt="Image of ${product.Name}" />
    <div>${product.DescriptionHtmlSimple || ''}</div>
    <p>Price: $${product.FinalPrice}</p>
    ${discountHtml}
    <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
  `;

  document
    .querySelector('#addToCart')
    .addEventListener('click', () => addToCart(product));
}

function addToCart(product) {
  let cart = getLocalStorage('so-cart') || [];
  let existingItem = cart.find(
    (item) => String(item.Id) === String(product.Id),
  );
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  setLocalStorage('so-cart', cart);
  updateCartCount();
  showToast('Product added to cart!');
}
