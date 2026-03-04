const pages = {
  dashboard: `
    <div class="topbar"><div class="page-title">Dashboard</div></div>
    <div class="hero">
      <div class="hero-left"><h1 class="greeting">Welcome</h1><p class="subtext">Here is your job listing statistic report of the company.</p></div>
      <img src="recruitdash.png" alt="Dashboard Illustration">
    </div>
    <div class="stats-row">
      <div class="stat-card">
      <div class="stat-icon">
      <i class="fa-solid fa-briefcase"></i>
      </div>
      <div>
      <div class="stat-number applications">0</div>
      <div class="stat-label">Applications Received</div>
      </div>
      </div>
      <div class="stat-card">
      <div class="stat-icon">
      <i class="fa-solid fa-briefcase"></i>
      </div>
      <div>
      <div class="stat-number jobs">0</div>
      <div class="stat-label">Total Job Post</div>
      </div>
      </div>
    </div>
    <div class="content-grid">
      <div class="chart-card"><div class="section-title" style="font-size:22px;font-weight:700;">Company Statistics</div><canvas id="barChart"></canvas></div>
      <aside class="right-col">
        <div class="progress-card">
        <div class="progress-title">Most Applied Job</div>
        <div class="progress-sub">Frontend Intern</div>
        <div class="progress-value">12</div>
        </div>
        <div class="progress-card">
        <div class="progress-title">Applicant Summary</div>
        <canvas id="pieChart"></canvas></div>
      </aside>
    </div>
  `,
  "all-applicants": `
  <div class="topbar">
    <div class="page-title">All Applicants</div>
    <div style="color:var(--muted);font-size:14px;">100+ Candidates</div>
  </div>

  <!-- Filters -->
  <div class="filters">
    <div class="dropdown" data-filter="location">
      <button>Location ▼</button>
      <div class="dropdown-content">
        <a href="#">All</a>
        <a href="#">Remote</a>
        <a href="#">Onsite</a>
        <a href="#">Freelance</a>
      </div>
    </div>
    <div class="dropdown" data-filter="industry">
      <button>Industry ▼</button>
      <div class="dropdown-content">
        <a href="#">All</a>
        <a href="#">Software</a>
        <a href="#">Design</a>
        <a href="#">Content</a>
      </div>
    </div>
    <div class="dropdown" data-filter="experience">
      <button>Experience ▼</button>
      <div class="dropdown-content">
        <a href="#">All</a>
        <a href="#">Junior</a>
        <a href="#">Mid</a>
        <a href="#">Senior</a>
      </div>
    </div>
    <div class="dropdown" data-filter="skills">
      <button>Skills ▼</button>
      <div class="dropdown-content">
        <a href="#">All</a>
        <a href="#">UI/UX</a>
        <a href="#">JavaScript</a>
        <a href="#">SEO</a>
      </div>
    </div>
    <div class="dropdown" data-filter="rate">
      <button>Rate ▼</button>
      <div class="dropdown-content">
        <a href="#">All</a>
        <a href="#">$40-$50</a>
        <a href="#">$51-$60</a>
      </div>
    </div>
    <div class="dropdown" data-filter="availability">
      <button>Availability ▼</button>
      <div class="dropdown-content">
        <a href="#">All</a>
        <a href="#">Full-time</a>
        <a href="#">Part-time</a>
      </div>
    </div>
  </div>

  <!-- Applicants Grid -->
  <div id="applicants-grid" class="grid"></div>

  <!-- Pagination -->
  <div class="pagination" id="pagination"></div>
  `,
  "job-listing": `
    <div class="topbar"><div class="page-title">Job Listing</div></div>
    <div class="hero">
      <div class="hero-left"><h1 class="greeting">Job Listing</h1></div>
  <!--    <img src="illustration.png" alt="Job Illustration">   -->
    </div>
    <div class="stats-row">
      <div class="stat-card">
      <div class="stat-icon"><i class="fa-solid fa-briefcase"></i></div>
      <div>
  <div class="stat-number applications">0</div>   
     <div class="stat-label">Applications Received</div>
  </div>
  </div>
      <div class="stat-card">
      <div class="stat-icon"><i class="fa-solid fa-briefcase"></i>
      </div>
      <div>
          <div class="stat-number jobs">0</div>
          <div class="stat-label">Total Job Post</div>
      </div>

      </div>
    </div>
    <div class="chart-card"><div class="section-title" style="font-size:20px;">All Job Summary Table</div>
      <div class="table-scroll">
        <table class="job-table"  width="100%">
          <thead>
          <tr>
          <th>Job Title</th>
          <th>Location</th>
          <th>Posted On</th>
          <th>Applicants</th>
          <th>Status</th>
          <th>Actions</th>
          </tr>
          </thead>
          <tbody id="jobTableBody">
     
          <!--     

      <tr><td> </td><td> </td><td> </td><td class="status-open">Open</td><td> </td><td>✏️ 🗑</td></tr>
            <tr><td> </td><td> </td><td> </td><td class="status-closed">Closed</td><td> </td><td>✏️ 🗑</td></tr>
            <tr><td> </td><td> </td><td> </td><td class="status-open">Open</td><td> </td><td>✏️ 🗑</td></tr>
        </tbody>      

          -->

        </table>
      </div>
    </div>
  `,
  "post-job": `
    <div class="topbar postjob-topbar">
      <div class="page-title postjob-title">Post Job <i class="fa-solid fa-briefcase" style="font-size:22px;"></i></div>
    </div>

    <section class="postjob-wrap">
      <div class="postjob-card">
        <div class="field">
          <label class="field-label">Job Title</label>
          <input id="job-title" class="ui-input" type="text" placeholder="e.g., 'UI/UX Designer'">
        </div>
        <div class="form-row">
          <div class="field">
            <label class="field-label">Employment Type</label>
            <select id="employment-type" class="ui-input ui-select">
              <option selected disabled>Select type</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
            </select>
          </div>
          <div class="field">
            <label class="field-label">Job Category</label>
            <input id="job-category" class="ui-input" type="text" placeholder="e.g., Design, Development">
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label class="field-label">Experience Level</label>
            <select id="experience-level"  class="ui-input ui-select">
              <option selected disabled>Select experience</option>
              <option>Fresher</option>
              <option>Intermediate</option>
              <option>Senior</option>
            </select>
          </div>
          <div class="field">
            <label class="field-label">Duration</label>
            <select id="duration" class="ui-input ui-select">
              <option selected disabled>Select months</option>
              ${Array.from({ length: 12 }, (_, i) => `<option>${i + 1}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="field">
          <label class="field-label">Location</label>
          <input  id="location"  class="ui-input" type="text" placeholder="Enter City">
        </div>
        <div class="form-row">
          <div class="field">
            <label class="field-label">Stipend</label>
            <input id="stipend" class="ui-input" type="text" placeholder="Min/Max">
          </div>
          <div class="field">
            <label class="field-label">Work Type</label>
            <div class="worktype">
              <label class="radio"><input type="radio" name="worktype" checked><span>On-site</span></label>
              <label class="radio"><input type="radio" name="worktype"><span>Remote</span></label>
              <label class="radio"><input type="radio" name="worktype"><span>Hybrid</span></label>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="field-label">Job Description</label>
          <textarea id="job-description" class="ui-input ui-textarea" placeholder="Describe the role, daily tasks, company..."></textarea>
        </div>
        <div class="field">
          <label class="field-label">Required Skills</label>
          <div id="skills-container">
            <div class="inline-input">
              <input class="ui-input" type="text" placeholder="e.g., Figma">
              <button type="button" id="add-skill" class="icon-btn" aria-label="Add skill"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="field-label">Application Deadline</label>
          <input  id="deadline" class="ui-input" type="date" placeholder="Enter">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-primary">Post</button>
          <button type="button" class="btn btn-ghost-danger">Cancel</button>
        </div>
      </div>
    </section>
  `,
  message: `<div class="topbar"><div class="page-title">Message</div></div><p>Page under construction...</p>`
};

function loadPage(page) {
  const main = document.getElementById("main-content");
  main.innerHTML = pages[page] || "<p>Page not found</p>";

  if (page === "dashboard") initializeDashboard();
  if (page === "all-applicants") loadApplicants();
  if (page === "job-listing") loadJobListings();
}

function initCharts(jobDataByMonth = [], pieData = { accepted: 0, rejected: 0 }) { // Default to an empty array
  const barCtx = document.getElementById('barChart')?.getContext('2d');
  const maxDataValue = Math.max(...jobDataByMonth);
  const chartMax = maxDataValue > 0 ? maxDataValue + 3 : 5;
  if (barCtx) {
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          data: jobDataByMonth,
          backgroundColor: '#2f5fc1',
          borderRadius: 6
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 }, max: chartMax } },
        maintainAspectRatio: true,
        responsive: true
      }
    });
  }
  const pieCtx = document.getElementById('pieChart')?.getContext('2d');
  if (pieCtx) {
    new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: ['Accepted', 'Rejected'],
        datasets: [{ data: [pieData.accepted, pieData.rejected], backgroundColor: ['#2f5fc1', '#87b6ff'] }]
      },
      options: {
        plugins: { legend: { display: false } },
        maintainAspectRatio: true,
        responsive: true
      }
    });
  }
}

async function initializeDashboard() {
  try {
    const token = localStorage.getItem("jwtToken");
    const [jobsRes, applicantsRes] = await Promise.all([
      fetch(`${process.env.BACKEND_URL}/recruiter/jobs`, { headers: { "Authorization": `Bearer ${token}` } }),
      fetch(`${process.env.BACKEND_URL}/recruiter/applicants`, { headers: { "Authorization": `Bearer ${token}` } })
    ]);

    if (!jobsRes.ok) {
      throw new Error("Failed to fetch jobs for the dashboard.");
    }
    const jobs = await jobsRes.json();
    const applicants = applicantsRes.ok ? await applicantsRes.json() : [];

    const monthlyJobCounts = new Array(12).fill(0);

    let accepted = 0;
    let rejected = 0;

    applicants.forEach(app => {
      if (app.status === 'Accepted') accepted++;
      if (app.status === 'Rejected') rejected++;
    });

    jobs.forEach(job => {
      const postDate = new Date(job.createdAt);
      const month = postDate.getMonth();
      monthlyJobCounts[month]++;
    });

    const applicationsEl = document.querySelector('.stat-number.applications');
    const jobsEl = document.querySelector('.stat-number.jobs');
    if (applicationsEl) applicationsEl.textContent = applicants.length;
    if (jobsEl) jobsEl.textContent = jobs.length;

    initCharts(monthlyJobCounts, { accepted, rejected });

  } catch (error) {
    initCharts([], { accepted: 0, rejected: 0 });
  }
}


const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    loadPage(link.dataset.page);
    if (window.matchMedia('(max-width: 768px)').matches) document.body.classList.remove('sidebar-open');
  });
});

hamburger.addEventListener('click', () => document.body.classList.toggle('sidebar-open'));
scrim.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
window.addEventListener('resize', () => { if (window.innerWidth > 768) document.body.classList.remove('sidebar-open'); });

loadPage("dashboard");

document.addEventListener("click", function (e) {
  if (e.target.closest("#add-skill")) {
    const container = document.getElementById("skills-container");
    if (!container) return;
    const inputs = container.querySelectorAll(".inline-input");
    if (inputs.length < 3) {
      const newField = document.createElement("div");
      newField.className = "inline-input";
      newField.innerHTML = `
        <input class="ui-input" type="text" placeholder="e.g., Skill ${inputs.length + 1}">
        <button type="button" class="icon-btn remove-skill" aria-label="Remove skill"><i class="fa-solid fa-minus"></i></button>
      `;
      container.appendChild(newField);
    }
    if (container.querySelectorAll(".inline-input").length >= 3) {
      const addBtn = document.getElementById("add-skill");
      if (addBtn) addBtn.disabled = true;
    }
  }
  if (e.target.closest(".remove-skill")) {
    const container = document.getElementById("skills-container");
    e.target.closest(".inline-input").remove();
    const addBtn = document.getElementById("add-skill");
    if (addBtn) addBtn.disabled = (container.querySelectorAll('.inline-input').length >= 3);
  }
});

let allFetchedApplicants = [];
let filters = { location: "All", industry: "All", experience: "All", skills: "All", rate: "All", availability: "All" };
let currentPage = 1; const perPage = 6;

async function loadApplicants() {
  const grid = document.getElementById("applicants-grid");
  if (!grid) return;

  grid.innerHTML = "<p>Loading applicants...</p>";
  const token = localStorage.getItem("jwtToken");

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/recruiter/applicants`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("No applicants have applied to your jobs yet.");
    }

    const applications = await res.json();
    const validApplications = applications.filter(app => app.portfolio);
    allFetchedApplicants = validApplications.map(app => {
      return {
        applicationId: app.applicationId,
        status: app.status,
        jobTitle: app.jobTitle || "Unknown Job",
        userEmail: app.userEmail || "No Email Provided",
        appliedOn: app.appliedOn ? new Date(app.appliedOn).toLocaleDateString() : "Unknown Date",
        id: app.portfolio._id,
        name: app.portfolio.fullName,
        role: app.portfolio.role,
        location: app.portfolio.city,
        skills: app.portfolio.skills,
        img: app.portfolio.photo,
        industry: "Software",
        experience: "Mid",
        rate: "$40-$50",
        availability: "Full-time"
      };
    });

    if (allFetchedApplicants.length === 0) {
      grid.innerHTML = "<p>No one has applied to your job postings yet.</p>";
      document.getElementById("pagination").innerHTML = '';
      return;
    }

    renderApplicants();

  } catch (err) {
    grid.innerHTML = `<p class="error">${err.message}</p>`;
  }
}

function renderApplicants() {
  const grid = document.getElementById("applicants-grid");
  if (!grid) return;
  let filtered = allFetchedApplicants.filter(app => {
    return Object.keys(filters).every(f => {
      if (filters[f] === "All") return true;
      if (f === "skills") return app.skills.includes(filters[f]);
      return (app[f] || '').toLowerCase() === filters[f].toLowerCase();
    });
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  if (currentPage > totalPages) currentPage = 1;
  const start = (currentPage - 1) * perPage; const end = start + perPage;
  const pageItems = filtered.slice(start, end);
  const getStatusClass = (status) => {
    if (status === 'Accepted') return 'status-accepted';
    if (status === 'Rejected') return 'status-rejected';
    return 'status-review'; // for 'Under Review'
  };

  grid.innerHTML = pageItems.map(app => `
    <div class="card" id="application-${app.applicationId}">
      <div class="card-header">
        <img src="${app.img}" class="profile-pic" alt="${app.name}">
        <div>
          <h3>${app.name}</h3>
          <div class="role" style="margin-bottom: 4px;">${app.role} | ${app.location}</div>
          <div style="font-size: 13px; font-weight: 500; color: #2f5fc1;">Applied for: ${app.jobTitle}</div>
          <div style="font-size: 12px; color: #666; margin-top: 2px;">📧 ${app.userEmail}</div>
          <div style="font-size: 11px; color: #999; margin-top: 2px;">📅 Applied on: ${app.appliedOn}</div>
        </div>
        <div class="status-badge ${getStatusClass(app.status)}">${app.status}</div>
      </div>
      <div class="skills">${(Array.isArray(app.skills) ? app.skills : []).map(s => `<div class="skill">${s.name || s}</div>`).join('')}</div>
      <div class="actions">
        <button class="btn-view" data-portfolio-id="${app.id}">View Portfolio</button>
        <button class="btn-accept" data-application-id="${app.applicationId}">Accept</button>
        <button class="btn-reject" data-application-id="${app.applicationId}">Reject</button>
   
      </div>
    </div>
  `).join('');

  renderPagination(totalPages);
}

function renderPagination(total) {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;
  pagination.innerHTML = '';
  for (let i = 1; i <= total; i++) {
    pagination.innerHTML += `<a href="#" class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</a>`;
  }
}

async function updateApplicationStatus(applicationId, status) {
  const token = localStorage.getItem("jwtToken");
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/recruiter/applicants/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update status');
    }

    const card = document.getElementById(`application-${applicationId}`);
    const statusBadge = card.querySelector('.status-badge');
    statusBadge.textContent = status;
    statusBadge.className = 'status-badge'; // Reset classes
    if (status === 'Accepted') {
      statusBadge.classList.add('status-accepted');
    } else if (status === 'Rejected') {
      statusBadge.classList.add('status-rejected');
    } else {
      statusBadge.classList.add('status-review');
    }

  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

document.addEventListener("click", e => {
  if (e.target.closest(".dropdown-content a")) {
    e.preventDefault();
    const val = e.target.textContent.trim();
    const filterType = e.target.closest(".dropdown").dataset.filter;
    filters[filterType] = val;
    currentPage = 1;
    renderApplicants();
  }
  if (e.target.closest(".pagination a")) {
    e.preventDefault();
    currentPage = parseInt(e.target.dataset.page);
    renderApplicants();
  }

  if (e.target.matches('.btn-accept')) {
    const applicationId = e.target.dataset.applicationId;
    updateApplicationStatus(applicationId, 'Accepted');
  }

  if (e.target.matches('.btn-reject')) {
    const applicationId = e.target.dataset.applicationId;
    updateApplicationStatus(applicationId, 'Rejected');
  }

  if (e.target.matches('.btn-view')) {
    const portfolioId = e.target.dataset.portfolioId;
    if (portfolioId) {
      window.open(`../portfolio-viewer.html?id=${portfolioId}`, '_blank');
    }
  }

});

const token = localStorage.getItem("jwtToken");

document.addEventListener("click", async (e) => {
  if (e.target.closest(".btn-primary")) {
    const jobData = {
      title: document.querySelector("#job-title").value,
      employmentType: document.querySelector("#employment-type").value,
      category: document.querySelector("#job-category").value,
      experienceLevel: document.querySelector("#experience-level").value,
      duration: document.querySelector("#duration").value,
      location: document.querySelector("#location").value,
      stipend: document.querySelector("#stipend").value,
      workType: document.querySelector(".postjob-card input[name='worktype']:checked").nextElementSibling.textContent,
      description: document.querySelector("#job-description").value,
      skills: Array.from(document.querySelectorAll("#skills-container input[type='text']")).map(el => el.value).filter(Boolean),
      deadline: document.querySelector("#deadline").value
    };


    try {
      const res = await fetch(`${process.env.BACKEND_URL}/postJob`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      const data = await res.json();
      if (res.ok) {
        alert("Job posted successfully!");
        let jobCount = parseInt(localStorage.getItem("jobCount") || "0", 10);
        jobCount++;
        localStorage.setItem("jobCount", jobCount);

        // Redirect to "Job Listing" tab
        document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
        const jobTab = document.querySelector('.nav-link[data-page="job-listing"]');
        if (jobTab) jobTab.classList.add("active");

        loadPage("job-listing");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("Failed to post job");
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const jobCount = localStorage.getItem("jobCount") || 0;

  const jobCountEl = document.querySelector("#job-count");
  if (jobCountEl) {
    jobCountEl.textContent = jobCount;
  }
});

async function loadJobListings() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/recruiter/jobs`, {
      headers: { "Authorization": `Bearer ${token}` },
      credentials: "include"
    });
    const jobs = await res.json();

    if (!res.ok) {
      return;
    }

    if (!Array.isArray(jobs)) {
      return;
    }
    const tbody = document.getElementById("jobTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    let totalApplicants = 0;
    let totalJobs = jobs.length;

    jobs.forEach(job => {
      const tr = document.createElement("tr");
      const postedOn = new Date(job.createdAt).toLocaleDateString();

      let applicantCounts = JSON.parse(localStorage.getItem("applicantCounts")) || {};
      const count = Number(job.applicantCount) || applicantCounts[job._id] || 0;
      totalApplicants += count;

      const today = new Date();
      const deadline = job.deadline ? new Date(job.deadline) : null;

      let statusClass = "status-open";
      let statusText = "Open";

      if (deadline && deadline < today) {
        statusClass = "status-closed";
        statusText = "Closed";
      }

      tr.innerHTML = `
        <td>${job.title}</td>
        <td>${job.location}</td>
        <td>${postedOn}</td>
         <td>${count}</td>
    <td class="${statusClass}">${statusText}</td>
         <td>
    <button class="edit-btn" data-id="${job._id}">Edit</button>
    <button class="delete-btn" data-id="${job._id}">Delete</button>
  </td>
      `;
      tbody.appendChild(tr);
    });

    const jobAppsEl = document.querySelector(".stat-number.applications");
    const jobPostsEl = document.querySelector(".stat-number.jobs");

    if (jobAppsEl && jobPostsEl) {
      jobAppsEl.textContent = totalApplicants;
      jobPostsEl.textContent = totalJobs;
    }

    localStorage.setItem("totalApplicants", totalApplicants);
    localStorage.setItem("totalJobs", totalJobs);

  } catch (err) {
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadJobListings();
});

async function loadDashboardStats() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/recruiter/jobs`, {
      headers: { "Authorization": `Bearer ${token}` },
      credentials: "include"
    });
    const jobs = await res.json();
    if (!res.ok || !Array.isArray(jobs)) throw new Error(jobs.message || "Failed to fetch jobs");

    let totalApplicants = 0;
    const totalJobs = jobs.length;

    jobs.forEach(job => {
      const count = Array.isArray(job.applicants) ? job.applicants.length : Number(job.applicantCount) || 0;
      totalApplicants += count;
    });

    const dashApps = document.querySelector(".stat-number.dashboard-applications");
    const dashJobs = document.querySelector(".stat-number.dashboard-jobs");
    if (dashApps) dashApps.textContent = totalApplicants;
    if (dashJobs) dashJobs.textContent = totalJobs;

  } catch (err) {
  }
}


window.addEventListener("DOMContentLoaded", loadDashboardStats);

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const jobId = e.target.dataset.id;
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`${process.env.BACKEND_URL}/jobs/${jobId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) {
        alert("Job deleted");
        loadJobListings();
      } else {
        alert(data.message);
      }
    } catch (err) {
    }
  }

  if (e.target.classList.contains("edit-btn")) {
    const jobId = e.target.dataset.id;

    const newTitle = prompt("Enter new job title:");
    if (!newTitle) return;

    const newLocation = prompt("Enter new job location:");
    if (!newLocation) return;

    try {
      const res = await fetch(`${process.env.BACKEND_URL}/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle, location: newLocation })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Job updated successfully");
        loadJobListings();
      } else {
        alert(data.message);
      }
    } catch (err) {
    }
  }

});


