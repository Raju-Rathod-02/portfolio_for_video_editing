// Authentication System
class AuthManager {
    constructor() {
        this.adminEmail = 'admin@raju.com';
        this.adminPassword = this.hashPassword('admin123'); // Change this in production!
        this.sessionKey = 'adminSession';
        this.initializeDefaults();
    }

    initializeDefaults() {
        // Check if defaults exist, if not create them
        if (!localStorage.getItem('adminCredentials')) {
            localStorage.setItem('adminCredentials', JSON.stringify({
                email: this.adminEmail,
                password: this.adminPassword
            }));
        }
    }

    // Simple hash function (for demo - use bcrypt in production!)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    // Login
    login(email, password) {
        const credentials = JSON.parse(localStorage.getItem('adminCredentials'));
        
        if (email === credentials.email && this.hashPassword(password) === credentials.password) {
            const session = {
                email: email,
                token: this.generateToken(),
                loginTime: new Date().getTime(),
                expiresIn: 24 * 60 * 60 * 1000 // 24 hours
            };
            
            localStorage.setItem(this.sessionKey, JSON.stringify(session));
            return { success: true, message: 'Login successful!' };
        }
        
        return { success: false, message: 'Invalid email or password!' };
    }

    // Generate random token
    generateToken() {
        return Math.random().toString(36).substr(2) + Date.now().toString(36);
    }

    // Check if user is logged in
    isLoggedIn() {
        const session = localStorage.getItem(this.sessionKey);
        
        if (!session) return false;

        try {
            const parsed = JSON.parse(session);
            const now = new Date().getTime();
            
            if (now - parsed.loginTime > parsed.expiresIn) {
                this.logout();
                return false;
            }
            
            return true;
        } catch (e) {
            return false;
        }
    }

    // Get current session
    getSession() {
        return JSON.parse(localStorage.getItem(this.sessionKey));
    }

    // Logout
    logout() {
        localStorage.removeItem(this.sessionKey);
    }

    // Change password
    changePassword(oldPassword, newPassword) {
        const credentials = JSON.parse(localStorage.getItem('adminCredentials'));
        
        if (this.hashPassword(oldPassword) === credentials.password) {
            credentials.password = this.hashPassword(newPassword);
            localStorage.setItem('adminCredentials', JSON.stringify(credentials));
            return { success: true, message: 'Password changed successfully!' };
        }
        
        return { success: false, message: 'Incorrect current password!' };
    }
}

// Initialize auth manager
window.auth = new AuthManager();

// Get base path function
function getBaseAdminPath() {
    if (window.location.href.includes('admin/')) {
        return './';
    }
    return '../admin/';
}

// Login form handling
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const href = window.location.href;
    
    // Check if should auto-redirect on login page
    if ((href.includes('login.html') || href.includes('admin/login')) && auth.isLoggedIn()) {
        window.location.href = getBaseAdminPath() + 'index.html';
    }

    // Redirect to login if not authenticated and on admin page  
    if ((href.includes('admin/index') || (href.includes('admin/') && !href.includes('login'))) && !auth.isLoggedIn()) {
        window.location.href = getBaseAdminPath() + 'login.html';
    }
});

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Clear previous errors
    document.getElementById('email-error').classList.remove('show');
    document.getElementById('password-error').classList.remove('show');
    document.getElementById('login-error').classList.remove('show');

    // Validate
    if (!email) {
        document.getElementById('email-error').textContent = 'Email is required';
        document.getElementById('email-error').classList.add('show');
        return;
    }

    if (!password) {
        document.getElementById('password-error').textContent = 'Password is required';
        document.getElementById('password-error').classList.add('show');
        return;
    }

    // Attempt login
    const result = auth.login(email, password);

    if (result.success) {
        // Store remember preference
        if (remember) {
            localStorage.setItem('rememberEmail', email);
        } else {
            localStorage.removeItem('rememberEmail');
        }
        
        // Redirect to admin panel using relative path
        setTimeout(() => {
            window.location.href = './index.html';
        }, 300);
    } else {
        document.getElementById('login-error').textContent = result.message;
        document.getElementById('login-error').classList.add('show');
        
        // Clear password field
        document.getElementById('password').value = '';
    }
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const icon = event.target;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Pre-fill email if remembered
const rememberedEmail = localStorage.getItem('rememberEmail');
if (rememberedEmail && document.getElementById('email')) {
    document.getElementById('email').value = rememberedEmail;
    document.getElementById('remember').checked = true;
}

// Logout function - Production Ready
function logoutUser() {
    if (!confirm('Are you sure you want to logout?')) {
        return;
    }

    try {
        auth.logout();
        
        // Use location.replace instead of href to prevent back button issues
        const basePath = getBaseAdminPath();
        const loginPath = basePath + 'login.html';
        
        setTimeout(() => {
            window.location.replace(loginPath);
        }, 200);
    } catch(e) {
        console.error('Logout error:', e);
        window.location.replace('login.html');
    }
}

// Session timeout check for admin pages
if (auth && auth.isLoggedIn() && (window.location.href.includes('admin/index'))) {
    const checkInterval = 60 * 1000; // Check every minute
    
    setInterval(() => {
        if (!auth.isLoggedIn()) {
            alert('Your session has expired. Please login again.');
            window.location.replace(getBaseAdminPath() + 'login.html');
        }
    }, checkInterval);
}
