// Initialize
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = localStorage.getItem('currentUser');

// Check if user is already logged in
if (currentUser) {
    document.getElementById('userName').textContent = currentUser;
    showPage('home');
}

function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    if (page === 'signup') {
        document.getElementById('signupPage').classList.add('active');
        clearInputs('signup');
        hideAlert('signupAlert');
    } else if (page === 'login') {
        document.getElementById('loginPage').classList.add('active');
        clearInputs('login');
        hideAlert('loginAlert');
    } else if (page === 'home') {
        document.getElementById('homePage').classList.add('active');
    }
}

function clearInputs(page) {
    if (page === 'signup') {
        document.getElementById('signupName').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';
    } else if (page === 'login') {
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
    }
}

function showAlert(elementId, message, type) {
    const alert = document.getElementById(elementId);
    alert.textContent = message;
    alert.className = 'alert show alert-' + type;
}

function hideAlert(elementId) {
    document.getElementById(elementId).className = 'alert';
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function signup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    hideAlert('signupAlert');

    if (!name) {
        showAlert('signupAlert', 'Please enter your name', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showAlert('signupAlert', 'Please enter a valid email', 'error');
        return;
    }

    if (password.length < 6) {
        showAlert('signupAlert', 'Password must be at least 6 characters', 'error');
        return;
    }

    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
        showAlert('signupAlert', 'Email already exists, please use another email', 'error');
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    showAlert('signupAlert', 'Registration successful! Redirecting to login...', 'success');
    
    setTimeout(() => {
        showPage('login');
    }, 1500);
}

function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    hideAlert('loginAlert');

    if (!validateEmail(email)) {
        showAlert('loginAlert', 'Please enter a valid email', 'error');
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        showAlert('loginAlert', 'Email not registered', 'error');
        return;
    }

    if (user.password !== password) {
        showAlert('loginAlert', 'Incorrect password', 'error');
        return;
    }

    localStorage.setItem('currentUser', user.name);
    document.getElementById('userName').textContent = user.name;
    
    showAlert('loginAlert', 'Login successful!', 'success');
    
    setTimeout(() => {
        showPage('home');
    }, 1000);
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showPage('login');
}

// Add Enter key support
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (document.getElementById('signupPage').classList.contains('active')) {
            signup();
        } else if (document.getElementById('loginPage').classList.contains('active')) {
            login();
        }
    }
});