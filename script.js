// ---------------------------
// Mobile Navbar Toggle
// ---------------------------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.innerText = navLinks.classList.contains('open') ? '×' : '⋮';
});

// ---------------------------
// Close menu when clicking outside
// ---------------------------
document.addEventListener("click", function (e) {
    const isClickInsideMenu = navLinks.contains(e.target);
    const isClickOnToggle = navToggle.contains(e.target);

    if (!isClickInsideMenu && !isClickOnToggle) {
        if (navLinks.classList.contains("open")) {
            navLinks.classList.remove("open");
            navToggle.innerText = "⋮";
        }
    }
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

// ---------------------------
// Lightbox Gallery
// ---------------------------
document.addEventListener('DOMContentLoaded', function() {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');
    const resultCards = document.querySelectorAll('.result-card');
    const btnDownload = document.getElementById('lightboxDownload');
    const btnShare = document.getElementById('lightboxShare');
    const btnCopy = document.getElementById('lightboxCopy');

    let currentImgSrc = '';
    let currentImageId = '';

    // Open lightbox
    if (resultCards.length > 0 && lightboxModal) {
        resultCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                if (img) {
                    currentImgSrc = img.src;
                    currentImageId = card.getAttribute('data-result-id');
                    lightboxImg.src = currentImgSrc;
                    lightboxModal.style.display = 'block';
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                    
                    // Update URL with query param
                    if (currentImageId) {
                        const newUrl = window.location.pathname + '?image=' + currentImageId + window.location.hash;
                        window.history.pushState({ path: newUrl }, '', newUrl);
                    }
                }
            });
            card.style.cursor = 'pointer'; // Make it obvious it's clickable
        });

        // Check URL on load
        const urlParams = new URLSearchParams(window.location.search);
        const imageParam = urlParams.get('image');
        if (imageParam) {
            const targetCard = Array.from(resultCards).find(card => card.getAttribute('data-result-id') === imageParam);
            if (targetCard) {
                // Slight delay to ensure everything is loaded before opening
                setTimeout(() => {
                    targetCard.click();
                    // Scroll to results section in background
                    const resultsSection = document.getElementById('achievements');
                    if(resultsSection) resultsSection.scrollIntoView();
                }, 100);
            }
        }
    }

    // Close lightbox
    const closeLightbox = () => {
        if(lightboxModal) {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
            
            // Remove query param from URL
            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.pushState({ path: cleanUrl }, '', cleanUrl);
        }
    };

    lightboxClose?.addEventListener('click', closeLightbox);
    
    // Close when clicking outside image
    lightboxModal?.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Handle Download
    btnDownload?.addEventListener('click', () => {
        if (!currentImgSrc) return;
        
        // Extract filename from URL or use a default
        let fileName = currentImgSrc.substring(currentImgSrc.lastIndexOf('/') + 1) || 'result.jpg';
        // Clean up any query parameters in filename
        fileName = fileName.split('?')[0];
        
        fetch(currentImgSrc)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(err => {
                console.error('Error downloading image: ', err);
                // Fallback approach if fetch fails (e.g., CORS issues)
                const a = document.createElement('a');
                a.href = currentImgSrc;
                a.download = fileName;
                a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
    });

    // Handle Copy Link
    btnCopy?.addEventListener('click', () => {
        if (!currentImageId) return;
        const shareUrl = window.location.origin + window.location.pathname + '?image=' + currentImageId;
        
        navigator.clipboard.writeText(shareUrl).then(() => {
            const originalText = btnCopy.innerHTML;
            btnCopy.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => {
                btnCopy.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy the link. You can copy it manually from your browser address bar.');
        });
    });

    // Handle Share
    btnShare?.addEventListener('click', async () => {
        if (!currentImgSrc) return;
        
        try {
            if (navigator.share) {
                try {
                    // Try to share as a file first (better experience for images)
                    const response = await fetch(currentImgSrc);
                    const blob = await response.blob();
                    let fileName = currentImgSrc.substring(currentImgSrc.lastIndexOf('/') + 1) || 'result.jpg';
                    fileName = fileName.split('?')[0];
                    const file = new File([blob], fileName, { type: blob.type });

                    const shareUrl = window.location.origin + window.location.pathname + '?image=' + currentImageId;

                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            title: 'Adarsha Pathasala Result',
                            text: 'Check out this amazing result from Adarsha Pathasala! View here: ',
                            url: shareUrl,
                            files: [file]
                        });
                    } else {
                        throw new Error('File sharing not supported');
                    }
                } catch (fileErr) {
                    // Fallback to sharing the page URL with the specific image param
                    const shareUrl = window.location.origin + window.location.pathname + '?image=' + currentImageId;
                    await navigator.share({
                        title: 'Adarsha Pathasala Result',
                        text: 'Check out this amazing result from Adarsha Pathasala!',
                        url: shareUrl
                    });
                }
            } else {
                alert('Web Share is not supported in your browser. You can download the image instead.');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            if (error.name !== 'AbortError') { // Don't alert if user just cancelled
                alert('Could not share the image.');
            }
        }
    });
});
