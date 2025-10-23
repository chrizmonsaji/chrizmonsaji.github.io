// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initTypewriter();
    initNavigation();
    initPortfolioFilter();
    initTerminalWidget();
    initTooltips();
    initScrollEffects();
    // Initialize the Supabase contact form handler specifically
    initSupabaseContactForm(); // Added this new function call
});

// Typewriter Effect for Terminal Text (Home page)
function initTypewriter() {
    const terminalText = document.getElementById('terminal-text');
    if (!terminalText) return;

    const text = 'ready to handle your next project'; // Use text from spec or make it configurable
    let index = 0;
    let isDeleting = false;
    let currentText = '';

    function type() {
        if (isDeleting) {
            currentText = text.substring(0, index - 1);
            index--;
        } else {
            currentText = text.substring(0, index + 1);
            index++;
        }

        terminalText.textContent = currentText;

        let typeSpeed = 150;
        if (isDeleting) typeSpeed /= 2;

        if (!isDeleting && currentText === text) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentText === '') {
            isDeleting = false;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000); // Start after 1 second
}

// Navigation Active State Management
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Smooth scrolling for anchor links (if used site-wide)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Portfolio Filtering
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (!filterBtns.length || !portfolioItems.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter items
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// --- NEW: Supabase Contact Form Handling ---
// This function is designed to work with the contact.html that has Supabase integration
// It does NOT send the 'subject' field, matching the updated contact.html form structure.
function initSupabaseContactForm() {
    // Check if the form exists on the current page (contact.html)
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback'); // Use the ID from contact.html

    // Only proceed if the form is found
    if (!contactForm || !formFeedback) {
        // console.log("Contact form or feedback element not found, skipping Supabase init.");
        return; // Exit if not on the contact page
    }

    // Supabase credentials (Ensure these are kept secure in production!)
    const SUPABASE_URL = 'https://fzijfyqjrgpwvbsvgtcf.supabase.co'; // Your project URL
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6aWpmeXFqcmdwd3Zic3ZndGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4OTk2NjQsImV4cCI6MjA3NjQ3NTY2NH0.oWRCPA46ugAG4DfFW25gA-SrYbJNog0XuCvc8pSadNQ'; // Your anon key

    // Initialize Supabase client
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Function to show feedback message
    function showFeedback(message, isSuccess) {
        formFeedback.innerHTML = `<div class="form-response ${isSuccess ? 'success' : 'error'}">${message}</div>`;
        // Scroll to feedback
        formFeedback.scrollIntoView({ behavior: 'smooth' });
    }

    // Add event listener for form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission

        // Get form data (excluding 'subject' as per updated form)
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        try {
            // Insert data into the 'contact_messages' table (without 'subject')
            const { data, error } = await supabase
                .from('contact_messages') // Ensure this matches your table name in Supabase
                .insert([
                    { name: name, email: email, message: message } // Removed 'subject: subject'
                ]);

            if (error) {
                console.error('Supabase Error:', error);
                throw new Error(`Supabase error: ${error.message}`);
            }

            // Show success message
            showFeedback('Thank you for your message! I will get back to you soon.', true);
            contactForm.reset(); // Clear the form
        } catch (error) {
            console.error('Form Submission Error:', error);
            // Show error message
            showFeedback('An error occurred while sending your message. Please try again.', false);
        }
    });
}
// --- END NEW Function ---

// Terminal Widget (Interactive Console)
function initTerminalWidget() {
    const terminalWidgets = document.querySelectorAll('.terminal-widget');
    terminalWidgets.forEach(widget => {
        // Add click event to simulate typing (example)
        widget.addEventListener('click', function() {
            const terminalBody = this.querySelector('.terminal-body');
            const newLine = document.createElement('div');
            newLine.className = 'terminal-line';
            newLine.textContent = '> command executed';
            terminalBody.appendChild(newLine);

            // Scroll to bottom
            terminalBody.scrollTop = terminalBody.scrollHeight;
        });
    });
}

// Tooltips for Navigation Items
function initTooltips() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const label = link.querySelector('.nav-label');
        if (label) {
            link.addEventListener('mouseenter', function() {
                // In desktop view, show label as tooltip
                if (window.innerWidth > 1200) {
                    this.setAttribute('title', label.textContent);
                }
            });
        }
    });
}

// Scroll Effects for Elements
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements that should fade in
    document.querySelectorAll('.service-card, .testimonial-card, .portfolio-item, .hero-card').forEach(el => {
        observer.observe(el);
    });
}

// Additional Helper Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize for responsive navigation
window.addEventListener('resize', debounce(() => {
    initNavigation();
}, 250));