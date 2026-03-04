document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm.querySelector('.save-btn');
    const alertBox = document.getElementById('alertBox');

    function showAlert(message, type = "error") {
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`;
        alertBox.style.display = 'block';
        setTimeout(() => { alertBox.style.display = 'none'; }, 4000);
    }

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('jwtToken');
        if (!token) return showAlert('Error: You are not logged in.', 'error');

        const finalFormData = new FormData(contactForm);

        const step1Data = JSON.parse(sessionStorage.getItem('portfolioStep1') || '{}');
        const step2Data = JSON.parse(sessionStorage.getItem('portfolioStep2') || '{}');
        const step3Data = JSON.parse(sessionStorage.getItem('portfolioStep3') || '{}');

        finalFormData.append('fullName', step1Data.fullName);
        finalFormData.append('role', step1Data.role);
        finalFormData.append('city', step1Data.city);
        finalFormData.append('dob', step1Data.dob);
        finalFormData.append('gender', step1Data.gender);
        finalFormData.append('aboutMe', step1Data.aboutMe);

        finalFormData.append('education', JSON.stringify(step1Data.education || []));
        finalFormData.append('skills', JSON.stringify(step2Data.skills || []));
        finalFormData.append('experience', JSON.stringify(step2Data.experience || []));
        finalFormData.append('projects', JSON.stringify(step3Data.projects || []));

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            const response = await fetch(`${process.env.BACKEND_URL}/forms`, {
                method: 'POST',
                body: finalFormData,
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const result = await response.json();
            if (response.ok) {
                showAlert('Portfolio created successfully!', 'success');
                sessionStorage.clear();
                setTimeout(() => { window.location.href = '../index.html'; }, 2000);
            } else {
                showAlert(result.message || 'An error occurred.', 'error');
            }
        } catch (error) {
            showAlert("A network error occurred.", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Portfolio';
        }
    });


});