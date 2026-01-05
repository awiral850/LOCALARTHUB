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
    document.querySelector('.prev').addEventListener('click', () => changeSlide(-1));
    document.querySelector('.next').addEventListener('click', () => changeSlide(1));
}
