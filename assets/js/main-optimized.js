// Optimized JavaScript with improved performance

// Use IIFE to avoid polluting global scope
(function() {
    'use strict';

    // Cache DOM elements to avoid repeated queries
    const DOM_CACHE = {
        terminalText: null,
        navLinks: null,
        filterBtns: null,
        portfolioItems: null,
        contactForm: null,
        formFeedback: null,
        terminalWidgets: null
    };

    // Feature detection
    const FEATURES = {
        intersectionObserver: 'IntersectionObserver' in window,
        webAnimations: 'animate' in Element.prototype
    };

    // DOM Content Loaded Event
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize all components with feature detection
        if (document.getElementById('terminal-text')) {
            initTypewriter();
        }
        
        initNavigation();
        
        if (document.querySelectorAll('.portfolio-item').length > 0) {
            initPortfolioFilter();
        }
        
        initTerminalWidget();
        initTooltips();
        
        if (FEATURES.intersectionObserver) {
            initScrollEffects();
        }
        
        // Initialize the Supabase contact form handler specifically
        if (document.getElementById('contactForm')) {
            initSupabaseContactForm();
        }
    });

    // Optimized Typewriter Effect for Terminal Text
    function initTypewriter() {
        const terminalText = document.getElementById('terminal-text');
        if (!terminalText) return;

        const text = 'ready to handle your next project';
        let index = 0;
        let isDeleting = false;
        let currentText = '';
        let timeoutId = null;

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
            if (isDeleting) typeSpeed = 75; // Faster deletion

            if (!isDeleting && currentText === text) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && currentText === '') {
                isDeleting = false;
            }

            timeoutId = setTimeout(type, typeSpeed);
        }

        // Start after 1 second
        timeoutId = setTimeout(type, 1000);

        // Cleanup function
        terminalText.addEventListener('remove', () => {
            if (timeoutId) clearTimeout(timeoutId);
        });
    }

    // Optimized Navigation Active State Management
    function initNavigation() {
        const currentPath = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Throttled smooth scrolling for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', throttle(function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 500));
        });
    }

    // Optimized Portfolio Filtering with better performance
    function initPortfolioFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        if (!filterBtns.length || !portfolioItems.length) return;

        // Use event delegation for better performance
        document.querySelector('.portfolio-filters').addEventListener('click', function(e) {
            if (!e.target.matches('.filter-btn')) return;

            const filter = e.target.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            // Batch DOM updates for better performance
            const itemsToHide = [];
            const itemsToShow = [];

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    itemsToShow.push(item);
                } else {
                    itemsToHide.push(item);
                }
            });

            // Update hidden items
            itemsToHide.forEach(item => {
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            });

            // Update shown items
            itemsToShow.forEach(item => {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 50);
            });
        });
    }

    // Optimized Supabase Contact Form Handling
    function initSupabaseContactForm() {
        const contactForm = document.getElementById('contactForm');
        const formFeedback = document.getElementById('formFeedback');

        if (!contactForm || !formFeedback) {
            return;
        }

        // Supabase credentials
        const SUPABASE_URL = 'https://fzijfyqjrgpwvbsvgtcf.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6aWpmeXFqcmdwd3Zic3ZndGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4OTk2NjQsImV4cCI6MjA3NjQ3NTY2NH0.oWRCPA46ugAG4DfFW25gA-SrYbJNog0XuCvc8pSadNQ';

        // Initialize Supabase client
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Optimized feedback function with better UX
        function showFeedback(message, isSuccess) {
            formFeedback.innerHTML = `<div class="form-response ${isSuccess ? 'success' : 'error'}">${message}</div>`;
            
            // Auto-hide success message after 5 seconds
            if (isSuccess) {
                setTimeout(() => {
                    formFeedback.innerHTML = '';
                }, 5000);
            }
            
            formFeedback.scrollIntoView({ behavior: 'smooth' });
        }

        // Optimized form submission with loading state
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'SENDING...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            try {
                const { data, error } = await supabase
                    .from('contact_messages')
                    .insert([{ name: name, email: email, message: message }]);

                if (error) {
                    throw new Error(`Supabase error: ${error.message}`);
                }

                showFeedback('Thank you for your message! I will get back to you soon.', true);
                contactForm.reset();
            } catch (error) {
                console.error('Form Submission Error:', error);
                showFeedback('An error occurred while sending your message. Please try again.', false);
            } finally {
                // Restore original button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Optimized Terminal Widget
    function initTerminalWidget() {
        const terminalWidgets = document.querySelectorAll('.terminal-widget');
        terminalWidgets.forEach(widget => {
            widget.addEventListener('click', function() {
                const terminalBody = this.querySelector('.terminal-body');
                if (!terminalBody) return;

                const newLine = document.createElement('div');
                newLine.className = 'terminal-line';
                newLine.textContent = '> command executed';
                terminalBody.appendChild(newLine);

                // Scroll to bottom smoothly
                terminalBody.scrollTop = terminalBody.scrollHeight;
            });
        });
    }

    // Optimized Tooltips for Navigation Items
    function initTooltips() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const label = link.querySelector('.nav-label');
            if (!label) return;

            // Debounced mouseenter for performance
            link.addEventListener('mouseenter', debounce(function() {
                if (window.innerWidth > 1200) {
                    this.setAttribute('title', label.textContent);
                }
            }, 300));
        });
    }

    // Optimized Scroll Effects with Intersection Observer
    function initScrollEffects() {
        if (!FEATURES.intersectionObserver) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    // Stop observing once animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should fade in
        const elementsToObserve = document.querySelectorAll('.service-card, .testimonial-card, .portfolio-item, .hero-card');
        elementsToObserve.forEach(el => {
            observer.observe(el);
        });
    }

    // Optimized Helper Functions
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

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Optimized window resize handler
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initNavigation();
        }, 250);
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
    });

})();