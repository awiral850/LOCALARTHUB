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
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";


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
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Get input elements
const email = document.getElementById('signin-email').value;
const password = document.getElementById('signin-password').value;
const name = document.getElementById('register-name').value;
const RegEmail = document.getElementById('register-email').value;
const RegPass = document.getElementById('register-password').value;
const RegPassConf = document.getElementById('register-confirm-password').value;

// Submit button
const submitSignin = document.getElementById('Existing-Signin');
submitSignin.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById('signin-email').value;
const password = document.getElementById('signin-password').value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
});
const submitRegister = document.getElementById('Register-New');
submitRegister.addEventListener("click", (e) => { 
  e.preventDefault();
  const auth = getAuth();
  // const name = document.getElementById('register-name').value;
const email = document.getElementById('register-email').value;
const password = document.getElementById('register-password').value;
// const RegPassConf = document.getElementById('register-confirm-password').value;
  
signInWithEmailAndPassword(auth,email,password)
  .then((userCredential) => {
    
    const user = userCredential.user;
    
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
});