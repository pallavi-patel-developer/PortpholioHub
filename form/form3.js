function previewImage(inputId, previewId) {
  const input = document.getElementById(inputId);
  const previewBox = document.getElementById(previewId);

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewBox.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 15px;" />`;
      };
      reader.readAsDataURL(file);
    }
  });
}

previewImage("photo1", "preview1");
previewImage("photo2", "preview2");
previewImage("photo3", "preview3");

function showAlert(message, type = "success") {
  const alertBox = document.getElementById("alertBox");
  alertBox.innerText = message;
  alertBox.className = `alert ${type} show`;
  alertBox.style.display = "block";
  setTimeout(() => {
    alertBox.classList.remove("show");
    alertBox.style.display = "none";
  }, 4000);
}

document.querySelector(".save-btn").addEventListener("click", function (e) {
  e.preventDefault();

  const projectBlocks = document.querySelectorAll(".work-block");
  const workArray = [];

  projectBlocks.forEach((block, i) => {
    const name = block.querySelector(`input[name="name${i + 1}"]`)?.value.trim();
    const description = block.querySelector(`input[name="description${i + 1}"]`)?.value.trim();
    const link = block.querySelector(`input[name="link${i + 1}"]`)?.value.trim();
    const photo = block.querySelector(`input[name="photo${i + 1}"]`)?.files[0];

    if (name && description) {
      const projectData = { name, description, link };

      if (photo) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          projectData.photoDataURL = evt.target.result;
        };
        reader.readAsDataURL(photo);
      }

      workArray.push(projectData);
    }
  });

  if (workArray.length < 2) {
    return showAlert("Please add at least two valid projects", "error");
  }

  setTimeout(() => {
    try {
      sessionStorage.setItem('portfolioStep3', JSON.stringify({ projects: workArray }));
      window.location.href = "form4.html";
    } catch (error) {
      showAlert("An error occurred while saving your progress.", "error");
    }
  }, 300);
});
