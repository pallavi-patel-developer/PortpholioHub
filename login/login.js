document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
    const loginBtn = document.getElementById('login-btn');

    if (!loginForm) {
        return;
    }

    let isSubmitting = false;

    const hideMessage = () => {
        messageDiv.style.display = 'none';
        messageDiv.innerHTML = '';
    };

    const showSuccessMessage = (text) => {
        messageDiv.style.display = 'flex';
        messageDiv.innerHTML = `✅ ${text}`;
        messageDiv.style.cssText = `
            background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;
            padding: 12px 16px; margin-bottom: 15px; border-radius: 6px;
            font-family: sans-serif; font-size: 16px; font-weight: bold;
            display: flex; align-items: center; gap: 10px;
        `;
    };

    const showErrorMessage = (text) => {
        messageDiv.style.display = 'flex';
        messageDiv.innerHTML = `❌ ${text}`;
        messageDiv.style.cssText = `
            background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;
            padding: 12px 16px; margin-bottom: 15px; border-radius: 6px;
            font-family: sans-serif; font-size: 16px; font-weight: bold;
            display: flex; align-items: center; gap: 10px;
        `;
    };

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        isSubmitting = true;
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';
        hideMessage();

        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const responseText = await response.text();

            if (!responseText) {
                showErrorMessage("Received an empty response from server.");
                isSubmitting = false;
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
                return;
            }

            const result = JSON.parse(responseText);

            if (response.ok) {
                showSuccessMessage(result.message || "Login successful!");
                localStorage.setItem('jwtToken', result.token);

                setTimeout(() => {
                    if (result.userType === 'recruiter') {
                        window.location.href = "/recruiter-Index/recruiter-Index.html";;
                    } else {
                        window.location.href = '/';
                    }
                }, 1500);

            } else {
                showErrorMessage(result.message);
                isSubmitting = false;
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
            }

        } catch (error) {
            showErrorMessage('An error occurred. Please try again.');
            isSubmitting = false;
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    });
});
