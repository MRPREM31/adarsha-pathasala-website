// ---------------------------
// Mobile Navbar Toggle
// ---------------------------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.innerHTML = navLinks.classList.contains('open')
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

// Close nav on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });
});

// ---------------------------
// Dark / Light Mode Toggle
// ---------------------------
const modeToggle = document.getElementById('modeToggle');
const modeIcon = document.getElementById('modeIcon');
const modeText = document.getElementById('modeText');

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        modeIcon.className = 'fa-regular fa-sun';
        modeText.textContent = 'Light';
    } else {
        document.body.classList.remove('dark-theme');
        modeIcon.className = 'fa-regular fa-moon';
        modeText.textContent = 'Dark';
    }
}

// Load theme from localStorage
const savedTheme = localStorage.getItem('ap-theme') || 'light';
applyTheme(savedTheme);

modeToggle.addEventListener('click', () => {
    const current = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('ap-theme', next);
});

// ---------------------------
// Contact Form -> Google Apps Script
// ---------------------------
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

// TODO: Replace with your actual deployed Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyxAGlV0A8ykb_FwvwzTRFwKEkJCMdYwxz-XtnP7KnjBX1GHiH--W-GEQzgXIc3YJHv/exec";

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!SCRIPT_URL || SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
        formStatus.textContent = "⚠️ Please configure the Apps Script URL in the code before using the form.";
        formStatus.className = "form-status error";
        return;
    }

    formStatus.textContent = "";
    formStatus.className = "form-status";
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    try {
        const formData = new FormData(contactForm);
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            if (result.status === "success") {
                formStatus.textContent = "✅ " + result.message;
                formStatus.className = "form-status success";
                contactForm.reset();
                
                // Show enquiry ID if available
                if (result.enquiryId) {
                    formStatus.innerHTML += `<br><small>Enquiry ID: ${result.enquiryId}</small>`;
                }
            } else {
                throw new Error(result.message || "Submission failed");
            }
        } else {
            throw new Error("Network response was not ok");
        }
    } catch (error) {
        console.error("Form submission error:", error);
        formStatus.textContent = "❌ Something went wrong. Please try again later or contact us directly.";
        formStatus.className = "form-status error";
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    }
});

// ---------------------------
// Smooth Scrolling for Anchor Links
// ---------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            if (navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
            
            // Smooth scroll to target
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ---------------------------
// Add active class to current section in nav
// ---------------------------
const sections = document.querySelectorAll('section');
const navLinksElements = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksElements.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// ---------------------------
// Image Lazy Loading
// ---------------------------
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    // Create Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src') || img.src;
                
                // Ensure image loads
                img.src = src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });
    
    // Observe all images
    images.forEach(img => imageObserver.observe(img));
});

// ---------------------------
// Form Validation
// ---------------------------
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Name validation
    if (name.length < 2) {
        alert('Please enter a valid name (at least 2 characters)');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    // Phone validation (Indian numbers)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanedPhone = phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanedPhone)) {
        alert('Please enter a valid 10-digit Indian mobile number');
        return false;
    }
    
    // Message validation
    if (message.length < 10) {
        alert('Please enter a message with at least 10 characters');
        return false;
    }
    
    return true;
}

// Add validation to form
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            return false;
        }
    });
}