export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `/json/${category}.json`;
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
    // Compare IDs as strings for consistency
    return products.find(item => String(item.Id) === String(id));
  }
}
