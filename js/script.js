// Toggle Password Visibility
function TogglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
}
const navigate = (page) => window.location.href = `${page}.html`;
const adminLogin = () => navigate('adminLogin');
const teacherLogin = () => navigate('teacherLogin');
const studentLogin = () => navigate('studentLogin');
const studentRegister = () => navigate('studentRegister');