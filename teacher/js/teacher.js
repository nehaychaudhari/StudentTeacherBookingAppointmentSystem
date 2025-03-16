// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, get, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase Configuration
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

// -------------------------------------------------------------------------------------------------------------------------------------------------

// Teacher Edmai Id
const teacherId = localStorage.getItem("teacherEmail");
document.getElementById('loggedInTeacherEmail').innerText = `${teacherId}`;

// View Messages (Chatbox)
function loadStudentsForChat() {
    const studentTableBody = document.getElementById("StudentTableBody");
    onValue(ref(database, "students"), (snapshot) => {
        studentTableBody.innerHTML = "";
        let count = 1;
        snapshot.forEach(childSnapshot => {
            const student = childSnapshot.val();
            // Check if the student's status is approved
            if (student.status === "approved") {
                const row = `<tr>
                    <td>${count++}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td><button onclick="openChat('${childSnapshot.key}', '${student.name}')">Chat</button></td>
                </tr>`;
                studentTableBody.innerHTML += row;
            }
        });
    });
}

window.openChat = (studentId, studentName) => {
    const chatModal = document.getElementById('chatModal');
    const chatStudentName = document.getElementById('chatStudentName');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');

    chatStudentName.innerText = studentName;
    console.log("Student Id: ", studentId, "Student Name: ", studentName);
    chatModal.style.display = 'block';

    // Load previous messages
    const messagesRef = ref(database, `messages/${studentId}/${studentName}`);
    onValue(messagesRef, (snapshot) => {
        chatMessages.innerHTML = '';
        const messages = snapshot.val() || {};
        for (const key in messages) {
            const { sender, text } = messages[key];
            const decryptedMessage = decryptMessage(text);
            const messageDiv = document.createElement('div');
            if (sender === studentId) {
                // Student's message
                messageDiv.className = 'teacher-message';
                messageDiv.innerText = decryptedMessage;
            } else {
                // Teacher's message ( decrypted from student's sent message )
                messageDiv.className = 'student-message';
                messageDiv.innerText = decryptedMessage;
            }
            chatMessages.appendChild(messageDiv);
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // Function to send message
    const sendMessage = async () => {
        const messageText = chatInput.value.trim();
        if (messageText) {
            const encryptedMessage = encryptMessage(messageText);
            const newMessageRef = push(ref(database, `messages/${studentId}/${studentName}`));
            await set(newMessageRef, {
                sender: teacherId,
                text: encryptedMessage,
                timestamp: Date.now()
            });

            chatInput.value = '';
        }
    };

    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    document.getElementById('sendMessageBtn').onclick = sendMessage;

    // Encryption/Decryption Functions
    const encryptMessage = (message) => btoa(message); // Base64 Encode
    const decryptMessage = (encryptedMessage) => atob(encryptedMessage); // Base64 Decode
};

window.closeChat = () => {
    document.getElementById('chatModal').style.display = 'none';
};

// Schedule Appointment
document.getElementById("schedule-btn").addEventListener("click", () => {
    const studentName = document.getElementById("student-name").value;
    const date = document.getElementById("appointment-date").value;
    const time = document.getElementById("appointment-time").value;

    if (!studentName || !date || !time) {
        alert("Please fill in all details");
        return;
    }

    const appointmentRef = push(ref(database, "appointments"));
    set(appointmentRef, {
        teacherId,
        studentName,
        date,
        time,
        status: "Pending"
    }).then(() => {
        alert("Appointment Scheduled Successfully");
    }).catch(error => console.error("Error scheduling appointment: ", error));
});

// ------------------------------------------------------------------------------------------------------------------------------------------------

// Approve/Cancel Appointments
const appointmentsList = document.getElementById("appointments-list tbody");
function loadAppointments() {
    onValue(ref(database, "appointments"), (snapshot) => {
        appointmentsList.innerHTML = "";
        let count = 1;
        snapshot.forEach(childSnapshot => {
            const appointment = childSnapshot.val();
            if (appointment.teacherId === teacherId) {
                const row = `
                <tr>
                    <td>${count++}</td>
                    <td>${appointment.studentName}</td>
                    <td>${appointment.date} at ${appointment.time}</td>
                    <td>
                        <button class="approvebtn" onclick="approveAppointment('${childSnapshot.key}')">Approve</button>
                        <button class="Cancelbtn" onclick="cancelAppointment('${childSnapshot.key}')">Cancel</button>
                    </td>
                </tr>`;
                appointmentsList.innerHTML += row;
            }
        });
    });
}
window.approveAppointment = (id) => {
    update(ref(database, `appointments/${id}`), { status: "Approved" });
    alert("Appointment is Approved!!!");
};
window.cancelAppointment = (id) => {
    remove(ref(database, `appointments/${id}`));
    alert("Appointment is Cancel!!!")
};

// -------------------------------------------------------------------------------------------------------------------------------------------------
// Logout Button
window.logout = function () {
    alert('Logging out...');
    window.location.href = "../index.html";
};

// Function to show a specific section and hide others
const showSection = (sectionId) => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
};

// Event listeners for navbar links
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        showSection(sectionId);
    });
});

showSection('schedule');
// -------------------------------------------------------------------------------------------------------------------------------------------------

// Load Data
document.addEventListener("DOMContentLoaded", () => {
    loadAppointments();
    loadStudentsForChat();
});


