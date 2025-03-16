// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// Department and Subject Mapping
const departments = {
    "Science": ["Physics", "Chemistry", "Biology", "Psychology", "Zoology"],
    "Computer Science": ["Programming Languages", "Data Structure", "Computer Basics", "Graphic Designing"],
    "Mathematics": ["Algebra", "Calculus", "Geometry"],
    "Art": ["Visual Arts", "Literary Arts", "Performing Arts"]
};

const departmentSelect = document.getElementById("department");
const subjectSelect = document.getElementById("subject");

// Populate Department Dropdown
Object.keys(departments).forEach(dept => {
    let option = document.createElement("option");
    option.value = dept;
    option.textContent = dept;
    departmentSelect.appendChild(option);
});

// Update Subjects Based on Selected Department
departmentSelect.addEventListener("change", function () {
    subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    const selectedDept = departmentSelect.value;

    if (selectedDept) {
        departments[selectedDept].forEach(sub => {
            let option = document.createElement("option");
            option.value = sub;
            option.textContent = sub;
            subjectSelect.appendChild(option);
        });
    }
});

// Prevent Subject Selection Before Department
subjectSelect.addEventListener("focus", function () {
    if (!departmentSelect.value) {
        alert("Please select a department first!");
        subjectSelect.blur();
    }
});

// Form Submission - Store Data in Firebase
document.getElementById("ManageTeacherForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const department = departmentSelect.value;
    const subject = subjectSelect.value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!name || !department || !subject || !email || !password) {
        alert("All fields are required!");
        return;
    }

    // Check if email already exists
    const teacherRef = ref(database, 'teachers/' + email.replace('.', '_'));
    const snapshot = await get(teacherRef);
    if (snapshot.exists()) {
        alert("Email ID already exists!");
        return;
    }

    // Password encryption (simple example using btoa for demonstration)
    const encryptedPassword = btoa(password);
    const teacherData = {
        name,
        department,
        subject,
        email,
        password: encryptedPassword // Store encrypted password
    };

    // Use ref and set to store data
    try {
        await set(teacherRef, teacherData);
        alert("Teacher added successfully!");
        document.getElementById("ManageTeacherForm").reset();
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// Retrieve Teacher Data
document.getElementById("retrievebtn").addEventListener("click", async function () {
    const email = document.getElementById("email").value;
    const teacherRef = ref(database, 'teachers/' + email.replace('.', '_'));
    const snapshot = await get(teacherRef);
    if (snapshot.exists()) {
        const teacher = snapshot.val();
        document.getElementById("name").value = teacher.name;
        departmentSelect.value = teacher.department;
        subjectSelect.innerHTML = '<option value="">Select Subject</option>'; // Reset subject dropdown

        // Fetch all subjects for the selected department
        const subjects = departments[teacher.department] || [];
        subjects.forEach(sub => {
            let option = document.createElement("option");
            option.value = sub;
            option.textContent = sub;
            subjectSelect.appendChild(option);
        });

        // Set the subject from the database
        if (teacher.subject) {
            subjectSelect.value = teacher.subject; // Set the subject from database
        }
        document.getElementById("password").value = atob(teacher.password); // Decrypt and show password
    } else {
        alert("No data found for this email ID.");
    }
});

// Update Teacher Data
document.getElementById("updatebtn").addEventListener("click", async function () {
    const email = document.getElementById("email").value;
    const teacherRef = ref(database, 'teachers/' + email.replace('.', '_'));
    const updatedData = {
        name: document.getElementById("name").value,
        department: departmentSelect.value,
        subject: subjectSelect.value,
        email: email,
        password: btoa(document.getElementById("password").value) // Update password if changed and encrypt it
    };
    try {
        await set(teacherRef, updatedData);
        alert("Teacher data updated successfully!");
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// Define deleteTeacher function
document.getElementById("deletebtn").addEventListener("click", async function () {
    const email = document.getElementById("email").value;
    const teacherRef = ref(database, 'teachers/' + email.replace('.', '_'));
    try {
        await remove(teacherRef);
        alert('Teacher deleted successfully');
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// Teacher Data Fetch and display teacher data from Firebase
const fetchTeachers = async () => {
    const teachersRef = ref(database, 'teachers/');
    onValue(teachersRef, (snapshot) => {
        const data = snapshot.val();
        const tbody = document.getElementById('teacherTableBody');

        tbody.innerHTML = ''; // Clear existing data
        let index = 1;
        for (const id in data) {
            const teacher = data[id];
            const row = `<tr>
                <td>${index++}</td>
                <td>${teacher.name}</td>
                <td>${teacher.department}</td>
                <td>${teacher.subject}</td>
                <td>${teacher.email}</td>
            </tr>`;
            tbody.innerHTML += row;
        }
    });
};

// Student Registration Approval Table 
const fetchStudents = async () => {
    const studentsRef = ref(database, 'students/');
    onValue(studentsRef, (snapshot) => {
        const data = snapshot.val();
        const tbody = document.getElementById('StudentTableBody');
        tbody.innerHTML = ''; // Clear existing data
        let index = 1;

        for (const id in data) {
            const student = data[id];
            const isApproved = student.status === "approved"; // Check student status
            const row = `<tr>
                <td>${index++}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>
                    ${isApproved ? '<span class="approved-text">Approved</span>'
                    : `<button class="approve-btn" onclick="approveStudent('${id}', '${student.email}')">Approve</button>`}
                    <button class="delete-btn" onclick="deleteStudent('${id}')">Delete</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        }
    });
};

window.approveStudent = async (id, email) => {
    const studentRef = ref(database, 'students/' + id);
    try {
        await update(studentRef, { status: "approved" });
        sendApprovalEmail(email);
        alert("Student's registration approved!");
    } catch (error) {
        alert("Error: " + error.message);
    }
};

window.deleteStudent = async (id) => {
    const studentRef = ref(database, 'students/' + id);
    try {
        await remove(studentRef);
        alert("Student record deleted successfully.");
        fetchStudents(); // Refresh the student list
    } catch (error) {
        alert("Error: " + error.message);
    }
};

// Function to Send Email (Dummy function, replace with SMTP API)
function sendApprovalEmail(email) {
    console.log(`Email sent to ${email}: Your registration has been approved! You can now log in.`);
}

window.onload = function () {
    fetchTeachers();
    fetchStudents();
};
