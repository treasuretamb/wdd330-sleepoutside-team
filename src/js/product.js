import { setLocalStorage } from './utils.mjs';
import ProductData from './ProductData.mjs';

const dataSource = new ProductData('tents');

function addProductToCart(product) {
  // Retrieve the current cart from local storage
  let cart = getLocalStorage("so-cart") || []; // Default to an empty array if cart is null

  // Check if the cart is already an array; if not, reset it
  if (!Array.isArray(cart)) {
    cart = [];
  }

  // Add the new product to the cart
  cart.push(product);

  // Save the updated cart back to local storage
  setLocalStorage("so-cart", cart);
}


// add listener to Add to Cart button
document
  .getElementById('addToCart')
  .addEventListener('click', addToCartHandler);
