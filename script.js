// ===================================
// PERPETUO CAFE - INTERACTIVE FEATURES
// ===================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // ===================================
    // NAVIGATION
    // ===================================
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');

        // Animate hamburger icon
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active')
            ? 'rotate(45deg) translate(5px, 5px)'
            : 'none';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active')
            ? 'rotate(-45deg) translate(7px, -6px)'
            : 'none';
    });

    // Smooth scroll and close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu
            navMenu.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // ===================================
    // MENU FILTERING
    // ===================================
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const category = this.getAttribute('data-category');

            // Filter menu items
            menuItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // ===================================
    // SCROLL ANIMATIONS
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observe menu items
    menuItems.forEach(item => {
        observer.observe(item);
    });

    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        observer.observe(card);
    });

    // ===================================
    // CONTACT FORM (Using FormSubmit)
    // ===================================
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function (e) {
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Basic validation
        if (!name || !email || !message) {
            e.preventDefault();
            showMessage('Por favor completa todos los campos requeridos.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            showMessage('Por favor ingresa un correo electrÃ³nico vÃ¡lido.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Enviando...';
        submitBtn.style.opacity = '0.7';
        
        // Form will submit naturally to FormSubmit
        // FormSubmit will handle the email sending and redirect
    });

    // Function to show messages to user
    function showMessage(message, type) {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            animation: slideDown 0.3s ease;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            max-width: 90%;
            text-align: center;
        `;

        if (type === 'success') {
            messageDiv.style.background = 'linear-gradient(135deg, #06C167, #038C4A)';
            messageDiv.style.color = 'white';
        } else {
            messageDiv.style.background = 'linear-gradient(135deg, #FF441F, #FF2200)';
            messageDiv.style.color = 'white';
        }

        document.body.appendChild(messageDiv);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 5000);
    }


    // ===================================
    // GOOGLE MAPS INTEGRATION
    // ===================================
    const mapContainer = document.getElementById('map');

    // Initialize map (placeholder - replace with actual Google Maps API)
    function initMap() {
        if (mapContainer.querySelector('iframe')) {
            return;
        }
        // This is a placeholder. To use real Google Maps:
        // 1. Get a Google Maps API key
        // 2. Add the script: <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
        // 3. Replace this function with actual map initialization

        // For now, we'll embed a Google Maps preview
        const address = 'Av. Alemania 1240, Moderna, 44190 Guadalajara, Jal.';
        const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

        mapContainer.innerHTML = `
            <iframe
                title="Mapa de Perpetuo"
                src="${mapsUrl}"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        `;
    }

    initMap();

    // ===================================
    // MENU ITEM HOVER EFFECTS
    // ===================================
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            const icon = this.querySelector('.menu-item-image');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        });

        item.addEventListener('mouseleave', function () {
            const icon = this.querySelector('.menu-item-image');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // ===================================
    // SERVICE CARD ANIMATIONS
    // ===================================
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // ===================================
    // HOURS ROW HOVER EFFECT
    // ===================================
    const hoursRows = document.querySelectorAll('.hours-row');
    hoursRows.forEach(row => {
        row.addEventListener('mouseenter', function () {
            this.style.transform = 'translateX(10px)';
        });

        row.addEventListener('mouseleave', function () {
            this.style.transform = 'translateX(0)';
        });
    });

    // ===================================
    // PARALLAX EFFECT FOR HERO
    // ===================================
    window.addEventListener('scroll', function () {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // ===================================
    // ACTIVE NAV LINK ON SCROLL
    // ===================================
    window.addEventListener('scroll', function () {
        let current = '';
        const sections = document.querySelectorAll('.section, .hero');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ===================================
    // LOADING ANIMATION
    // ===================================
    window.addEventListener('load', function () {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance
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

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
