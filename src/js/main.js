import { loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  // Load the dynamic header and footer first
  await loadHeaderFooter();

  // Set the category 
  const category = 'tents';
  
  // Create an instance of ProductData that fetches from tents.json
  const dataSource = new ProductData(category);
  const listElement = document.querySelector('.product-list');
  if (!listElement) {
    console.error('Element with class `product-list` not found');
    return;
  }
  
  // Create and initialize the product listing
  const productList = new ProductList(category, dataSource, listElement);
  await productList.init();
});
