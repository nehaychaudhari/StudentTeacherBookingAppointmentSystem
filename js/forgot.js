// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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

// Firebase Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Forgot Password Form Handle
document.getElementById("forgotPasswordForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim(); // Trim whitespace

    if (!email) { // Check if email is empty
        alert("Please enter your email address!");
        return;
    }

    // Check if email exists in the database
    const studentId = email.replace(/\./g, '_'); // Replace '.' in email for valid key
    const studentRef = ref(database, 'students/' + studentId);
    get(studentRef).then((snapshot) => {
        if (!snapshot.exists()) {
            alert("This email ID is not registered in the database.");
            return;
        }

        // Reset Password Email Send
        sendPasswordResetEmail(auth, email) // Corrected function call
            .then(() => {
                alert("Password reset email sent! Check your inbox.");
            })
            .catch((error) => {
                console.error("Error: ", error.message);
                alert("Error: " + error.message);
            });
    });
});