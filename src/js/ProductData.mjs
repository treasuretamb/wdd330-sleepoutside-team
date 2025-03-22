export default class ProductData {
  constructor(pathOrCategory) {
    
    if (pathOrCategory.includes('.json')) {
      this.path = pathOrCategory;
    } else {
      this.path = `../json/${pathOrCategory}.json`;
    }
  }

  async getData() {
    const response = await fetch(this.path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find(item => item.Id === id);
  }
}
