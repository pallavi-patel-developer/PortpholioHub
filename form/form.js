const form = document.getElementById('portfolio-form');
const saveBtn = document.getElementById('saveBtn');
const alertBox = document.getElementById('alertBox');

function showAlert(message, type = "error") {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
    alertBox.style.display = 'block';
    setTimeout(() => { alertBox.style.display = 'none'; }, 4000);
}

form.addEventListener('click', (event) => {
    event.preventDefault();

    const step1Data = {
        fullName: form.querySelector('#fullName')?.value || '',
        role: form.querySelector('#role')?.value || '',
        city: form.querySelector('#city')?.value || '',
        dob: form.querySelector('#dob')?.value || '',
        gender: form.querySelector('input[name="gender"]:checked')?.value || '',
        aboutMe: form.querySelector('#aboutMe')?.value || ''
    };

    const educationArray = [];
    document.querySelectorAll('.education-block').forEach(block => {
        const degree = block.querySelector('.eduDegree')?.value || '';
        const college = block.querySelector('.eduCollege')?.value || '';
        const year = block.querySelector('.eduYear')?.value || '';
        if (degree && college && year) {
            educationArray.push({ degree, college, year });
        }
    });
    step1Data.education = educationArray;

    if (!step1Data.fullName.trim()) {
        return showAlert('Full Name is required.', 'error');
    }
    if (step1Data.education.length === 0) {
        return showAlert('Please fill out at least one education entry.', 'error');
    }

    try {
        sessionStorage.setItem('portfolioStep1', JSON.stringify(step1Data));
        window.location.href = '/form/form2.html';
    } catch (error) {
        showAlert("An error occurred while saving your progress.", "error");
    }
});