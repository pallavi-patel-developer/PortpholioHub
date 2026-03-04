let allJobs = [];

function applyFilters() {
  const workTypeValue = document.getElementById('workType').value;
  const experienceValue = document.getElementById('experience').value;
  const roleValue = document.getElementById('role').value;
  const stipendValue = document.getElementById('stipend').value;
  const durationValue = document.getElementById('duration').value;

  const filteredJobs = allJobs.filter(job => {
    if (!job) return false;

    const jobWorkType = job.workType ? job.workType.toLowerCase() : "";
    const jobExperience = job.experienceLevel ? job.experienceLevel.toLowerCase() : "";
    const jobTitle = job.title ? job.title.toLowerCase() : "";

    const jobStipend = job.stipend ? parseInt(job.stipend.toString().replace(/\D/g, ""), 10) : 0;
    const jobDuration = job.duration ? parseInt(job.duration.toString().replace(/\D/g, ""), 10) : 0;

    const workTypeMatch = workTypeValue === 'all' || jobWorkType === workTypeValue.toLowerCase();
    const experienceMatch = experienceValue === 'all' || jobExperience === experienceValue.toLowerCase();
    const roleMatch = roleValue === 'all' || jobTitle.includes(roleValue.toLowerCase());
    const stipendMatch = stipendValue === 'all' || jobStipend >= Number(stipendValue);
    const durationMatch = durationValue === 'all' || jobDuration <= Number(durationValue);

    return workTypeMatch && experienceMatch && roleMatch && stipendMatch && durationMatch;
  });

  displayJobs(filteredJobs);
}

const filterEls = [
  document.getElementById('workType'),
  document.getElementById('experience'),
  document.getElementById('role'),
  document.getElementById('stipend'),
  document.getElementById('duration')
];
filterEls.forEach(el =>
  el.addEventListener('change', () => {
    applyFilters();
  })
);

const filters = document.getElementById('filters');
const menuBtn = document.getElementById('menuBtn');
const overlay = document.getElementById('drawerOverlay');
const closeDrawerBtn = document.getElementById('closeDrawer');

function openDrawer() {
  filters.classList.add('as-drawer', 'open');
  overlay.classList.add('show');
  overlay.hidden = false;
  menuBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  filters.classList.remove('open');
  overlay.classList.remove('show');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  setTimeout(() => {
    overlay.hidden = true;
  }, 250);
}

menuBtn.addEventListener('click', () => {
  const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
  if (!expanded) openDrawer();
  else closeDrawer();
});
overlay.addEventListener('click', closeDrawer);
closeDrawerBtn.addEventListener('click', closeDrawer);

function syncForViewport() {
  const w = window.innerWidth;
  if (w > 600) {
    filters.classList.remove('as-drawer', 'open');
    overlay.classList.remove('show');
    overlay.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}
window.addEventListener('resize', syncForViewport);
window.addEventListener('orientationchange', syncForViewport);
syncForViewport();

function setButtonToApplied(button) {
  button.disabled = true;
  button.classList.add('applied');
  button.textContent = 'Applied';
  button.style.backgroundColor = '#28a745';
}

function getUserIdFromToken() {
  const token = localStorage.getItem('jwtToken');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload.userId || null;
  } catch (err) {
    return null;
  }
}

async function getAppliedJobsFromDB() {
  const token = localStorage.getItem('jwtToken');
  if (!token) return [];

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/myApplications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch applied jobs');
    const apps = await res.json();
    const appliedJobIds = apps.map(app => app.internshipId._id);
    const userId = getUserIdFromToken();
    if (userId) {
      localStorage.setItem(`appliedJobs_${userId}`, JSON.stringify(appliedJobIds));
    }
    return appliedJobIds;
  } catch (err) {
    return [];
  }
}

function isJobApplied(internshipId) {
  const userId = getUserIdFromToken();
  if (!userId) return false;
  const appliedJobs = JSON.parse(localStorage.getItem(`appliedJobs_${userId}`)) || [];
  return appliedJobs.includes(internshipId);
}

async function updateAllButtonStates() {
  const appliedJobs = await getAppliedJobsFromDB();
  const allApplyButtons = document.querySelectorAll('.apply');

  allApplyButtons.forEach(button => {
    const jobId = button.dataset.jobId;
    if (appliedJobs.includes(jobId)) {
      setButtonToApplied(button);
    }
  });
}

function createJobCard(job) {
  const skillsHTML = job.skills
    .map(skill => `<span class="chip">${skill}</span>`)
    .join('');

  const deadline = job.deadline ? new Date(job.deadline) : null;
  const today = new Date();

  let statusText = "Open";
  let statusColor = "#09ff00ff";
  let buttonDisabled = false;
  let buttonText = "Apply Now";
  let buttonBg = "#007bff";


  if (deadline && deadline < today) {
    statusText = "Closed";
    statusColor = "red";
    buttonDisabled = true;
    buttonText = "Closed";
    buttonBg = "red";
  }

  return `
    <section class="card">
       <span style="display: flex; align-items: center; gap: 10px;">
        <h1>${job.title}</h1>
        <span style="font-size: 14px; font-weight: bold; color: ${statusColor};">
          ${statusText}
        </span>
      </span>
      <p class="desc">${job.description}</p>
      <div class="metrics">
        <div class="metric"><div class="value">${job.employmentType}</div><div class="label">Employment type</div></div>
        <div class="metric"><div class="value">${job.stipend}</div><div class="label">Stipend</div></div>
        <div class="metric"><div class="value">${job.duration} month</div><div class="label">Duration</div></div>
        <div class="metric"><div class="value">${job.workType}</div><div class="label">Work Type</div></div>
        <div class="metric"><div class="value">${job.experienceLevel}</div><div class="label">Experience Level</div></div>
        <div class="metric"><div class="value">${job.location}</div><div class="label">Location</div></div>
      </div>
      <div class="skills">
        <h3>Skills</h3>
        <div class="chips">${skillsHTML}</div>
      </div>
      <div class="cta">
     <div class="cta">
        <button 
          class="apply" 
          data-job-id="${job._id}" 
          style="background-color:${buttonBg}; color:#fff;" 
          ${buttonDisabled ? "disabled" : ""}>
          ${buttonText}
        </button>      </div>
    </section>
  `;
}

function displayJobs(jobsToDisplay) {
  const jobContainer = document.getElementById('jobDetails');
  jobContainer.innerHTML = '';

  if (jobsToDisplay.length === 0) {
    jobContainer.innerHTML =
      '<p>No internships found. Try adjusting your filters or check back later!</p>';
  } else {
    jobsToDisplay.forEach(job => {
      jobContainer.innerHTML += createJobCard(job);
    });

    updateAllButtonStates();
  }
}

async function fetchAndDisplayJobs() {
  const jobContainer = document.getElementById('jobDetails');
  jobContainer.innerHTML = '<p></p>';

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/jobs`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const jobs = await response.json();
    jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    allJobs = jobs;

    if (jobs.length === 0) {
      jobContainer.innerHTML =
        '<p>No internships posted yet. Check back later!</p>';
    } else {
      displayJobs(allJobs);
    }
  } catch (error) {
    jobContainer.innerHTML =
      '<p class="error">Could not load jobs. Please try again later.</p>';
  }
}

function saveAppliedJob(internshipId) {
  const userId = getUserIdFromToken();
  if (!userId) return;

  let appliedJobs = JSON.parse(localStorage.getItem(`appliedJobs_${userId}`)) || [];

  if (!appliedJobs.includes(internshipId)) {
    appliedJobs.push(internshipId);
    localStorage.setItem(`appliedJobs_${userId}`, JSON.stringify(appliedJobs));
  }

  let applicantCounts = JSON.parse(localStorage.getItem('applicantCounts')) || {};
  applicantCounts[internshipId] = (applicantCounts[internshipId] || 0) + 1;
  localStorage.setItem('applicantCounts', JSON.stringify(applicantCounts));
}


document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayJobs().then(() => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    const appliedJobs = JSON.parse(localStorage.getItem(`appliedJobs_${userId}`)) || [];
    appliedJobs.forEach(id => {
      const btn = document.querySelector(`.apply[data-job-id="${id}"]`);
      if (btn) {
        setButtonToApplied(btn);
      }
    });
  });
});

document.addEventListener('click', async e => {
  if (e.target.matches('#jobDetails .apply')) {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('You must be logged in to apply.');
      return;
    }

    const applyButton = e.target;
    const internshipId = applyButton.dataset.jobId;
    const card = applyButton.closest('.card');
    if (!card) return;

    if (isJobApplied(internshipId)) {
      alert('Already applied for this job.');
      return;
    }

    const applicationData = { internshipId };

    applyButton.disabled = true;
    applyButton.textContent = 'Applying...';

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/applyInternship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(applicationData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Application submitted successfully!');
        setButtonToApplied(applyButton);
        saveAppliedJob(internshipId);

        applyButton.textContent = 'Applied';
        applyButton.style.backgroundColor = '#28a745';

        try {
          await fetch(
            `${process.env.BACKEND_URL}/jobs/${internshipId}/incrementApplicants`,
            {
              method: 'PUT',
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        } catch (err) {
        }
      } else {
        throw new Error(result.message || 'Failed to apply.');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      applyButton.disabled = false;
      applyButton.textContent = 'Apply Now';
    }
  }
});