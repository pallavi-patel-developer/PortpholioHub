const form2 = document.getElementById('form2');
const saveBtn2 = document.querySelector(".save-btn");
const alertBox2 = document.getElementById("alertBox");

function showAlert(message, type = "error") {
    alertBox2.innerText = message;
    alertBox2.className = `alert ${type} show`;
    setTimeout(() => { alertBox2.className = `alert ${type}`; }, 4000);
}

form2.addEventListener("submit", function (e) {
    e.preventDefault();

    const skills = [];
    document.querySelectorAll(".skill-pair").forEach(pair => {
        const name = pair.querySelectorAll("input")[0]?.value.trim();
        const description = pair.querySelectorAll("input")[1]?.value.trim();
        if (name) skills.push({ name, description });
    });

    const experience = [];
    document.querySelectorAll(".experience-row").forEach(row => {
        const role = row.querySelector("input[name='role']")?.value.trim();
        const company = row.querySelector("input[name='company']")?.value.trim();
        const start = row.querySelector("input[name='start']")?.value.trim();
        const end = row.querySelector("input[name='end']")?.value.trim();
        if (role && company) experience.push({ role, company, start, end });
    });

    const step2Data = {
        skills: skills,
        experience: experience
    };

    try {
        sessionStorage.setItem('portfolioStep2', JSON.stringify(step2Data));
        window.location.href = "form3.html";

    } catch (error) {
        showAlert("An error occurred while saving your progress. Please try again.", "error");
    }
});