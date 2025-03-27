import { getLocalStorage } from './utils.mjs';

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key; 
    this.outputSelector = outputSelector; 
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    // Retrieve cart items from localStorage and calculate the subtotal
    this.list = getLocalStorage(this.key);
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    // Calculate subtotal from cart items
    this.itemTotal = this.list.reduce((acc, item) => {
      const quantity = item.quantity || 1;
      return acc + item.FinalPrice * quantity;
    }, 0);
    const subtotalEl = document.querySelector(`${this.outputSelector} #subtotal`);
    if (subtotalEl) {
      subtotalEl.innerText = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    // Calculate tax 
    this.tax = this.itemTotal * 0.06;
    // Calculate shipping: $10 for the first item plus $2 for each additional item
    const totalItems = this.list.reduce((acc, item) => acc + (item.quantity || 1), 0);
    this.shipping = totalItems > 0 ? 10 + (totalItems - 1) * 2 : 0;
    // Calculate final order total
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxEl = document.querySelector(`${this.outputSelector} #tax`);
    const shippingEl = document.querySelector(`${this.outputSelector} #shipping`);
    const totalEl = document.querySelector(`${this.outputSelector} #orderTotal`);
    if (taxEl) taxEl.innerText = `$${this.tax.toFixed(2)}`;
    if (shippingEl) shippingEl.innerText = `$${this.shipping.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems(items) {
    // Convert cart items from localStorage into an array
    return items.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity || 1
    }));
  }

  formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};
    formData.forEach((value, key) => {
      convertedJSON[key] = value;
    });
    return convertedJSON;
  }

  async checkout(formElement) {
    // Prevent default form submission
    event.preventDefault();
    // Convert form data to JSON object
    const orderData = this.formDataToJSON(formElement);
    // Populate additional order details
    orderData.orderDate = new Date().toISOString();
    orderData.items = this.packageItems(this.list);
    orderData.orderTotal = this.orderTotal.toFixed(2);
    orderData.shipping = this.shipping;
    orderData.tax = this.tax.toFixed(2);
    
    // Create the POST options object
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    };
    // Send the order to the server
    const response = await fetch('https://wdd330-backend.onrender.com/checkout', options);
    return await response.json();
  }
}
