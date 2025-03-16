// Active Navbar
function showSection(section) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(s => s.style.display = 'none');
    document.getElementById(section).style.display = 'block';
    document.querySelectorAll('.navbar a').forEach(a => a.classList.remove('active'));
    document.querySelector(`.navbar a[onclick*="${section}"]`).classList.add('active');
}

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.display = sidebar.style.display === 'block' ? 'none' : 'block';
}

// Logout Button
function logout() {
    alert('Logging out...');
    window.location.href = "../index.html";
}

// Toggle Password Visibility
function TogglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
}
