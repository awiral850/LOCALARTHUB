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
import { onAuthStateChanged, getIdToken } 
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const token = await getIdToken(user);
    localStorage.setItem("authToken", token);
    console.log("🔥 Firebase token saved");

    // Hide admin link for non-admins
    const adminLink = document.querySelector('a[href="admin.html"]');
    if (adminLink) {
      const isAdmin = user.email === 'admin@localarthub.com'; // Replace with actual admin email
      adminLink.parentElement.style.display = isAdmin ? 'block' : 'none';
    }
  } else {
    localStorage.removeItem("authToken");

    // Hide admin link when not logged in
    const adminLink = document.querySelector('a[href="admin.html"]');
    if (adminLink) {
      adminLink.parentElement.style.display = 'none';
    }
  }
});

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
  category: "Handmade",
  description: "Local artisan product"
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
  } else {
    alert("Failed to add product");
  }
}





async function loadProducts() {
  const token = localStorage.getItem("authToken");

  const res = await fetch("http://localhost:5000/api/products", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const products = await res.json();
  renderProducts(products);
}

function renderProducts(products) {
  const container = document.getElementById("shop-products");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="pro">
        <img src="${p.image}" alt="${p.title}">
        <div class="des">
          <span>${p.category || ""}</span>
          <h5>${p.title}</h5>
          <h4>Rs. ${p.price}</h4>
        </div>
        <button onclick="addToCart('${p._id}')">Add to Cart</button>
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
        <div class="product-actions">
          <button onclick="editProduct('${p._id}', '${p.title}', ${p.price}, '${p.image}', ${p.stock})">Edit</button>
          <button onclick="deleteProduct('${p._id}')">Delete</button>
        </div>
      </div>
    `;
  });
}

async function editProduct(id, title, price, image, stock) {
  document.getElementById("edit-id").value = id;
  document.getElementById("edit-name").value = title;
  document.getElementById("edit-price").value = price;
  document.getElementById("edit-image").value = image;
  document.getElementById("edit-stock").value = stock;

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
      stock: Number(document.getElementById("edit-stock").value)
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

  const list = document.getElementById("cart-list");
  if (!list) return;

  list.innerHTML = cart.map(item => `
    <p>${item.productId} — Qty: ${item.qty}</p>
  `).join("");
}

document.addEventListener("DOMContentLoaded", loadCart);


// Load products only on pages that have product containers
document.addEventListener("DOMContentLoaded", () => {
   if (document.getElementById("shop-products"))
  { loadProducts();
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
window.addToCart = addToCart;
