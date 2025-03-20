// DOM Elements
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginContainer = document.getElementById("login-container");
const registerContainer = document.getElementById("register-container");
const messageDiv = document.getElementById('message');
const logoutBtn = document.getElementById('logout-btn');
const registerLink = document.getElementById("register-link");
const main = document.getElementById('main');
const backToLoginLink = document.getElementById("back-to-login");

// Utility Functions
function generateID() {
    return Date.now();
}

function setLoggedInUser(user) {
    localStorage.setItem("loggedUser", JSON.stringify(user));
}

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedUser"));
}

function logout() {
    localStorage.removeItem("loggedUser");
    loginForm.reset();
    registerForm.reset();
    loginContainer.style.display = "block";
    registerContainer.style.display = "none";
    main.style.display = "none";
    displayMessage('Logged out successfully!');
}

// User Class
class User {
    constructor(firstname, lastname, email, password) {
        this.id = generateID();
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }
}

// Data Handling
let users = [];

function loadUsers() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers).map(user => 
            new User(user.firstname, user.lastname, user.email, user.password)
        );
    } else {
        // Default users
        users = [
            new User('Frank', 'Lampard', 'cfc_legend@cfc.com', 'london'),
            new User('Ashley', 'Cole', 'a.cole@cfc.com', 'rightfoot')
        ];
        saveUsers();
    }
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Auth Functions
async function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!email || !password) {
                reject({ message: "All fields are required" });
                return;
            }
            const userFound = users.find(user => 
                user.email === email && user.password === password
            );
            userFound ? resolve(userFound) : reject({ message: "Invalid credentials" });
        }, 1000);
    });
}

async function registerUser(firstname, lastname, email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!firstname || !lastname || !email || !password) {
                reject({ message: "All fields are required" });
                return;
            }
            if (users.some(user => user.email === email)) {
                reject({ message: `User with ${email} already exists` });
                return;
            }
            const newUser = new User(firstname, lastname, email, password);
            users.push(newUser);
            saveUsers();
            resolve({ message: "Registration successful!" });
        }, 1000);
    });
}

// UI Functions
function displayMessage(message, isError = false) {
    messageDiv.style.display = "block";
    messageDiv.textContent = message;
    messageDiv.className = isError ? "error" : "success";
    setTimeout(() => {
        messageDiv.style.display = "none";
    }, 2000);
}

// Initialization & Event Listeners
(() => {
    loadUsers(); // Load users from localStorage
    
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
        loginContainer.style.display = "none";
        main.style.display = "flex";
        displayMessage(`Welcome back ${loggedInUser.firstname}!`);
    }

    // Login Form
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            const user = await loginUser(
                document.getElementById('login-email').value,
                document.getElementById('login-password').value
            );
            loginContainer.style.display = "none";
            main.style.display = "flex";
            loginForm.reset();
            setLoggedInUser(user);
            displayMessage(`Welcome ${user.firstname}!`);
        } catch (error) {
            displayMessage(error.message, true);
        }
    });

    // Register Form
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            const result = await registerUser(
                document.getElementById('register-firstname').value,
                document.getElementById('register-lastname').value,
                document.getElementById('register-email').value,
                document.getElementById('register-password').value
            );
            displayMessage(result.message);
            registerContainer.style.display = "none";
            loginContainer.style.display = "block";
            registerForm.reset();
        } catch (error) {
            displayMessage(error.message, true);
        }
    });

    // Navigation
    registerLink.addEventListener("click", () => {
        loginContainer.style.display = "none";
        registerContainer.style.display = "block";
    });

    backToLoginLink.addEventListener("click", () => {
        registerContainer.style.display = "none";
        loginContainer.style.display = "block";
    });

    // Logout
    logoutBtn.addEventListener('click', logout);
})();