// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDp3ocBo9VUgwQwK3YV_CHP1WKFeG1MAWw",
    authDomain: "studteacherbookappointment.firebaseapp.com",
    projectId: "studteacherbookappointment",
    storageBucket: "studteacherbookappointment.firebasestorage.app",
    messagingSenderId: "1033098871891",
    appId: "1:1033098871891:web:197450588c971f69cd32a6"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Login functionality
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginemail").value;
    const password = document.getElementById("password").value;

    // Check admin credentials in the database
    const adminRef = ref(database, 'admin/'); // Assuming admin data is stored under 'admin' node
    const snapshot = await get(adminRef);

    if (snapshot.exists()) {
        const adminData = snapshot.val();
        if (adminData.password === password) { // Simple password check
            // Redirect to admin page
            alert('Login Successful!!!');
            console.log("Redirect to Admin Dashboard");
            window.location.href = "admin/admin.html";
        } else {
            alert("Invalid password!");
        }
    } else {
        alert("Admin not found! Please check your email ID.");
    }
});
