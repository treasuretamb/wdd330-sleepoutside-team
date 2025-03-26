import { renderListWithTemplate } from './utils.mjs';

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    try {
      // Fetch the product data for the given category
      const list = await this.dataSource.getData(this.category);
      console.log('Data fetched for category', this.category, list);
      // show the first 4 products:
      const filteredList = this.filterList(list);
      console.log('Filtered list:', filteredList);
      // Render the product cards
      renderListWithTemplate(
        this.productCardTemplate.bind(this),
        this.listElement,
        filteredList,
      );
    } catch (error) {
      console.error('Error loading product data:', error);
    }
  }

  productCardTemplate(product) {
    // Use PrimaryMedium for product listing images
    const imageSrc =
      (product.Images && product.Images.PrimaryMedium) ||
      '/images/placeholder.jpg';
    return `<li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <img src="${imageSrc}" alt="Image of ${product.Name}" class="product-image">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <p class="product-card__price">$${parseFloat(product.FinalPrice).toFixed(2)}</p>
      </a>
    </li>`;
  }

  filterList(list) {
    // For now, show only the first 4 products
    return list.slice(0, 4);
  }
}
