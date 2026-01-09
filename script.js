const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if(bar){
  bar.addEventListener('click', () => {
    nav.classList.add('active');
  })
}
if (close){
  close.addEventListener('click', () => {
    nav.classList.remove('active');
  })
}
// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
// import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
// import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";



// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsQNrAnhfzhWSepgMJEr3DbnLIUwHhOP0",
  authDomain: "localarthub-38ae5.firebaseapp.com",
  projectId: "localarthub-38ae5",
   storageBucket: "localarthub-38ae5.firebasestorage.app",   
  messagingSenderId: "741966380978",
  appId: "1:741966380978:web:d94d5516d308b799c1eeab",
  measurementId: "G-Y7F4HQQ3ZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

//script.js to capture Firebase token
import { onAuthStateChanged, getIdToken, signOut } 
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const token = await getIdToken(user);
    localStorage.setItem("authToken", token);
    console.log("🔥 Firebase token saved");

    // Check custom claims for admin or seller role
    const adminLink = document.querySelector('a[href="admin.html"]');
    if (adminLink) {
      try {
        const idTokenResult = await user.getIdTokenResult();
        const customClaims = idTokenResult.claims;
        const hasAdminRole = customClaims.admin === true;
        const hasSellerRole = customClaims.seller === true;
        console.log("Custom claims:", customClaims);
        console.log("Has admin role:", hasAdminRole);
        console.log("Has seller role:", hasSellerRole);
        adminLink.parentElement.style.display = (hasAdminRole || hasSellerRole) ? 'block' : 'none';
      } catch (e) {
        console.error("Error checking custom claims:", e);
        adminLink.parentElement.style.display = 'none';
      }
    }
  } else {
    localStorage.removeItem("authToken");

    // Hide admin link when not logged in
    const adminLink = document.querySelector('a[href="admin.html"]');
    if (adminLink) {
      adminLink.parentElement.style.display = 'none';
    }
  }

  // Update login button UI across pages
  try {
    updateLoginUI(user);
  } catch (e) {
    // ignore UI update errors for pages without those elements
  }
});

// Update login button and modal behavior across pages
function updateLoginUI(user) {
  const loginBtn = document.getElementById('login-btn');
  const modal = document.getElementById('logout-modal');
  const cancelBtn = document.getElementById('cancel-logout');
  const logoutBtn = document.getElementById('confirm-logout');
  const becomeSellerBtn = document.getElementById('become-seller');

  if (!loginBtn) return;

  if (user) {
    // show user icon and attach modal opener
    loginBtn.innerHTML = `
      <img 
        src="https://cdn-icons-png.flaticon.com/512/9131/9131478.png" 
        alt="User" 
        style="width:24px; height:24px; border-radius:50%;"
      >
    `;
    loginBtn.href = "#";
    loginBtn.onclick = (e) => {
      e.preventDefault();
      if (modal) modal.style.display = 'flex';
    };

    if (cancelBtn) cancelBtn.onclick = () => { if (modal) modal.style.display = 'none'; };

    if (logoutBtn) logoutBtn.onclick = async () => {
      try {
        await signOut(auth);
      } catch (e) {
        console.error('Sign out failed', e);
      }
      if (modal) modal.style.display = 'none';
      // onAuthStateChanged will update UI; reload as a fallback
      setTimeout(() => window.location.reload(), 200);
    };

    if (becomeSellerBtn) {
      becomeSellerBtn.onclick = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) { alert('Please login first'); return; }
        try {
          const res = await fetch('http://localhost:5000/api/users/become-seller', {
            method: 'POST', headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          alert(data.message || 'Seller role granted. Please sign out and sign in again.');
          if (modal) modal.style.display = 'none';
        } catch (e) {
          alert('Request failed');
        }
      };
    }
  } else {
    // revert to login link
    loginBtn.innerText = 'Login';
    loginBtn.href = 'signin.html';
    loginBtn.onclick = null;
  }
}

// Get input elements
// const email = document.getElementById('signin-email').value;
// const password = document.getElementById('signin-password').value;
// const name = document.getElementById('register-name').value;
// const RegEmail = document.getElementById('register-email').value;
// const RegPass = document.getElementById('register-password').value;
// const RegPassConf = document.getElementById('register-confirm-password').value;

// Submit button
// const submitSignin = document.getElementById('Existing-Signin');
// submitSignin.addEventListener("click", (e) => {
//   e.preventDefault();
//   const email = document.getElementById('signin-email').value;
// const password = document.getElementById('signin-password').value;
//   createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       alert(errorMessage);
//     });
// });
// const submitRegister = document.getElementById('Register-New');
// submitRegister.addEventListener("click", (e) => { 
//   e.preventDefault();
//   // const auth = getAuth();
//   // const name = document.getElementById('register-name').value;
// const email = document.getElementById('register-email').value;
// const password = document.getElementById('register-password').value;
// // const RegPassConf = document.getElementById('register-confirm-password').value;
  
// signInWithEmailAndPassword(auth,email,password)
//   .then((userCredential) => {
    
//     const user = userCredential.user;
    
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });
// });
// submit button

// SIGN IN button
const submitSignin = document.getElementById('Existing-Signin');
if (submitSignin) {
  submitSignin.addEventListener("click", (e) => {
    e.preventDefault();

    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Sign in successful!");
        window.location.href = 'main.html';
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}

// REGISTER button
const submitRegister = document.getElementById('Register-New');
if (submitRegister) {
  submitRegister.addEventListener("click", (e) => { 
    e.preventDefault();

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Account created successfully!");
        window.location.href = 'main.html';
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}

// Slideshow functionality
let slideIndex = 0;
let slideTimer;
const slides = document.querySelectorAll('.slide');

function showSlides() {
    console.log('showSlides called, slideIndex:', slideIndex);
    slides.forEach(slide => slide.classList.remove('active'));
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    slides[slideIndex - 1].classList.add('active');
    slideTimer = setTimeout(showSlides, 3000); // Change image every 3 seconds
}

function changeSlide(n) {
    console.log('changeSlide called with', n);
    clearTimeout(slideTimer);
    slides.forEach(slide => slide.classList.remove('active'));
    slideIndex += n;
    if (slideIndex > slides.length) { slideIndex = 1; }
    if (slideIndex < 1) { slideIndex = slides.length; }
    slides[slideIndex - 1].classList.add('active');
    slideTimer = setTimeout(showSlides, 3000);
}

if (slides.length > 0) {
    showSlides(); // Start the slideshow
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));
}

//add products by admin
async function addProduct() {
  const token = localStorage.getItem("authToken");

   if (!token) {
    alert("Login as admin first");
    return;
  }

  const product = {
    title: document.getElementById("pname").value,
    price: Number(document.getElementById("pprice").value),
    image: document.getElementById("pimage").value,
    stock: Number(document.getElementById("stock").value) || 0,
    category: document.getElementById("pcategory").value,
    subcategory: document.getElementById("psubcategory").value,
    era: document.getElementById("pera").value,
    description: document.getElementById("pdescription").value || "Local artisan product"
  };


  const response = await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });

  if (response.ok) {
    alert("Product added successfully");
    // Clear the form
    document.getElementById("pname").value = "";
    document.getElementById("pprice").value = "";
    document.getElementById("pimage").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("pcategory").value = "";
    document.getElementById("psubcategory").value = "";
    document.getElementById("pera").value = "";
    document.getElementById("pdescription").value = "";
  } else {
    alert("Failed to add product");
  }
}

// Subcategory mapping
const subcategoryMap = {
  "Antiques Artifacts": ["Furniture", "Jewelry", "Metal", "Glass", "Wood"],
  "Decorative Arts": ["Ceramics", "Pottery", "Glassware", "Textile"],
  "Fine Art": ["Painting", "Drawing", "Sculpture"]
};

// Update subcategory options based on category selection
function updateSubcategories(categorySelectId, subcategorySelectId) {
  const categorySelect = document.getElementById(categorySelectId);
  const subcategorySelect = document.getElementById(subcategorySelectId);
  
  if (categorySelect && subcategorySelect) {
    const selectedCategory = categorySelect.value;
    subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
    
    if (selectedCategory && subcategoryMap[selectedCategory]) {
      subcategoryMap[selectedCategory].forEach(subcat => {
        const option = document.createElement('option');
        option.value = subcat;
        option.textContent = subcat;
        subcategorySelect.appendChild(option);
      });
    }
  }
}

// Add event listeners for category selection (for add product form)
document.addEventListener('DOMContentLoaded', () => {
  const categorySelect = document.getElementById('pcategory');
  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      updateSubcategories('pcategory', 'psubcategory');
    });
  }
  
  const editCategorySelect = document.getElementById('edit-category');
  if (editCategorySelect) {
    editCategorySelect.addEventListener('change', () => {
      updateSubcategories('edit-category', 'edit-subcategory');
    });
  }
});


// Store all products globally for filtering

// Store all products globally for filtering
let allProducts = [];

async function loadProducts(containerId) {
  const token = localStorage.getItem("authToken");

  const res = await fetch("http://localhost:5000/api/products", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const products = await res.json();
  allProducts = products;
  renderProducts(containerId, products);
  
  // Initialize filters if on shop page
  if (containerId === "shop-products") {
    initializeFilters();
  }
}

function renderProducts(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="pro">
        <img src="${p.image}" alt="${p.title}">
        <div class="des">
          <span>${p.category || ""}</span>
          <h5>${p.title}</h5>
          <div class="star">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star-half-alt"></i>
          </div>
          <h4>Rs. ${p.price}</h4>
        </div>
        <a href="#" onclick="addToCart('${p._id}')"><i class="fal fa-shopping-cart cart"></i></a>
      </div>
    `;
  });
}

async function loadAdminProducts() {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  const res = await fetch("http://localhost:5000/api/products", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const products = await res.json();
  renderAdminProducts(products);
}

function renderAdminProducts(products) {
  const container = document.querySelector(".products-list");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>Price: Rs. ${p.price}</p>
        <p>Stock: ${p.stock}</p>
        <p>Category: ${p.category || 'N/A'}</p>
        <p>Subcategory: ${p.subcategory || 'N/A'}</p>
        <p>Era: ${p.era || 'N/A'}</p>
        <div class="product-actions">
          <button onclick="editProduct('${p._id}', '${p.title}', ${p.price}, '${p.image}', ${p.stock}, '${p.category || ''}', '${p.subcategory || ''}', '${p.era || ''}', '${(p.description || '').replace(/'/g, "\\'")}')">Edit</button>
          <button onclick="deleteProduct('${p._id}')">Delete</button>
        </div>
      </div>
    `;
  });
}

async function editProduct(id, title, price, image, stock, category, subcategory, era, description) {
  document.getElementById("edit-id").value = id;
  document.getElementById("edit-name").value = title;
  document.getElementById("edit-price").value = price;
  document.getElementById("edit-image").value = image;
  document.getElementById("edit-stock").value = stock;
  document.getElementById("edit-category").value = category || "";
  document.getElementById("edit-subcategory").value = subcategory || "";
  document.getElementById("edit-era").value = era || "";
  document.getElementById("edit-description").value = description || "";
  
  // Update subcategories based on selected category
  updateSubcategories('edit-category', 'edit-subcategory');

  document.getElementById("add-product-form").style.display = "none";
  document.getElementById("edit-title").style.display = "block";
  document.getElementById("edit-product-form").style.display = "block";
}

function cancelEdit() {
  document.getElementById("add-product-form").style.display = "block";
  document.getElementById("edit-title").style.display = "none";
  document.getElementById("edit-product-form").style.display = "none";
}

async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  const token = localStorage.getItem("authToken");

  const response = await fetch(`http://localhost:5000/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.ok) {
    alert("Product deleted");
    loadAdminProducts(); // Reload the list
  } else {
    alert("Failed to delete product");
  }
}

// Handle edit form submit
const editForm = document.getElementById("edit-product-form");
if (editForm) {
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    const id = document.getElementById("edit-id").value;

    const product = {
      title: document.getElementById("edit-name").value,
      price: Number(document.getElementById("edit-price").value),
      image: document.getElementById("edit-image").value,
      stock: Number(document.getElementById("edit-stock").value),
      category: document.getElementById("edit-category").value,
      subcategory: document.getElementById("edit-subcategory").value,
      era: document.getElementById("edit-era").value,
      description: document.getElementById("edit-description").value
    };

    const response = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });

    if (response.ok) {
      alert("Product updated");
      cancelEdit();
      loadAdminProducts();
    } else {
      alert("Failed to update product");
    }
  });
}

async function addToCart(productId) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("Please login first");
    return;
  }

  await fetch("http://localhost:5000/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ productId })
  });

  alert("Added to cart!");
}

async function loadCart() {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  const res = await fetch("http://localhost:5000/api/cart", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const cart = await res.json();
  console.log("Fetched cart:", cart.length, "items");

  // Fetch all products to get details
  const productsRes = await fetch("http://localhost:5000/api/products");
  const products = await productsRes.json();

  // Create a map for quick lookup
  const productMap = {};
  products.forEach(p => productMap[p._id] = p);

  renderCart(cart, productMap);
}

function renderCart(cart, productMap) {
  const container = document.getElementById("cart-list");
  if (!container) return;

  container.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cart.forEach(item => {
    const product = productMap[item.productId];
    if (!product) return;

    const itemTotal = product.price * item.qty;
    total += itemTotal;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.title}" class="cart-item-img">
        <div class="cart-item-details">
          <h4>${product.title}</h4>
          <p>Price: Rs. ${product.price}</p>
          <p>Quantity: ${item.qty}</p>
          <p>Subtotal: Rs. ${itemTotal}</p>
        </div>
        <div class="cart-item-actions">
          <button onclick="checkoutItem('${item._id}')">Checkout</button>
          <button onclick="removeFromCart('${item._id}')" class="remove-btn">Remove</button>
        </div>
      </div>
    `;
  });

  // Add total and checkout all
  container.innerHTML += `
    <div class="cart-total">
      <h3>Total: Rs. ${total}</h3>
      <button onclick="checkoutAll()">Checkout All</button>
    </div>
  `;
}

function checkoutItem(cartId) {
  window.location.href = "checkout.html";
}

function checkoutAll() {
  window.location.href = "checkout.html";
}

async function removeFromCart(cartId) {
  if (!confirm("Remove this item from cart?")) return;

  const token = localStorage.getItem("authToken");

  const response = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.ok) {
    loadCart(); // Reload cart
  } else {
    alert("Failed to remove item");
  }
}

document.addEventListener("DOMContentLoaded", loadCart);


// ===== FILTER FUNCTIONALITY FOR SHOP PAGE =====
let activeFilters = {
  priceMin: 0,
  priceMax: 100000,
  categories: [],
  subcategories: [],
  eras: []
};

function initializeFilters() {
  // Price range sliders
  const priceMinSlider = document.getElementById('price-min');
  const priceMaxSlider = document.getElementById('price-max');
  const priceMinDisplay = document.getElementById('price-min-display');
  const priceMaxDisplay = document.getElementById('price-max-display');

  if (priceMinSlider && priceMaxSlider) {
    priceMinSlider.addEventListener('input', (e) => {
      const minVal = parseInt(e.target.value);
      const maxVal = parseInt(priceMaxSlider.value);
      if (minVal <= maxVal) {
        activeFilters.priceMin = minVal;
        priceMinDisplay.textContent = minVal;
        applyFilters();
      }
    });

    priceMaxSlider.addEventListener('input', (e) => {
      const maxVal = parseInt(e.target.value);
      const minVal = parseInt(priceMinSlider.value);
      if (maxVal >= minVal) {
        activeFilters.priceMax = maxVal;
        priceMaxDisplay.textContent = maxVal;
        applyFilters();
      }
    });
  }

  // Main category checkboxes with responsive subcategories
  const mainCategoryCheckboxes = document.querySelectorAll('.main-category');
  mainCategoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const category = e.target.value;
      const subcategoryDiv = document.getElementById(`subcategory-${e.target.id.replace('type-', '')}`);
      
      if (e.target.checked) {
        activeFilters.categories.push(category);
        if (subcategoryDiv) subcategoryDiv.style.display = 'block';
      } else {
        activeFilters.categories = activeFilters.categories.filter(c => c !== category);
        // Uncheck all subcategories for this category
        if (subcategoryDiv) {
          const subCheckboxes = subcategoryDiv.querySelectorAll('.subcategory-filter');
          subCheckboxes.forEach(sub => {
            if (sub.checked) {
              sub.checked = false;
              activeFilters.subcategories = activeFilters.subcategories.filter(s => s !== sub.value);
            }
          });
          subcategoryDiv.style.display = 'none';
        }
      }
      applyFilters();
    });
  });

  // Subcategory checkboxes
  const subcategoryCheckboxes = document.querySelectorAll('.subcategory-filter');
  subcategoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const subcategory = e.target.value;
      if (e.target.checked) {
        activeFilters.subcategories.push(subcategory);
      } else {
        activeFilters.subcategories = activeFilters.subcategories.filter(s => s !== subcategory);
      }
      applyFilters();
    });
  });

  // Era/Period checkboxes
  const eraCheckboxes = document.querySelectorAll('.era-filter');
  eraCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const era = e.target.value;
      if (e.target.checked) {
        activeFilters.eras.push(era);
      } else {
        activeFilters.eras = activeFilters.eras.filter(e => e !== era);
      }
      applyFilters();
    });
  });
}

function applyFilters() {
  let filtered = allProducts;

  // Price filter
  filtered = filtered.filter(p => p.price >= activeFilters.priceMin && p.price <= activeFilters.priceMax);

  // Category filter (if main categories selected, apply them)
  if (activeFilters.categories.length > 0) {
    // If subcategories are selected, filter by subcategories only
    if (activeFilters.subcategories.length > 0) {
      filtered = filtered.filter(p => 
        activeFilters.subcategories.includes(p.subcategory)
      );
    } else {
      // Otherwise filter by main categories
      filtered = filtered.filter(p => 
        activeFilters.categories.includes(p.category)
      );
    }
  }

  // Era filter
  if (activeFilters.eras.length > 0) {
    filtered = filtered.filter(p => 
      activeFilters.eras.includes(p.era)
    );
  }

  renderProducts("shop-products", filtered);
  updateActiveFiltersDisplay();
}

function updateActiveFiltersDisplay() {
  const container = document.getElementById('active-filters-container');
  const filtersList = document.getElementById('active-filters-list');
  
  if (!container) return;

  const filters = [];
  
  if (activeFilters.priceMin !== 0 || activeFilters.priceMax !== 100000) {
    filters.push(`Price: Rs. ${activeFilters.priceMin} - ${activeFilters.priceMax}`);
  }
  
  if (activeFilters.subcategories.length > 0) {
    activeFilters.subcategories.forEach(sub => {
      filters.push(sub);
    });
  } else if (activeFilters.categories.length > 0) {
    activeFilters.categories.forEach(cat => {
      filters.push(cat);
    });
  }
  
  if (activeFilters.eras.length > 0) {
    activeFilters.eras.forEach(era => {
      filters.push(era);
    });
  }

  if (filters.length > 0) {
    container.style.display = 'block';
    filtersList.innerHTML = filters.map(f => `<span class="filter-tag">${f}</span>`).join('');
  } else {
    container.style.display = 'none';
  }
}

function clearAllFilters() {
  // Reset filter state
  activeFilters = {
    priceMin: 0,
    priceMax: 100000,
    categories: [],
    subcategories: [],
    eras: []
  };

  // Reset slider and display
  const priceMinSlider = document.getElementById('price-min');
  const priceMaxSlider = document.getElementById('price-max');
  const priceMinDisplay = document.getElementById('price-min-display');
  const priceMaxDisplay = document.getElementById('price-max-display');
  
  if (priceMinSlider) {
    priceMinSlider.value = 0;
    priceMinDisplay.textContent = '0';
  }
  if (priceMaxSlider) {
    priceMaxSlider.value = 100000;
    priceMaxDisplay.textContent = '100000';
  }

  // Uncheck all checkboxes
  const allCheckboxes = document.querySelectorAll('.main-category, .subcategory-filter, .era-filter');
  allCheckboxes.forEach(cb => cb.checked = false);

  // Hide subcategories
  const subcategoryDivs = document.querySelectorAll('[id^="subcategory-"]');
  subcategoryDivs.forEach(div => div.style.display = 'none');

  // Re-apply filters (show all)
  renderProducts("shop-products", allProducts);
  updateActiveFiltersDisplay();
}

// Expose filter functions to global scope
window.clearAllFilters = clearAllFilters;

document.addEventListener("DOMContentLoaded", loadCart);


// Load products only on pages that have product containers
document.addEventListener("DOMContentLoaded", () => {
   if (document.getElementById("shop-products"))
  { loadProducts("shop-products");
  }
  if (document.getElementById("featured-products"))
  { loadProducts("featured-products");
  }
  if (document.querySelector(".products-list"))
  { loadAdminProducts();
  }
});

// Expose functions to global scope for onclick handlers
window.addProduct = addProduct;
window.editProduct = editProduct;
window.cancelEdit = cancelEdit;
window.deleteProduct = deleteProduct;
window.loadProducts = loadProducts;
window.addToCart = addToCart;
window.checkoutItem = checkoutItem;
window.checkoutAll = checkoutAll;
window.removeFromCart = removeFromCart;
