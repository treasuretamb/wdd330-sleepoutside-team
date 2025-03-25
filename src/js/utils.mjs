// QuerySelector wrapper
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Retrieve data from localStorage
export function getLocalStorage(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('Error parsing cart data:', e);
    return [];
  }
}

// Save data to localStorage
export function setLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

// Get a query parameter from the URL
export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

// Render a list of items using a template function (existing)
export function renderListWithTemplate(templateFn, parentElement, list, position = 'afterbegin', clear = false) {
  if (clear) {
    parentElement.innerHTML = '';
  }
  const htmlStrings = list.map(templateFn).join('');
  parentElement.insertAdjacentHTML(position, htmlStrings);
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load template from ${path}: ${response.status}`);
  }
  return await response.text();
}

// Load the header and footer.
 
export async function loadHeaderFooter() {
  try {
    const headerTemplate = await loadTemplate('/partials/header.html');
    const footerTemplate = await loadTemplate('/partials/footer.html');

    const headerEl = document.getElementById('main-header');
    const footerEl = document.getElementById('main-footer');

    if (headerEl) renderWithTemplate(headerTemplate, headerEl);
    if (footerEl) renderWithTemplate(footerTemplate, footerEl);
  } catch (error) {
    console.error('Error loading header/footer:', error);
  }
}

export function updateCartCount() {
  const cart = getLocalStorage('so-cart') || [];
  const cartCountElement = document.querySelector('.cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
  }
}
