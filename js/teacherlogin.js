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
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById("loginemail").value;
    const password = document.getElementById("password").value;

    // Check teacher credentials in the database
    const teacherId = email.replace(/\./g, '_');
    const teacherRef = ref(database, 'teachers/' + teacherId);
    const snapshot = await get(teacherRef);

    if (snapshot.exists()) {
        const teacherData = snapshot.val();
        const decryptedPassword = atob(teacherData.password); // Decrypt the password

        if (decryptedPassword === password) { // Check if the decrypted password matches
            console.log("Redirect to Teacher Dashboard page!!!");
            localStorage.setItem('teacherEmail', email);
            alert("Login Successful!!!");
            window.location.href = "teacher/teacher.html";
        } else {
            alert("Invalid password!");
        }
    } else {
        alert("Teacher not found! Please check your email ID.");
    }
});
