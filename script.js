// ---------------------------
// Mobile Navbar Toggle (Safe Guarded)
// ---------------------------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navToggle.innerText = navLinks.classList.contains('open') ? '×' : '⋮';
    });

    document.addEventListener("click", function (e) {
        if (!navLinks || !navToggle) return;
        const isClickInsideMenu = navLinks.contains(e.target);
        const isClickOnToggle = navToggle.contains(e.target);

        if (!isClickInsideMenu && !isClickOnToggle) {
            if (navLinks.classList.contains("open")) {
                navLinks.classList.remove("open");
                navToggle.innerText = "⋮";
            }
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                if (navToggle) navToggle.innerText = '⋮';
            }
        });
    });
}

// ---------------------------
// Dark / Light Mode Toggle (Safe Guarded)
// ---------------------------
const modeToggle = document.getElementById('modeToggle');

function applyTheme(theme) {
    const modeIcon = document.getElementById('modeIcon');
    const modeText = document.getElementById('modeText');
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        if (modeIcon) modeIcon.className = 'fa-regular fa-sun';
        if (modeText) modeText.textContent = 'Light';
    } else {
        document.body.classList.remove('dark-theme');
        if (modeIcon) modeIcon.className = 'fa-regular fa-moon';
        if (modeText) modeText.textContent = 'Dark';
    }
}

// Load theme from localStorage
const savedTheme = localStorage.getItem('ap-theme') || 'light';
applyTheme(savedTheme);

if (modeToggle) {
    modeToggle.addEventListener('click', () => {
        const current = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('ap-theme', next);
    });
}

// ---------------------------
// Contact Form -> Google Apps Script (Index Page)
// ---------------------------
const contactForm = document.getElementById('contactForm');
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyxAGlV0A8ykb_FwvwzTRFwKEkJCMdYwxz-XtnP7KnjBX1GHiH--W-GEQzgXIc3YJHv/exec";

if (contactForm) {
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!SCRIPT_URL || SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
            if (formStatus) {
                formStatus.textContent = "⚠️ Please configure the Apps Script URL in the code before using the form.";
                formStatus.className = "form-status error";
            }
            return;
        }

        if (formStatus) {
            formStatus.textContent = "";
            formStatus.className = "form-status";
        }
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        }

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                if (result.status === "success") {
                    if (formStatus) {
                        formStatus.textContent = "✅ " + result.message;
                        formStatus.className = "form-status success";
                    }
                    contactForm.reset();
                    if (result.enquiryId && formStatus) {
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
            if (formStatus) {
                formStatus.textContent = "❌ Something went wrong. Please try again later or contact us directly.";
                formStatus.className = "form-status error";
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
            }
        }
    });
}

// ---------------------------
// Smooth Scrolling for Anchor Links
// ---------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                if (navToggle) navToggle.innerText = '⋮';
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

if (sections.length > 0 && navLinksElements.length > 0) {
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksElements.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                link.classList.remove('active');
                if (href.substring(1) === current) {
                    link.classList.add('active');
                }
            }
        });
    });
}

// ---------------------------
// Image Lazy Loading
// ---------------------------
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// ---------------------------
// Form Validation Helper for Contact Form
// ---------------------------
function validateForm() {
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const phoneEl = document.getElementById('phone');
    const messageEl = document.getElementById('message');
    
    if (!nameEl || !emailEl || !phoneEl || !messageEl) return true;

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const phone = phoneEl.value.trim();
    const message = messageEl.value.trim();
    
    if (name.length < 2) {
        alert('Please enter a valid name (at least 2 characters)');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanedPhone = phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanedPhone)) {
        alert('Please enter a valid 10-digit Indian mobile number');
        return false;
    }
    
    if (message.length < 10) {
        alert('Please enter a message with at least 10 characters');
        return false;
    }
    
    return true;
}

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

    if (resultCards.length > 0 && lightboxModal) {
        resultCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                if (img) {
                    currentImgSrc = img.src;
                    currentImageId = card.getAttribute('data-result-id');
                    lightboxImg.src = currentImgSrc;
                    lightboxModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                    
                    if (currentImageId) {
                        const newUrl = window.location.pathname + '?image=' + currentImageId + window.location.hash;
                        window.history.pushState({ path: newUrl }, '', newUrl);
                    }
                }
            });
            card.style.cursor = 'pointer';
        });

        const urlParams = new URLSearchParams(window.location.search);
        const imageParam = urlParams.get('image');
        if (imageParam) {
            const targetCard = Array.from(resultCards).find(card => card.getAttribute('data-result-id') === imageParam);
            if (targetCard) {
                setTimeout(() => {
                    targetCard.click();
                    const resultsSection = document.getElementById('achievements');
                    if(resultsSection) resultsSection.scrollIntoView();
                }, 100);
            }
        }
    }

    const closeLightbox = () => {
        if(lightboxModal) {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.pushState({ path: cleanUrl }, '', cleanUrl);
        }
    };

    lightboxClose?.addEventListener('click', closeLightbox);
    
    lightboxModal?.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    btnDownload?.addEventListener('click', () => {
        if (!currentImgSrc) return;
        let fileName = currentImgSrc.substring(currentImgSrc.lastIndexOf('/') + 1) || 'result.jpg';
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
                const a = document.createElement('a');
                a.href = currentImgSrc;
                a.download = fileName;
                a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
    });

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
        });
    });

    btnShare?.addEventListener('click', async () => {
        if (!currentImgSrc) return;
        try {
            if (navigator.share) {
                const shareUrl = window.location.origin + window.location.pathname + '?image=' + currentImageId;
                await navigator.share({
                    title: 'Adarsha Pathasala Result',
                    text: 'Check out this result from Adarsha Pathasala!',
                    url: shareUrl
                });
            } else {
                alert('Web Share is not supported in your browser.');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    });
});

// ---------------------------
// Opportunities Application Form -> Google Apps Script
// ---------------------------
const OPPORTUNITY_CONFIG = {
    googleScriptUrl: "https://script.google.com/macros/s/AKfycbwVO5xNkaY26mH3shqGv_N7gYKlRuzw7UJ3fLGltwx8zSD9nvqegVM1qGM2VHlMvoxQxA/exec"
};

const opportunityForm = document.getElementById('opportunityForm');

if (opportunityForm) {
    opportunityForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const oppFormStatus = document.getElementById('oppFormStatus');
        const oppSubmitBtn = document.getElementById('oppSubmitBtn');

        // Anti-spam Honeypot Check
        const hp = document.getElementById('website_hp');
        if (hp && hp.value.trim() !== "") {
            return;
        }

        // Clear previous field errors
        document.querySelectorAll('#opportunityForm .field-error').forEach(el => el.textContent = '');

        const fullNameVal = document.getElementById('fullName')?.value.trim() || '';
        const emailVal = document.getElementById('email')?.value.trim() || '';
        const phoneVal = document.getElementById('phone')?.value.trim() || '';
        const subjectVal = document.getElementById('subject')?.value || '';
        const experienceVal = document.getElementById('teachingExperience')?.value || '';
        const locationVal = document.getElementById('currentLocation')?.value.trim() || '';
        const resumeVal = document.getElementById('resumeUrl')?.value.trim() || '';
        const introVal = document.getElementById('shortIntro')?.value.trim() || '';
        const consentChecked = document.getElementById('consent')?.checked || false;

        let hasError = false;

        if (fullNameVal.length < 2) {
            const errEl = document.getElementById('fullNameError');
            if (errEl) errEl.textContent = "Please enter your full name (at least 2 characters).";
            hasError = true;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            const errEl = document.getElementById('emailError');
            if (errEl) errEl.textContent = "Please enter a valid email address.";
            hasError = true;
        }

        const cleanedPhone = phoneVal.replace(/\D/g, '');
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(cleanedPhone)) {
            const errEl = document.getElementById('phoneError');
            if (errEl) errEl.textContent = "Please enter a valid 10-digit Indian mobile number.";
            hasError = true;
        }

        if (!subjectVal) {
            const errEl = document.getElementById('subjectError');
            if (errEl) errEl.textContent = "Please select a subject.";
            hasError = true;
        }

        if (!experienceVal) {
            const errEl = document.getElementById('teachingExperienceError');
            if (errEl) errEl.textContent = "Please select your teaching experience.";
            hasError = true;
        }

        if (locationVal.length < 2) {
            const errEl = document.getElementById('currentLocationError');
            if (errEl) errEl.textContent = "Please enter your current location.";
            hasError = true;
        }

        const urlRegex = /^https?:\/\/.+/i;
        if (!urlRegex.test(resumeVal)) {
            const errEl = document.getElementById('resumeUrlError');
            if (errEl) errEl.textContent = "Please enter a valid HTTP/HTTPS shareable link to your Resume/CV.";
            hasError = true;
        }

        if (introVal.length < 10) {
            const errEl = document.getElementById('shortIntroError');
            if (errEl) errEl.textContent = "Please write a short introduction (at least 10 characters).";
            hasError = true;
        }

        if (!consentChecked) {
            const errEl = document.getElementById('consentError');
            if (errEl) errEl.textContent = "You must confirm that your information is accurate.";
            hasError = true;
        }

        if (hasError) return;

        if (!OPPORTUNITY_CONFIG.googleScriptUrl) {
            if (oppFormStatus) {
                oppFormStatus.textContent = "⚠️ Please configure the Google Apps Script Web App URL in script.js before submitting.";
                oppFormStatus.className = "form-status error";
            }
            return;
        }

        if (oppFormStatus) {
            oppFormStatus.textContent = "";
            oppFormStatus.className = "form-status";
        }

        // 1. Immediately show loading state & disable button to prevent double submission
        if (oppSubmitBtn) {
            oppSubmitBtn.disabled = true;
            oppSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Application...';
        }

        try {
            const params = new URLSearchParams(new FormData(opportunityForm));

            // Submit POST request to Apps Script Web App
            const response = await fetch(OPPORTUNITY_CONFIG.googleScriptUrl, {
                method: "POST",
                body: params
            });

            if (!response.ok) {
                throw new Error("Network response was not ok (" + response.status + ")");
            }

            const result = await response.json();

            if (result.status === "success" || result.result === "success") {
                const generatedAppId = result.applicationId || ("AP-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase());

                // Populate Success Confirmation Card
                const displayAppId = document.getElementById('displayAppId');
                const summaryAppId = document.getElementById('summaryAppId');
                const summaryName = document.getElementById('summaryName');
                const summarySubject = document.getElementById('summarySubject');
                const summaryDate = document.getElementById('summaryDate');

                if (displayAppId) displayAppId.textContent = generatedAppId;
                if (summaryAppId) summaryAppId.textContent = generatedAppId;
                if (summaryName) summaryName.textContent = fullNameVal;
                if (summarySubject) summarySubject.textContent = subjectVal;
                if (summaryDate) {
                    const now = new Date();
                    summaryDate.textContent = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                }

                // Hide form & show polished Success Confirmation Card
                const oppSuccessCard = document.getElementById('oppSuccessCard');
                if (opportunityForm) opportunityForm.style.display = 'none';
                if (oppSuccessCard) oppSuccessCard.style.display = 'flex';

                // Reset form state for clean future use
                opportunityForm.reset();

                // Scroll smoothly to success card
                oppSuccessCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error(result.message || "Submission error from server.");
            }
        } catch (error) {
            console.error("Opportunity form submission error:", error);

            // Error Handling: Keep form filled, enable submit button, show professional error message
            if (oppFormStatus) {
                oppFormStatus.textContent = "Unable to submit your application right now. Please check your connection and try again.";
                oppFormStatus.className = "form-status error";
            }
        } finally {
            if (oppSubmitBtn) {
                oppSubmitBtn.disabled = false;
                oppSubmitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> SUBMIT APPLICATION';
            }
        }
    });
}

// ---------------------------
// Copy Application ID Button Handler
// ---------------------------
const copyAppIdBtn = document.getElementById('copyAppIdBtn');
if (copyAppIdBtn) {
    copyAppIdBtn.addEventListener('click', () => {
        const appIdCode = document.getElementById('displayAppId')?.textContent || '';
        if (!appIdCode) return;

        navigator.clipboard.writeText(appIdCode).then(() => {
            const btnText = document.getElementById('copyBtnText');
            const btnIcon = document.getElementById('copyBtnIcon');

            if (btnText) btnText.textContent = 'Copied!';
            if (btnIcon) btnIcon.className = 'fa-solid fa-check';
            copyAppIdBtn.classList.add('copied');

            setTimeout(() => {
                if (btnText) btnText.textContent = 'Copy ID';
                if (btnIcon) btnIcon.className = 'fa-solid fa-copy';
                copyAppIdBtn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Clipboard copy failed:', err);
        });
    });
}

// ---------------------------
// Submit Another Application Button Handler
// ---------------------------
const resetAppBtn = document.getElementById('resetAppBtn');
if (resetAppBtn) {
    resetAppBtn.addEventListener('click', () => {
        const oppSuccessCard = document.getElementById('oppSuccessCard');
        const oppFormStatus = document.getElementById('oppFormStatus');
        const oppSubmitBtn = document.getElementById('oppSubmitBtn');

        if (oppSuccessCard) oppSuccessCard.style.display = 'none';
        if (opportunityForm) {
            opportunityForm.reset();
            opportunityForm.style.display = 'block';
        }
        if (oppFormStatus) {
            oppFormStatus.textContent = '';
            oppFormStatus.className = 'form-status';
        }
        if (oppSubmitBtn) {
            oppSubmitBtn.disabled = false;
            oppSubmitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> SUBMIT APPLICATION';
        }

        const applySection = document.getElementById('apply');
        applySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

