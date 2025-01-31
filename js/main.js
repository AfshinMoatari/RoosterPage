// Use strict mode for better error catching
'use strict';

// Polyfill for smooth scrolling in older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    import('scroll-behavior-polyfill').then(() => {
        console.log('Smooth scroll polyfill loaded');
    });
}

// Intersection Observer with polyfill
if (!('IntersectionObserver' in window)) {
    import('intersection-observer').then(() => {
        initializeObservers();
    });
} else {
    initializeObservers();
}

function initializeObservers() {
    // Add smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add active class
            document.querySelector('nav a.active').classList.remove('active');
            this.classList.add('active');
            
            // Scroll to section (if implementing sections)
            const href = this.getAttribute('href');
            if (href !== '#') {
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        // Mobile menu functionality
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('nav');
        const body = document.body;

        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
        });

        // Close menu when clicking a link
        nav.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.classList.contains('book-btn')) {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
                body.style.overflow = '';
            }
        });

        // Close menu when resizing window beyond mobile breakpoint
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
                body.style.overflow = '';
            }
        });

        // Scroll to Top functionality
        const scrollTopBtn = document.getElementById('scroll-top');
        
        // Show button when page is scrolled
        function toggleScrollButton() {
            if (window.scrollY > 200) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }

        // Initial check for scroll position
        toggleScrollButton();

        // Smooth scroll to top when button is clicked
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Listen for scroll events
        window.addEventListener('scroll', toggleScrollButton);

        // Scroll reveal functionality
        const scrollElements = document.querySelectorAll('[data-scroll]');

        const elementInView = (el, offset = 0) => {
            const elementTop = el.getBoundingClientRect().top;
            return (
                elementTop <= 
                (window.innerHeight || document.documentElement.clientHeight) * (1 - offset)
            );
        };

        const displayScrollElement = (element) => {
            element.classList.add('in-view');
        };

        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                if (elementInView(el, 0.25)) {
                    displayScrollElement(el);
                }
            });
        };

        // Initial check for elements in view
        handleScrollAnimation();

        // Listen for scroll events
        window.addEventListener('scroll', () => {
            handleScrollAnimation();
        });

        // Image loading optimization
        function handleImageLoading() {
            const images = document.querySelectorAll('img[loading="lazy"]');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const container = img.closest('.image-container');
                        
                        // Handle image load
                        img.onload = () => {
                            img.classList.add('loaded');
                            if (container) {
                                container.classList.add('loaded');
                            }
                        };
                        
                        // Stop observing after loading
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            images.forEach(img => imageObserver.observe(img));
        }

        handleImageLoading();
    });
}