// Scroll effects
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Reveal elements on scroll
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            reveal.classList.add('active');
        }
    });
});

// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when link is clicked
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Counter animation
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Start counter animation when section is visible
const counterSection = document.querySelector('.grid');
let counterStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !counterStarted) {
            document.querySelectorAll('.counter').forEach(counter => {
                const target = parseInt(counter.textContent);
                animateCounter(counter, target);
            });
            counterStarted = true;
        }
    });
}, { threshold: 0.5 });

if (counterSection) {
    counterObserver.observe(counterSection);
}

// Contact form submission
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.querySelector('input[placeholder="Your name"]').value,
        email: document.querySelector('input[placeholder="your@email.com"]').value,
        message: document.querySelector('textarea').value
    };

    // Store in localStorage for demo
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts.push({
        ...formData,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('contacts', JSON.stringify(contacts));

    // Show success message
    alert('Message sent successfully! I will get back to you soon.');
    document.getElementById('contact-form').reset();
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Portfolio items (can be fetched from admin)
function loadPortfolioItems() {
    const uploadedVideos = JSON.parse(localStorage.getItem('uploadedVideos')) || [];
    const items = JSON.parse(localStorage.getItem('portfolioItems')) || [];
    console.log('📹 Loading portfolio - Found', uploadedVideos.length, 'uploaded videos and', items.length, 'portfolio items');
    
    // Combine uploaded videos with portfolio items
    const allItems = [...uploadedVideos, ...items];
    
    if (allItems.length > 0) {
        const grid = document.getElementById('portfolio-grid');
        grid.innerHTML = '';
        
        allItems.slice(0, 6).forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden hover-lift video-card reveal';
            
            // Check if this is a video (has uploadDate property)
            if (item.uploadDate) {
                // This is an uploaded video
                const videoUrl = item.embedCode || '#';
                card.innerHTML = `
                    <div class="aspect-video bg-gray-700 flex items-center justify-center relative overflow-hidden group" style="background-color: ${item.thumbnail || '#374151'}">
                        <i class="fas fa-play text-white text-4xl opacity-50 group-hover:opacity-100 transition-opacity"></i>
                        ${item.embedCode ? `
                            <a href="${item.embedCode}" target="_blank" class="absolute inset-0 flex items-center justify-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 group-hover:bg-black/50">
                                <span class="text-sm">Watch on Platform</span>
                            </a>
                        ` : ''}
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2">${item.title || 'Untitled'}</h3>
                        <p class="text-gray-400 mb-4">${(item.description || 'Video project').substring(0, 80)}...</p>
                        <div class="flex gap-2 flex-wrap">
                            ${(item.tags || []).map(tag => `<span class="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">${tag}</span>`).join('')}
                        </div>
                        ${item.embedCode ? `<div class="mt-4 pt-4 border-t border-gray-700">
                            <a href="${item.embedCode}" target="_blank" class="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1">
                                <i class="fas fa-external-link-alt"></i> Watch Video
                            </a>
                        </div>` : ''}
                    </div>
                `;
            } else {
                // This is a portfolio item
                card.innerHTML = `
                    <div class="aspect-video bg-gray-700 flex items-center justify-center">
                        <i class="fas fa-video text-4xl text-gray-600"></i>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2">${item.title || 'Untitled'}</h3>
                        <p class="text-gray-400 mb-4">${(item.description || 'Project').substring(0, 80)}...</p>
                        <div class="flex gap-2 flex-wrap">
                            ${(item.tags || []).map(tag => `<span class="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">${tag}</span>`).join('')}
                        </div>
                    </div>
                `;
            }
            grid.appendChild(card);
        });
    }
}

// Services items
function loadServices() {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    if (services.length > 0) {
        const grid = document.getElementById('services-grid');
        grid.innerHTML = '';
        
        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'glass p-8 rounded-xl hover-lift reveal';
            card.innerHTML = `
                <div class="text-4xl mb-4">
                    <i class="${service.icon}"></i>
                </div>
                <h3 class="text-2xl font-bold mb-4">${service.name}</h3>
                <p class="text-gray-300 mb-4">${service.description}</p>
                <p class="text-blue-400 font-bold">${service.price}</p>
            `;
            grid.appendChild(card);
        });
    }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioItems();
    loadServices();
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const parallaxElements = document.querySelectorAll('.animate-float');
    parallaxElements.forEach((el, index) => {
        el.style.transform = `translateY(${scrollPos * 0.5 * (index + 1)}px)`;
    });
});
