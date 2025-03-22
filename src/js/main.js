import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  // 'tents' will be converted internally to '../json/tents.json'
  const dataSource = new ProductData('tents');
  const listElement = document.querySelector('.product-list');
  const productList = new ProductList('tents', dataSource, listElement);
  await productList.init();
});
