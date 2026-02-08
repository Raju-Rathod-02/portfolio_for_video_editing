// ================== DYNAMIC CONTENT LOADING ==================

// Load content from API
let pageContent = {};

async function loadPageContent() {
    try {
        const response = await fetch('/api/content');
        if (response.ok) {
            pageContent = await response.json();
            console.log('✅ Page content loaded successfully');
            
            // Validate content structure before updating
            if (typeof pageContent === 'object' && pageContent !== null) {
                updatePageContent();
            } else {
                console.warn('⚠️ Invalid content structure');
            }
        } else {
            console.error('❌ Failed to fetch content. Status:', response.status);
        }
    } catch (err) {
        console.error('❌ Error loading content:', err);
        console.log('ℹ️ Using default content');
    }
}

function updatePageContent() {
    // Update hero section
    if (pageContent.hero) {
        const heroTitle = document.querySelector('h1.text-5xl');
        if (heroTitle) {
            const highlightWord = pageContent.hero.title.split(' ').pop();
            heroTitle.innerHTML = `Transform Your <span class="gradient-text">${highlightWord}</span> Into Reality`;
        }
        
        const heroSubtitle = document.querySelector('section:nth-of-type(1) p.text-2xl.text-gray-300');
        if (heroSubtitle) {
            heroSubtitle.textContent = pageContent.hero.subtitle;
        }
    }

    // Update stats
    if (pageContent.stats && Array.isArray(pageContent.stats)) {
        const statDivs = document.querySelectorAll('section:nth-of-type(2) .grid > div');
        pageContent.stats.forEach((stat, index) => {
            if (statDivs[index]) {
                const counterDiv = statDivs[index].querySelector('.counter');
                const labelDiv = statDivs[index].querySelector('p');
                if (counterDiv) counterDiv.textContent = stat.value;
                if (labelDiv) labelDiv.textContent = stat.label;
            }
        });
    }

    // Update portfolio section title
    if (pageContent.portfolio && typeof pageContent.portfolio === 'object') {
        const portfolioSection = document.getElementById('portfolio');
        if (portfolioSection) {
            const portfolioTitle = portfolioSection.querySelector('h2');
            if (portfolioTitle && pageContent.portfolio.title) {
                portfolioTitle.innerHTML = `<span class="gradient-text">${pageContent.portfolio.title}</span>`;
            }
        }

        // Update portfolio items
        if (pageContent.portfolio.items && Array.isArray(pageContent.portfolio.items)) {
            const portfolioGrid = document.getElementById('portfolio-grid');
            if (portfolioGrid) {
                const existingItems = portfolioGrid.querySelectorAll('.video-card');
                existingItems.forEach(item => item.remove());
                
                pageContent.portfolio.items.forEach(item => {
                    const itemHtml = `
                        <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden hover-lift video-card reveal">
                            <div class="aspect-video bg-gray-700 flex items-center justify-center">
                                <i class="fas fa-video text-4xl text-gray-600"></i>
                            </div>
                            <div class="p-6">
                                <h3 class="text-xl font-bold mb-2">${item.title}</h3>
                                <p class="text-gray-400 mb-4">${item.description}</p>
                                <div class="flex gap-2">
                                    ${item.tags.map(tag => `<span class="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">${tag}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                    portfolioGrid.innerHTML += itemHtml;
                });
            }
        }
    }

    // Update services section title
    if (pageContent.services && typeof pageContent.services === 'object') {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            const servicesTitle = servicesSection.querySelector('h2');
            if (servicesTitle && pageContent.services.title) {
                servicesTitle.innerHTML = `<span class="gradient-text">${pageContent.services.title}</span>`;
            }
        }

        // Update services items
        if (pageContent.services.items && Array.isArray(pageContent.services.items)) {
            const servicesGrid = document.getElementById('services-grid');
            if (servicesGrid) {
                const existingServices = servicesGrid.querySelectorAll('.glass');
                existingServices.forEach(service => service.remove());
                
                pageContent.services.items.forEach(service => {
                    const serviceHtml = `
                        <div class="glass p-8 rounded-xl hover-lift reveal">
                            <div class="text-4xl mb-4">
                                <i class="fas ${service.icon} text-blue-400"></i>
                            </div>
                            <h3 class="text-2xl font-bold mb-4">${service.title}</h3>
                            <p class="text-gray-300 mb-4">${service.description}</p>
                            <p class="text-blue-400 font-bold">${service.price}</p>
                        </div>
                    `;
                    servicesGrid.innerHTML += serviceHtml;
                });
            }
        }
    }

    // Update about section
    if (pageContent.about && typeof pageContent.about === 'object') {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const aboutTitle = aboutSection.querySelector('h2');
            if (aboutTitle && pageContent.about.title) {
                aboutTitle.innerHTML = `<span class="gradient-text">${pageContent.about.title}</span>`;
            }

            const aboutParas = aboutSection.querySelectorAll('p.text-gray-300');
            if (aboutParas[0] && pageContent.about.content1) aboutParas[0].textContent = pageContent.about.content1;
            if (aboutParas[1] && pageContent.about.content2) aboutParas[1].textContent = pageContent.about.content2;
        }
    }

    // Update contact section
    if (pageContent.contact && typeof pageContent.contact === 'object') {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const contactTitle = contactSection.querySelector('h2');
            if (contactTitle && pageContent.contact.title) {
                contactTitle.innerHTML = `<span class="gradient-text">${pageContent.contact.title}</span>`;
            }

            const contactInfos = contactSection.querySelectorAll('.grid.grid-cols-3 p');
            if (contactInfos[0] && pageContent.contact.email) contactInfos[0].textContent = pageContent.contact.email;
            if (contactInfos[1] && pageContent.contact.phone) contactInfos[1].textContent = pageContent.contact.phone;
            if (contactInfos[2] && pageContent.contact.location) contactInfos[2].textContent = pageContent.contact.location;
        }
    }

    // Update footer
    if (pageContent.footer && typeof pageContent.footer === 'object') {
        const footerPs = document.querySelectorAll('footer p');
        if (footerPs[0] && pageContent.footer.copyright) footerPs[0].textContent = `© ${pageContent.footer.copyright}`;
        if (footerPs[1] && pageContent.footer.tagline) footerPs[1].textContent = pageContent.footer.tagline;
    }
}

// Load content when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPageContent);
} else {
    loadPageContent();
}

// ================== ORIGINAL FUNCTIONALITY ==================

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
