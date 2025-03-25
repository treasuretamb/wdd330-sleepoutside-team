const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) return res.json();
  throw new Error('Bad Response');
}

export default class ProductData {
  constructor() {
  }

  // Fetch product data for a given category from the API.
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    // The API returns the data wrapped in a "Result" array.
    return data.Result;
  }

  // Find a product by its ID within a given category.
  async findProductById(id, category) {
    const products = await this.getData(category);
    return products.find(item => String(item.Id) === String(id));
  }
}
