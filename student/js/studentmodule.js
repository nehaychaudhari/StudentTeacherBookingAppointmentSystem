// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"; // set function added

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

// Student Email Id
const loggedInEmail = localStorage.getItem('loggedInEmail');
document.getElementById('loggedInUserEmail').innerText = `${loggedInEmail}`;

// Fetch Teacher Data
const fetchTeachers = async () => {
    const TeachersRef = ref(database, 'teachers/');
    onValue(TeachersRef, (snapshot) => {
        const data = snapshot.val();
        const tbody = document.getElementById('teacherTableBody');
        tbody.innerHTML = '';
        let index = 1;

        for (const id in data) {
            const Teacher = data[id];
            const row = `<tr>
                <td>${index++}</td>
                <td>${capitalizeFirstLetter(Teacher.name)}</td>
                <td>${Teacher.email}</td>
                <td>${capitalizeFirstLetter(Teacher.department)}</td>
                <td>${capitalizeFirstLetter(Teacher.subject)}</td>
                <td><button onclick="openChat('${id}', '${Teacher.name}')">Send Message</button></td>
            </tr>`;
            tbody.innerHTML += row;
        }
        setupPagination();
    });
};

window.openChat = (teacherEmail, teacherName) => {
    const chatModal = document.getElementById('chatModal');
    const chatTeacherName = document.getElementById('chatTeacherName');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');

    chatTeacherName.innerText = `${teacherName}`;
    console.log("Teacher Name: ", teacherName, "Teacher Id: ", teacherEmail);
    chatModal.style.display = 'block';

    // Load previous messages
    // const messagesRef = ref(database, `messages/${loggedInEmail}/${teacherEmail}`);
    // onValue(messagesRef, (snapshot) => {
    //     chatMessages.innerHTML = '';
    //     const messages = snapshot.val() || {};
    //     for (const key in messages) {
    //         const { sender, text } = messages[key];
    //         const decryptedMessage = decryptMessage(text);
    //         const messageDiv = document.createElement('div');
    //         messageDiv.className = sender === loggedInEmail ? 'student-message' : 'teacher-message';
    //         messageDiv.innerText = decryptedMessage;
    //         chatMessages.appendChild(messageDiv);
    //     }
    //     chatMessages.scrollTop = chatMessages.scrollHeight;
    // });

    const messagesRef = ref(database, `messages/${loggedInEmail}/${teacherEmail}`);
    onValue(messagesRef, (snapshot) => {
        chatMessages.innerHTML = '';
        const messages = snapshot.val() || {};
        for (const key in messages) {
            const { sender, text } = messages[key];
            const decryptedMessage = decryptMessage(text);
            const messageDiv = document.createElement('div');
            if (sender === loggedInEmail) {
                // Student's message
                messageDiv.className = 'student-message';
                messageDiv.innerText = decryptedMessage;
            } else {
                // Teacher's message
                messageDiv.className = 'teacher-message';
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
            const newMessageRef = push(ref(database, `messages/${loggedInEmail}/${teacherEmail}`));
            await set(newMessageRef, {
                sender: loggedInEmail,
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

    // Close chat modal
    const closeChat = () => {
        chatModal.style.display = 'none';
    };
    document.querySelector('.close').onclick = closeChat;

    // Encryption/Decryption Functions
    const encryptMessage = (message) => btoa(message); // Base64 Encode
    const decryptMessage = (encryptedMessage) => atob(encryptedMessage); // Base64 Decode
};

// Capitalize First Letter
const capitalizeFirstLetter = (string) => {
    return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Function to setup pagination
let currentPage = 1;
const recordsPerPage = 10;

window.setupPagination = () => {
    const tbody = document.getElementById('teacherTableBody');
    const rows = tbody.getElementsByTagName('tr');
    const totalRecords = rows.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const displayRecords = (page) => {
        const start = (page - 1) * recordsPerPage;
        const end = start + recordsPerPage;

        for (let i = 0; i < rows.length; i++) {
            rows[i].style.display = (i >= start && i < end) ? '' : 'none';
        }
    };

    const createPaginationButtons = () => {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.innerText = i;
            button.onclick = () => {
                currentPage = i;
                displayRecords(currentPage);
                updatePaginationButtons();
            };
            paginationContainer.appendChild(button);
        }
    };

    const updatePaginationButtons = () => {
        const buttons = document.querySelectorAll('#pagination button');
        buttons.forEach((button, index) => {
            button.disabled = (index + 1 === currentPage);
        });
    };

    displayRecords(currentPage);
    createPaginationButtons();
};

// Search functionality
window.searches = () => {
    const input = document.getElementById('searchBar').value.toLowerCase();
    const rows = document.querySelectorAll('#teacherTableBody tr');

    rows.forEach(row => {
        const cells = Array.from(row.cells);
        const matchFound = cells.some(cell => cell.textContent.toLowerCase().includes(input));
        row.style.display = matchFound ? '' : 'none';

        // Highlight matching text
        cells.forEach(cell => {
            const cellText = cell.textContent.toLowerCase();
            if (cellText.includes(input) && matchFound) {
                const highlightedText = cellText.replace(new RegExp(input, 'gi'), match => `<span style="background-color: yellow;">${match}</span>`);
                cell.innerHTML = highlightedText;
            } else {
                cell.innerHTML = cellText; // Reset to original text if not matching
            }
        });
    });
};

// Logout Button
window.logout = function () {
    alert('Logging out...');
    window.location.href = "../index.html";
};

// Call fetchTeachers on page load
window.onload = fetchTeachers;
