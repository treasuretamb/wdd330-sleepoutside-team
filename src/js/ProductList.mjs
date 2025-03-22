import { renderListWithTemplate } from './utils.mjs';

function showAlertPopup(duration = 3000) {
  
  const alerts = [
    {
      message: 'Free shipping on orders over $50!'
    }
  ];
  
  alerts.forEach(alert => {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-popup';
    alertDiv.textContent = alert.message;
    alertDiv.style.background = alert.background;
    alertDiv.style.color = alert.color;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      alertDiv.classList.add('fade-out');
      setTimeout(() => {
        alertDiv.remove();
      }, 500);
    }, duration);
  });
}

export function productCardTemplate(product) {
  let discountHtml = '';
  if (product.FinalPrice < product.SuggestedRetailPrice) {
    const discountAmount = (product.SuggestedRetailPrice - product.FinalPrice).toFixed(2);
    discountHtml = `<span class='discount-indicator'>Discount: $${discountAmount}</span>`;
  }
  return `
    <li class='product-card'>
      <a href='product_pages/index.html?id=${product.Id}'>
        <img src='${product.Image}' alt='Image of ${product.Name}' />
        <h3 class='card__brand'>${product.Brand.Name}</h3>
        <h2 class='card__name'>${product.Name}</h2>
        <div class='product-description'>${product.DescriptionHtmlSimple}</div>
        <p class='product-card__price'>$${product.FinalPrice}</p>
        ${discountHtml}
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // Displaying using alert popup using hard coded data
    showAlertPopup();
    // Fetch product data and render the list
    const list = await this.dataSource.getData();
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, 'afterbegin', true);
  }
}
