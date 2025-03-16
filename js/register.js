// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const database = getDatabase(app);

// Register Button Click Event
document.getElementById("registerbtn").addEventListener("click", (event) => {
    event.preventDefault();

    const studentName = document.getElementById("StudName").value.trim();
    const email = document.getElementById("studEmail").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!studentName || !email || !password) {
        alert("Please fill all fields!");
        return;
    }

    // Store data in Firebase Realtime Database
    const studentId = email.replace(/\./g, '_');
    const studentRef = ref(database, 'students/' + studentId);

    get(studentRef).then((snapshot) => {
        if (snapshot.exists()) {
            alert("This email ID is already registered in the database.");
            return;
        } else {
            // Store data in Firebase Realtime Database
            set(ref(database, 'students/' + studentId), {
                name: studentName,
                email: email,
                password: btoa(password), // Encrypt password using base64
                status: "pending" // Default status
            }).then(() => {
                document.getElementById("registerForm").reset();
                alert("Registration successful! You can login when admin approve your account. Approvement will take 24 hours.");
                console.log("Redirect to Home Page");
                window.location.href = "index.html";
            }).catch((error) => {
                console.error("Error: ", error.message);
                alert("Error: " + error.message);
            });
        }
    });
});
