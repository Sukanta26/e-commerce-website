const API_URL = "https://fakestoreapi.com/products";

const productsContainer = document.getElementById("products-container");
const categoriesContainer = document.getElementById("categories");
const trendingContainer = document.getElementById("trending-products");

let cartCount = 0;

// ⭐ Rating Stars
function getStars(rate) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= Math.round(rate) ? "⭐" : "☆";
  }
  return stars;
}

// 🛍️ Load All Products
async function loadProducts(url = API_URL) {
  const res = await fetch(url);
  const data = await res.json();

  if (productsContainer) {
    productsContainer.innerHTML = "";
    data.forEach(product => {
      productsContainer.innerHTML += `
        <div class="bg-white p-4 rounded shadow">
          <img src="${product.image}" class="h-40 mx-auto object-contain">
          <span class="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
            ${product.category}
          </span>
          <h3 class="font-semibold mt-2 truncate">${product.title}</h3>
          <p class="font-bold">$${product.price}</p>
          <p>${getStars(product.rating.rate)} (${product.rating.count})</p>
          <div class="flex gap-2 mt-3">
            <button onclick="showDetails(${product.id})"
              class="border px-3 py-1 rounded w-full">Details</button>
            <button onclick="addToCart()"
              class="bg-indigo-600 text-white px-3 py-1 rounded w-full">
              Add
            </button>
          </div>
        </div>
      `;
    });
  }
}

// 📂 Load Categories
async function loadCategories() {
  const res = await fetch(`${API_URL}/categories`);
  const categories = await res.json();

  if (categoriesContainer) {
    categoriesContainer.innerHTML = `
      <button onclick="loadProducts()"
        class="px-4 py-2 bg-indigo-600 text-white rounded">
        All
      </button>
    `;

    categories.forEach(cat => {
      categoriesContainer.innerHTML += `
        <button onclick="loadProducts('${API_URL}/category/${cat}')"
          class="px-4 py-2 border rounded capitalize">
          ${cat}
        </button>
      `;
    });
  }
}

// 📦 Trending (Top 3)
async function loadTrending() {
  if (!trendingContainer) return;

  const res = await fetch(API_URL);
  const data = await res.json();
  const top = data.slice(0, 3);

  top.forEach(product => {
    trendingContainer.innerHTML += `
      <div class="rounded shadow-lg">
          <div class="bg-gray-100 rounded-xl">
          <img src="${product.image}" class="py-4 h-40 mx-auto object-contain">
          </div>
          <div class="p-5">
          <div class="flex justify-between mt-5">
            <span class="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
            ${product.category}
            </span>
            <p>${getStars(product.rating.rate)} (${product.rating.count})</p>
          </div>
          <h3 class="font-semibold mt-2 truncate">${product.title}</h3>
          <p class="font-bold">$${product.price}</p>
          <div class="flex gap-2 mt-3">
            <button onclick="showDetails(${product.id})"
              class="border px-3 py-1 rounded w-full">Details</button>
            <button onclick="addToCart()"
              class="bg-indigo-600 text-white px-3 py-1 rounded w-full">
              Add
            </button>
          </div>
          </div>
        </div>
    `;
  });
}

// 🔍 Modal Details
async function showDetails(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const product = await res.json();

  document.getElementById("modal-content").innerHTML = `
    <img src="${product.image}" class="h-40 mx-auto object-contain">
    <h3 class="font-bold text-xl mt-4">${product.title}</h3>
    <p class="text-sm text-gray-600 mt-2">${product.description}</p>
    <p class="mt-2 font-bold">$${product.price}</p>
    <p>${getStars(product.rating.rate)}</p>
    <button onclick="addToCart()"
      class="bg-indigo-600 text-white px-4 py-2 rounded mt-4 w-full">
      Add to Cart
    </button>
  `;

  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("modal").classList.add("flex");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

// 🛒 Cart
function addToCart() {
  cartCount++;
  const cart = document.getElementById("cart-count");
  if (cart) cart.innerText = cartCount;
}

// INIT
loadProducts();
loadCategories();
loadTrending();
