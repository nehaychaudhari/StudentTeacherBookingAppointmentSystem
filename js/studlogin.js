// Import the functions you need from the SDKs you need
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

// Firebase Initialize
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Login Button Click Event
document.getElementById("loginbtn").addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please fill all fields!");
        return;
    }

    const studentId = email.replace(/\./g, '_');
    const studentRef = ref(database, 'students/' + studentId);

    try {
        const snapshot = await get(studentRef);
        if (!snapshot.exists()) {
            alert("No account found with this email.");
            return;
        }

        const studentData = snapshot.val();

        // Password check
        if (atob(studentData.password) !== password) {
            alert("Incorrect password. Please try again.");
            return;
        }

        // Check if approved
        if (studentData.status !== "approved") {
            alert("Your account is not yet approved by the admin. Please wait for approval.");
            return;
        }

        // Login successful
        alert("Login successful!");
        localStorage.setItem('loggedInEmail', studentId);
        console.log("Redirect to student dashboard");
        window.location.href = "student/student.html";

    } catch (error) {
        console.error("Error: ", error.message);
        alert("Error: " + error.message);
    }
});
