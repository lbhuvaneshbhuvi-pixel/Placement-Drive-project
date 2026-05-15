document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const logoutBtn = document.getElementById('logout-btn');
    const adminName = document.getElementById('admin-name');
    // login logic
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const data = await api.login({ email, password });
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.name);
                window.location.href = 'index.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }
    // signup logic
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const data = await api.signup({ name, email, password });
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.name);
                window.location.href = 'index.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }
    // logout logic
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await api.logout();
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                window.location.href = 'login.html';
            } catch (error) {
                console.error(error);
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                window.location.href = 'login.html';
            }
        });
    }
    // set the admin name in header or kick them out if no token
    if (adminName) {
        const userName = localStorage.getItem('userName');
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = 'login.html';
        } else {
            adminName.textContent = userName;
        }
    }
});
