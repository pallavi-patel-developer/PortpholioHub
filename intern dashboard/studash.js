
(function () {
  const progress = document.getElementById("progress");
  const text = document.getElementById("progress-text");
  if (!progress || !text) return;

  const r = 48;
  const perimeter = 2 * Math.PI * r; // ~302.4
  const targetPercent = 100;

  const start = perimeter;
  const end = perimeter * (1 - targetPercent / 100);

  const duration = 1100; // ms
  const fps = 60;
  const steps = Math.round(duration / (1000 / fps));
  let currentStep = 0;

  function animate() {
    currentStep++;
    const t = currentStep / steps;
    const eased = 1 - Math.pow(1 - t, 3);

    const offsetNow = start + (end - start) * eased;
    progress.style.strokeDashoffset = offsetNow;

    const numNow = Math.round(targetPercent * eased);
    text.textContent = numNow + "%";

    if (currentStep < steps) {
      requestAnimationFrame(animate);
    } else {
      progress.style.strokeDashoffset = end;
      text.textContent = targetPercent + "%";
    }
  }

  window.addEventListener("load", function () {
    progress.style.strokeDasharray = perimeter;
    progress.style.strokeDashoffset = start;
    setTimeout(() => requestAnimationFrame(animate), 260);
  });
})();

document.addEventListener('DOMContentLoaded', () => {

  // Handle OAuth token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token');
  if (tokenFromUrl) {
    localStorage.setItem('jwtToken', tokenFromUrl);
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const viewRoot = document.getElementById('view-root');
  const pageTitleEl = document.getElementById('page-title');
  const navLinks = document.querySelectorAll('.nav a[data-page]');
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const overlay = document.getElementById('overlay');

  const templates = {
    dashboard: document.getElementById('tpl-dashboard')?.content,
    jobs: document.getElementById('tpl-jobs')?.content,
  };

  const statusMap = {
    'Under Review': 'blue',
    'Interview Scheduled': 'purple',
    'Accepted': 'green',
    'Rejected': 'red',
    'Applied': 'grey',
    'default': 'grey'
  };

  function getStatusColor(status) {
    return statusMap[status] || statusMap['default'];
  }

  function formatDate(isoString) {
    if (!isoString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(isoString).toLocaleDateString('en-US', options);
  }

  async function fetchAppliedInternships() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error("You must be logged in to view your applications.");
    }
    const response = await fetch(`${process.env.BACKEND_URL}/myApplications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch applications. Status: ${response.status}`);
    }
    return await response.json();
  }

  function populateJobSummaryTable(applications) {
    const tableBody = viewRoot.querySelector('.job-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    if (!applications || applications.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">You have not applied to any internships yet.</td></tr>';
      return;
    }
    applications.forEach(app => {
      const internship = app.internshipId;
      if (!internship) return;
      const today = new Date();
      const deadline = internship.deadline ? new Date(internship.deadline) : null;
      let statusText = 'Open';
      let statusClass = 'status-open';
      if (!deadline || deadline < today) {
        statusText = 'Closed';
        statusClass = 'status-closed';
      }
      const rowHTML = `
        <tr>
          <td data-label="Job Title">${internship.title || 'N/A'}</td>
          <td data-label="Company">${internship.company || 'N/A'}</td>
          <td data-label="Applied On"><time datetime="${app.appliedOn.split('T')[0]}">${formatDate(app.appliedOn)}</time></td>
          <td data-label="Status" class="${statusClass}">${statusText}</td>
        </tr>
      `;
      tableBody.insertAdjacentHTML('beforeend', rowHTML);
    });
  }

  function populateStatusCards(applications) {
    const jobsList = viewRoot.querySelector('#jobs-list');
    if (!jobsList) return;
    jobsList.innerHTML = '';

    if (!applications || applications.length === 0) {
      jobsList.innerHTML = `<p style="text-align: center; padding: 2rem;">You haven't applied for any internships yet.</p>`;
      return;
    }

    applications.forEach(app => {
      const internship = app.internshipId;
      if (!internship) return;

      const status = app.status || 'Status Unknown';
      const colorClass = getStatusColor(status);

      const cardHTML = `
        <div class="job-card">
          <div class="job-info">
            <div class="job-title-line">${internship.title}</div>
            <div class="job-sub">${internship.company} • <time datetime="${app.appliedOn.split('T')[0]}">${formatDate(app.appliedOn)}</time></div>
            <div class="job-status"><span class="dot ${colorClass}"></span>${status}</div>
          </div>
          <button class="view-btn">View Details</button>
        </div>
      `;
      jobsList.insertAdjacentHTML('beforeend', cardHTML);
    });
  }

  function updateStatsCards(applications) {
    const appliedCountEl = viewRoot.querySelector('.stat-card:nth-child(1) .stat-number');
    const interviewCountEl = viewRoot.querySelector('.stat-card:nth-child(2) .stat-number');

    if (appliedCountEl) {
      appliedCountEl.textContent = applications.length;
    }

    if (interviewCountEl) {
      const interviewCount = applications.filter(app => app.status === 'Interview Scheduled').length;
      interviewCountEl.textContent = interviewCount;
    }
  }

  async function renderPage(pageId) {
    if (!templates[pageId]) {
      viewRoot.innerHTML = `<p class="error">Error: Could not load page content.</p>`;
      return;
    }
    viewRoot.innerHTML = '';
    viewRoot.appendChild(document.importNode(templates[pageId], true));
    const pageName = pageId === 'jobs' ? 'Internships' : pageId;
    pageTitleEl.textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1);

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageId);
      link.setAttribute('aria-current', link.dataset.page === pageId ? 'page' : 'false');
    });

    try {
      if (pageId === 'dashboard') {
        const tableBody = viewRoot.querySelector('.job-table tbody');
        if (tableBody) tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Loading applications...</td></tr>';

        const applications = await fetchAppliedInternships();
        populateJobSummaryTable(applications);
        updateStatsCards(applications);
      } else if (pageId === 'jobs') {
        const jobsList = viewRoot.querySelector('#jobs-list');
        if (jobsList) jobsList.innerHTML = `<p style="text-align: center; padding: 2rem;">Loading application statuses...</p>`;

        const applications = await fetchAppliedInternships();
        populateStatusCards(applications);
      }
    } catch (error) {
      if (pageId === 'dashboard') {
        viewRoot.querySelector('.job-table tbody').innerHTML = `<tr><td colspan="4" style="text-align: center;">${error.message}</td></tr>`;
      } else if (pageId === 'jobs') {
        viewRoot.querySelector('#jobs-list').innerHTML = `<p class="error" style="text-align: center; padding: 2rem;">${error.message}</p>`;
      }
    }
  }

  function setupEventListeners() {
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = e.currentTarget.dataset.page;
        if (pageId) {
          renderPage(pageId);
        }
      });
    });

    const toggleSidebar = () => {
      const isExpanded = sidebar.classList.toggle('open');
      sidebarToggle.setAttribute('aria-expanded', isExpanded);
      overlay.classList.toggle('show');
    };
    sidebarToggle.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
  }

  function init() {
    setupEventListeners();
    renderPage('dashboard');
  }

  init();
});

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) throw new Error("No token found");

    const res = await fetch(`${process.env.BACKEND_URL}/profile`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const result = await res.json();
    const user = result;

    document.getElementById("user-name").textContent = user.fullName || "Guest";

    const photoPath = user.photo
      ? user.photo
      : "../resources/Generative_Object.png";
    document.getElementById("user-photo").src = photoPath;

  } catch (err) {
    document.getElementById("user-name").textContent = "Guest";
    document.getElementById("user-photo").src = "../resources/Generative_Object.png";
  }
});
