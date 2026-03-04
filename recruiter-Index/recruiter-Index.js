const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
     hamburger.addEventListener('click', () => {
          navLinks.classList.toggle('active');
     });
}

const observer = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
          if (entry.isIntersecting) {
               entry.target.classList.add('in-view');
          }
     });
}, {
     threshold: 0.2
});

if (document.querySelectorAll('.hiw-step')) {
     document.querySelectorAll('.hiw-step').forEach(step => {
          observer.observe(step);
     });
}

if (document.querySelectorAll('.dropdown > button')) {
     document.querySelectorAll('.dropdown > button').forEach(button => {
          button.addEventListener('click', (e) => {
               e.stopPropagation();
               document.querySelectorAll('.dropdown-content').forEach(menu => {
                    if (menu !== button.nextElementSibling) menu.style.display = 'none';
               });
               const dropdownMenu = button.nextElementSibling;
               dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
          });
     });
}

document.addEventListener('click', () => {
     document.querySelectorAll('.dropdown-content').forEach(menu => {
          menu.style.display = 'none';
     });
});

if (document.querySelector('.pagination')) {
     document.querySelectorAll('.pagination a').forEach(button => {
          button.addEventListener('click', () => {
               document.querySelectorAll('.pagination a').forEach(btn => btn.classList.remove('active'));
               button.classList.add('active');
          });
     });
}

if (document.querySelector('.filters')) {
     document.querySelector('.filters').addEventListener('click', function (e) {
          if (window.innerWidth <= 660 && e.target === this) {
               this.classList.toggle('show');
          }
     });
}

(function () {
     const scrollObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
               if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    scrollObserver.unobserve(entry.target);
               }
          });
     }, {
          threshold: 0.1
     });

     if (document.querySelectorAll('.animate-on-scroll')) {
          document.querySelectorAll('.animate-on-scroll').forEach((el) => scrollObserver.observe(el));
     }
})();

(function () {
     const testimonialObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
               if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    testimonialObserver.unobserve(entry.target);
               }
          });
     }, {
          threshold: 0.1
     });

     if (document.querySelectorAll('.animate-on-scroll')) {
          document.querySelectorAll('.animate-on-scroll').forEach(el => testimonialObserver.observe(el));
     }
})();

var crsr = document.querySelector("#cursor");
var blur = document.querySelector("#cursorblur");

if (crsr && blur) {
     document.addEventListener("mousemove", function (dets) {
          crsr.style.left = dets.x + "px";
          crsr.style.top = dets.y + "px";
          blur.style.left = dets.x - 250 + "px";
          blur.style.top = dets.y - 250 + "px";
     });
}


function showAlert(message, type = "success") {
     let alertBox = document.getElementById("alertBox");
     if (!alertBox) {
          alertBox = document.createElement("div");
          alertBox.id = "alertBox";
          alertBox.style.cssText = `
               position: fixed;
               top: 20px;
               right: 20px;
               padding: 15px 20px;
               border-radius: 5px;
               color: white;
               z-index: 10000;
               display: none;
               max-width: 300px;
          `;
          document.body.appendChild(alertBox);
     }

     alertBox.innerText = message;
     alertBox.className = `alert ${type}`;
     alertBox.style.display = "block";
     alertBox.style.backgroundColor = type === "success" ? "#4CAF50" : type === "info" ? "#2196F3" : "#f44336";

     setTimeout(() => {
          alertBox.style.display = "none";
     }, 4000);
}

const grid = document.getElementById("profileGrid");
const paginationDiv = document.getElementById("pagination");
const API_URL = `${process.env.BACKEND_URL}/recruiter/profiles`;

async function fetchProfiles(page = 1) {
     try {
          const res = await fetch(`${API_URL}?page=${page}`);
          const data = await res.json();

          renderProfiles(data.profiles);
          renderPagination(data.totalPages, data.currentPage);
     } catch (err) {
     }
}

function renderProfiles(profiles) {
     grid.innerHTML = "";
     const fragment = document.createDocumentFragment();

     profiles.forEach(profile => {
          const card = document.createElement("div");
          card.classList.add("card");

          card.innerHTML = `
               <div class="card-header">
                    <img src="${profile.photo || '/resources/default-avatar.png'}" alt="Profile" class="profile-pic">
                    <h3>${profile.fullName || "Unknown"}</h3>
               </div>
               <p>${profile.role || "Role Not Provided"} | ${profile.city || "Location"}</p>
               <p>${profile.aboutMe || "No bio available."}</p>
               <div class="skills">
                    ${profile.skills?.map(skill => `<div class="skill">${skill.name}</div>`).join("") || "No skills listed."}
               </div>
               <div class="portfolio">
                    <button data-portfolio-id="${profile._id}" class="portfolio-btn protected-link">View Portfolio</button>
               </div>
          `;
          fragment.appendChild(card);
     });
     grid.appendChild(fragment);
}


grid.addEventListener('click', function (event) {
     if (event.target.classList.contains('portfolio-btn')) {
          const token = localStorage.getItem('jwtToken');
          if (!token) {
               showAlert("Login first to access this feature", "error");
               return;
          }

          const portfolioId = event.target.dataset.portfolioId;
          if (portfolioId) {
               window.location.href = `../portfolio-viewer.html?id=${portfolioId}`;
          }
     }
});


function renderPagination(totalPages, currentPage) {
     paginationDiv.innerHTML = "";
     for (let i = 1; i <= totalPages; i++) {
          const pageLink = document.createElement("a");
          pageLink.href = "#";
          pageLink.textContent = i;
          if (i === currentPage) pageLink.classList.add("active");

          pageLink.addEventListener("click", (e) => {
               e.preventDefault();
               fetchProfiles(i);
          });
          paginationDiv.appendChild(pageLink);
     }

     if (currentPage < totalPages) {
          const next = document.createElement("a");
          next.href = "#";
          next.innerHTML = `<i class="ri-arrow-drop-right-line"></i>`;
          next.addEventListener("click", (e) => {
               e.preventDefault();
               fetchProfiles(currentPage + 1);
          });
          paginationDiv.appendChild(next);
     }
}

fetchProfiles(1);


document.addEventListener("DOMContentLoaded", () => {
     const authLinks = document.getElementById("auth-links");
     const logoutBtn = document.getElementById("logout-btn");

     // Handle OAuth token from URL
     const urlParams = new URLSearchParams(window.location.search);
     const tokenFromUrl = urlParams.get('token');
     if (tokenFromUrl) {
          localStorage.setItem('jwtToken', tokenFromUrl);
          window.history.replaceState({}, document.title, window.location.pathname);
     }

     const token = localStorage.getItem('jwtToken');

     if (token) {
          fetch(`${process.env.BACKEND_URL}/recruiter/me`, {
               method: "GET",
               headers: {
                    'Authorization': `Bearer ${token}`
               }
          })
               .then(res => {
                    if (!res.ok) {
                         localStorage.removeItem('jwtToken');
                         throw new Error('Token validation failed. Logging out.');
                    }
                    return res.json();
               })
               .then(data => {
                    if (data.authenticated) {
                         authLinks.style.display = "none";
                         logoutBtn.style.display = "inline-block";
                    } else {
                         localStorage.removeItem('jwtToken');
                         authLinks.style.display = "inline-block";
                         logoutBtn.style.display = "none";
                    }
               })
               .catch(err => {
                    authLinks.style.display = "inline-block";
                    logoutBtn.style.display = "none";
               });
     } else {
          authLinks.style.display = "inline-block";
          logoutBtn.style.display = "none";
     }

     logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          if (window.confirm("Do you want to logout from PortfolioHub?")) {
               localStorage.removeItem('jwtToken');
               window.location.reload();
          }
     });
});



