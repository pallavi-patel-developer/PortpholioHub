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
  document.querySelector('.filters').addEventListener('click', function(e) {
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
  alertBox.style.backgroundColor = type === "success" ? "#4CAF50" : 
                                  type === "info" ? "#2196F3" : "#f44336";
  
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 4000);
}