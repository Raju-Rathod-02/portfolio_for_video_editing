// =============================================
// ADMIN PANEL FUNCTIONALITY WITH SECURITY
// =============================================

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    // Verify user is logged in
    if (!auth || !auth.isLoggedIn()) {
        window.location.href = './login.html';
        return;
    }

    // Load admin email
    const session = auth.getSession();
    if (session && document.getElementById('admin-email')) {
        document.getElementById('admin-email').textContent = session.email.split('@')[0];
    }

    // Initialize all functionality
    loadStats();
    loadVideosList();
    loadPortfolioList();
    loadServicesList();
    loadContactsList();
    setupEventListeners();
    updateActivityDisplay();
});

// Tab Management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    // Remove active class from all links
    document.querySelectorAll('.tab-link').forEach(link => {
        link.classList.remove('active', 'bg-slate-700');
    });

    // Show selected tab
    const tab = document.getElementById(`${tabName}-tab`);
    if (tab) {
        tab.classList.remove('hidden');
    }

    // Add active class to clicked link
    event.target.closest('.tab-link')?.classList.add('active', 'bg-slate-700');

    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'videos': 'Video Management',
        'portfolio': 'Portfolio Management',
        'services': 'Services Management',
        'contacts': 'Contact Messages',
        'settings': 'Settings'
    };
    document.getElementById('page-title').textContent = titles[tabName] || 'Dashboard';
}

// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.left = sidebar.style.left === '-100%' ? '0' : '-100%';
}

// Close Sidebar (for mobile)
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth < 768) {
        sidebar.style.left = '-100%';
    }
}

// Modal Functions
function openUploadVideoModal() {
    document.getElementById('video-upload-modal').classList.add('active');
    document.getElementById('video-upload-form').reset();
}

function openAddPortfolioModal() {
    document.getElementById('portfolio-modal').classList.add('active');
    document.getElementById('portfolio-form').reset();
}

function openAddServiceModal() {
    document.getElementById('service-modal').classList.add('active');
    document.getElementById('service-form').reset();
}

function openChangePasswordModal() {
    document.getElementById('change-password-modal').classList.add('active');
    document.getElementById('change-password-form').reset();
}

function openModal(modalId) {
    console.log('🔓 Opening modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    } else {
        console.warn('⚠️ Modal not found:', modalId);
    }
}

function closeModal(modalId) {
    console.log('🔐 Closing modal:', modalId);
    document.getElementById(modalId).classList.remove('active');
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// =============================================
// VIDEO UPLOAD & MANAGEMENT
// =============================================

// Video Upload Form Submission
document.getElementById('video-upload-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('📝 Video upload form submitted');

    // Get form fields by correct selectors
    const form = e.target;
    const title = form.querySelector('input[placeholder*="Corporate"]').value.trim();
    const description = form.querySelector('textarea[placeholder*="Describe"]').value.trim();
    const embedCode = form.querySelector('textarea[placeholder*="Paste"]').value.trim();
    const tagsInput = form.querySelector('input[placeholder*="Corporate, 4K"]').value.trim();
    const thumbnail = form.querySelector('input[type="url"]').value.trim();
    const fileInput = form.querySelector('input[type="file"]');
    const file = fileInput?.files[0];

    console.log('📋 Form data extracted:', {title, description, embedCode, tagsInput, thumbnail, hasFile: !!file});

    // Validate
    if (!title) {
        console.warn('❌ Validation failed: Title is empty');
        alert('Video title is required!');
        return;
    }

    if (!description) {
        console.warn('❌ Validation failed: Description is empty');
        alert('Video description is required!');
        return;
    }

    if (!embedCode && !file) {
        console.warn('❌ Validation failed: No URL or file provided');
        alert('Please provide either a YouTube/Vimeo URL or upload a video file!');
        return;
    }

    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : ['Video'];
    let fileData = null;
    
    if (file) {
        console.log('📦 Processing file:', file.name, file.size, 'bytes');
        
        if (file.size > 1024 * 1024 * 1024) {
            console.warn('❌ File too large:', file.size);
            alert('File size exceeds 1GB limit!');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            fileData = {
                name: file.name,
                type: file.type,
                size: file.size
            };
            console.log('✅ File read complete:', fileData);
            saveVideo(title, description, embedCode, tags, thumbnail, fileData);
            form.reset();
        };
        reader.readAsArrayBuffer(file);
    } else {
        console.log('⏭️ No file, using embed code:', embedCode.substring(0, 50) + '...');
        saveVideo(title, description, embedCode, tags, thumbnail, null);
        form.reset();
    }
});

function saveVideo(title, description, embedCode, tags, thumbnail, fileData) {
    const videos = JSON.parse(localStorage.getItem('uploadedVideos')) || [];

    const video = {
        id: Date.now(),
        title,
        description,
        embedCode,
        tags,
        thumbnail: thumbnail || generateVideoThumbnail(),
        uploadDate: new Date().toLocaleString(),
        fileData: fileData,
        views: 0,
        featured: false
    };

    console.log('🎥 Saving video:', video);
    videos.push(video);
    localStorage.setItem('uploadedVideos', JSON.stringify(videos));
    console.log('✅ Video saved to localStorage. Total videos:', videos.length);

    closeModal('video-upload-modal');
    loadVideosList();
    loadStats();
    addActivity(`Uploaded video: ${title}`);
    alert('Video uploaded successfully!');
}

function generateVideoThumbnail() {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// DEBUG FUNCTION - Call from console to verify upload system
window.debugVideoUpload = function() {
    console.log('=== VIDEO UPLOAD DEBUG ===');
    const videos = JSON.parse(localStorage.getItem('uploadedVideos')) || [];
    console.log('Stored Videos:', videos);
    console.log('Video count:', videos.length);
    
    const form = document.getElementById('video-upload-form');
    console.log('Form found:', !!form);
    
    if (form) {
        console.log('Form inputs:', {
            title: form.querySelector('input[placeholder*="Corporate"]')?.value,
            description: form.querySelector('textarea[placeholder*="Describe"]')?.value,
            embedCode: form.querySelector('textarea[placeholder*="Paste"]')?.value,
            tags: form.querySelector('input[placeholder*="Corporate, 4K"]')?.value,
            thumbnail: form.querySelector('input[type="url"]')?.value,
        });
    }
    
    const videosGrid = document.getElementById('videos-grid');
    console.log('Videos grid found:', !!videosGrid);
    console.log('Videos grid HTML children:', videosGrid?.children.length);
    console.log('===========================');
};

// Load Videos List
function loadVideosList() {
    console.log('🔄 Loading videos list...');
    const videos = JSON.parse(localStorage.getItem('uploadedVideos')) || [];
    console.log('📊 Found', videos.length, 'videos in localStorage');
    const videosGrid = document.getElementById('videos-grid');

    if (!videosGrid) {
        console.warn('⚠️ videos-grid element not found!');
        return;
    }

    if (videos.length === 0) {
        videosGrid.innerHTML = `
            <div class="admin-card p-6 rounded-xl text-center text-gray-400 md:col-span-2 lg:col-span-3">
                No videos uploaded yet. Click "Upload Video" to get started.
            </div>
        `;
        return;
    }

    videosGrid.innerHTML = videos.map(video => {
        const thumbnailStyle = video.thumbnail ? `style="background-color: ${video.thumbnail}"` : '';
        return `
        <div class="admin-card p-4 rounded-xl hover:border-blue-400 transition">
            <div class="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden" ${thumbnailStyle}>
                ${video.embedCode ? `
                    <div class="w-full h-full flex items-center justify-center bg-black/50">
                        <a href="${video.embedCode}" target="_blank" class="text-blue-400 hover:text-blue-300 text-center">
                            <i class="fas fa-external-link-alt text-2xl mb-2 block"></i>
                            <span class="text-sm">Open Video</span>
                        </a>
                    </div>
                ` : `<i class="fas fa-play text-white text-4xl opacity-50"></i>`}
            </div>
            <h3 class="text-lg font-bold mb-2">${video.title || 'Untitled'}</h3>
            <p class="text-gray-300 text-sm mb-3">${(video.description || 'No description').substring(0, 80)}...</p>
            <div class="flex gap-1 mb-3 flex-wrap">
                ${(video.tags || []).map(tag => `<span class="badge">${tag}</span>`).join('')}
            </div>
            <div class="flex justify-between items-center text-xs text-gray-400 mb-4 pb-4 border-b border-slate-600">
                <span><i class="fas fa-calendar mr-1"></i>${video.uploadDate}</span>
                <span><i class="fas fa-eye mr-1"></i>${video.views || 0} views</span>
            </div>
            <div class="flex gap-2">
                <button onclick="viewVideoDetails(${video.id})" class="flex-1 text-blue-400 hover:text-blue-300 py-2 rounded hover:bg-blue-500/10 text-sm">
                    <i class="fas fa-eye mr-1"></i> Preview
                </button>
                <button onclick="editVideo(${video.id})" class="flex-1 text-yellow-400 hover:text-yellow-300 py-2 rounded hover:bg-yellow-500/10 text-sm">
                    <i class="fas fa-edit mr-1"></i> Edit
                </button>
                <button onclick="deleteVideo(${video.id})" class="flex-1 text-red-400 hover:text-red-300 py-2 rounded hover:bg-red-500/10 text-sm">
                    <i class="fas fa-trash mr-1"></i> Delete
                </button>
            </div>
        </div>
    `;}
    ).join('');
}

function viewVideoDetails(id) {
    const videos = JSON.parse(localStorage.getItem('uploadedVideos')) || [];
    const video = videos.find(v => v.id === id);

    if (!video) {
        alert('Video not found!');
        return;
    }

    const tags = (video.tags || []).length > 0 ? video.tags.join(', ') : 'No tags';
    const detailsHTML = `
📹 VIDEO DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━
Title: ${video.title}

Description: ${video.description}

Tags: ${tags}

Upload Date: ${video.uploadDate}

Views: ${video.views || 0}

Embed Code: ${video.embedCode || 'No embed code provided'}

Video ID: ${video.id}
    `;

    alert(detailsHTML);
}

function deleteVideo(id) {
    if (confirm('Are you sure you want to delete this video?\n\nThis action cannot be undone.')) {
        console.log('🗑️ Deleting video with ID:', id);
        let videos = JSON.parse(localStorage.getItem('uploadedVideos')) || [];
        const videoName = videos.find(v => v.id === id)?.title || 'Video';
        videos = videos.filter(v => v.id !== id);
        localStorage.setItem('uploadedVideos', JSON.stringify(videos));
        console.log('✅ Video deleted. Total remaining:', videos.length);
        loadVideosList();
        loadStats();
        addActivity(`Deleted video: ${videoName}`);
        alert('Video deleted successfully!');
    }
}

function editVideo(id) {
    console.log('✏️ Opening edit modal for video ID:', id);
    const videos = JSON.parse(localStorage.getItem('uploadedVideos')) || [];
    const video = videos.find(v => v.id === id);
    
    if (!video) {
        console.warn('❌ Video not found with ID:', id);
        alert('Video not found!');
        return;
    }
    
    console.log('📋 Found video:', video.title);
    
    // Populate the edit form with current video data
    const form = document.getElementById('edit-video-form');
    const inputs = form.querySelectorAll('input, textarea');
    
    // Store the video ID
    document.getElementById('edit-video-id').value = id;
    
    // Populate fields: title, description, embedCode, tags, thumbnail
    inputs[1].value = video.title || '';  // Title
    inputs[2].value = video.description || '';  // Description
    inputs[3].value = video.embedCode || '';  // Embed code
    inputs[4].value = (video.tags || []).join(', ');  // Tags
    if (inputs[5]) inputs[5].value = video.thumbnail || '#3b82f6';  // Thumbnail color
    
    openModal('edit-video-modal');
}

// Edit Video Form Submission
document.getElementById('edit-video-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('💾 Edit video form submitted');

    const form = e.target;
    const videoId = parseInt(document.getElementById('edit-video-id').value);
    const inputs = form.querySelectorAll('input, textarea');
    
    const title = inputs[1].value.trim();
    const description = inputs[2].value.trim();
    const embedCode = inputs[3].value.trim();
    const tagsInput = inputs[4].value.trim();
    const thumbnail = inputs[5]?.value || '#3b82f6';
    
    console.log('📝 Edit form data:', {videoId, title, description, embedCode});

    if (!title) {
        alert('Video title is required!');
        return;
    }

    if (!description) {
        alert('Video description is required!');
        return;
    }

    // Update the video in localStorage
    let videos = JSON.parse(localStorage.getItem('uploadedVideos')) || [];
    const videoIndex = videos.findIndex(v => v.id === videoId);

    if (videoIndex === -1) {
        console.warn('❌ Video not found for editing');
        alert('Video not found!');
        return;
    }

    // Update the video object
    videos[videoIndex] = {
        ...videos[videoIndex],
        title,
        description,
        embedCode: embedCode || videos[videoIndex].embedCode,
        tags: tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : videos[videoIndex].tags,
        thumbnail: thumbnail
    };

    console.log('✅ Saving updated video:', videos[videoIndex]);
    localStorage.setItem('uploadedVideos', JSON.stringify(videos));

    closeModal('edit-video-modal');
    loadVideosList();
    loadStats();
    form.reset();
    addActivity(`Updated video: ${title}`);
    alert('Video updated successfully!');
});

// Portfolio Form Submission
document.getElementById('portfolio-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const portfolioItems = JSON.parse(localStorage.getItem('portfolioItems')) || [];

    const item = {
        id: Date.now(),
        title: e.target.querySelector('input[placeholder="Project title"]').value,
        description: e.target.querySelector('textarea').value,
        tags: e.target.querySelector('input[placeholder="e.g. Corporate, 4K, Cinematic"]').value.split(',').map(t => t.trim())
    };

    portfolioItems.push(item);
    localStorage.setItem('portfolioItems', JSON.stringify(portfolioItems));

    closeModal('portfolio-modal');
    loadPortfolioList();
    loadStats();
    addActivity(`Added portfolio item: ${item.title}`);
    alert('Portfolio item added successfully!');
});

// Service Form Submission
document.getElementById('service-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const services = JSON.parse(localStorage.getItem('services')) || [];

    const service = {
        id: Date.now(),
        name: e.target.querySelector('input[placeholder="e.g. Video Editing"]').value,
        description: e.target.querySelector('textarea').value,
        price: e.target.querySelector('input[placeholder="e.g. $1000 - $2500"]').value,
        icon: e.target.querySelector('input[placeholder="e.g. fas fa-cut"]').value
    };

    services.push(service);
    localStorage.setItem('services', JSON.stringify(services));

    closeModal('service-modal');
    loadServicesList();
    loadStats();
    addActivity(`Added service: ${service.name}`);
    alert('Service added successfully!');
});

// Load Portfolio List
function loadPortfolioList() {
    const portfolioItems = JSON.parse(localStorage.getItem('portfolioItems')) || [];
    const portfolioList = document.getElementById('portfolio-list');

    if (portfolioItems.length === 0) {
        portfolioList.innerHTML = `
            <tr class="table-row">
                <td colspan="4" class="px-6 py-8 text-center text-gray-400">
                    No portfolio items yet. Click "Add Item" to create one.
                </td>
            </tr>
        `;
        return;
    }

    portfolioList.innerHTML = portfolioItems.map(item => `
        <tr class="table-row">
            <td class="px-6 py-4 font-semibold">${item.title}</td>
            <td class="px-6 py-4 text-sm text-gray-300">${item.description.substring(0, 50)}...</td>
            <td class="px-6 py-4">
                ${item.tags.map(tag => `<span class="badge">${tag}</span>`).join(' ')}
            </td>
            <td class="px-6 py-4">
                <button onclick="editPortfolioItem(${item.id})" class="text-blue-400 hover:text-blue-300 mr-4">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deletePortfolioItem(${item.id})" class="text-red-400 hover:text-red-300">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Load Services List
function loadServicesList() {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const servicesList = document.getElementById('services-list');

    if (services.length === 0) {
        servicesList.innerHTML = `
            <div class="admin-card p-6 rounded-xl text-center text-gray-400 md:col-span-2">
                No services yet. Click "Add Service" to get started.
            </div>
        `;
        return;
    }

    servicesList.innerHTML = services.map(service => `
        <div class="admin-card p-6 rounded-xl">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-bold">${service.name}</h3>
                    <p class="text-blue-400 font-semibold mt-2">${service.price}</p>
                </div>
                <div class="space-x-2">
                    <button onclick="editService(${service.id})" class="text-blue-400 hover:text-blue-300">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteService(${service.id})" class="text-red-400 hover:text-red-300">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="text-gray-300 text-sm">${service.description}</p>
            <div class="mt-4 pt-4 border-t border-slate-700">
                <p class="text-xs text-gray-400">Icon: ${service.icon}</p>
            </div>
        </div>
    `).join('');
}

// Load Contacts List
function loadContactsList() {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const contactsList = document.getElementById('contacts-list');

    if (contacts.length === 0) {
        contactsList.innerHTML = `
            <tr class="table-row">
                <td colspan="5" class="px-6 py-8 text-center text-gray-400">
                    No messages yet.
                </td>
            </tr>
        `;
        return;
    }

    contactsList.innerHTML = contacts.map((contact, index) => `
        <tr class="table-row">
            <td class="px-6 py-4 font-semibold">${contact.name}</td>
            <td class="px-6 py-4 text-sm">${contact.email}</td>
            <td class="px-6 py-4 text-sm text-gray-300">${contact.message.substring(0, 50)}...</td>
            <td class="px-6 py-4 text-sm text-gray-400">${contact.timestamp}</td>
            <td class="px-6 py-4">
                <button onclick="viewContact(${index})" class="text-blue-400 hover:text-blue-300 mr-2">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="deleteContact(${index})" class="text-red-400 hover:text-red-300">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Delete Functions
function deletePortfolioItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        let items = JSON.parse(localStorage.getItem('portfolioItems')) || [];
        items = items.filter(item => item.id !== id);
        localStorage.setItem('portfolioItems', JSON.stringify(items));
        loadPortfolioList();
        loadStats();
        addActivity('Deleted portfolio item');
    }
}

function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        let services = JSON.parse(localStorage.getItem('services')) || [];
        services = services.filter(service => service.id !== id);
        localStorage.setItem('services', JSON.stringify(services));
        loadServicesList();
        loadStats();
        addActivity('Deleted service');
    }
}

function deleteContact(index) {
    if (confirm('Are you sure you want to delete this contact?')) {
        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        contacts.splice(index, 1);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        loadContactsList();
        loadStats();
    }
}

function viewContact(index) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const contact = contacts[index];
    alert(`
From: ${contact.name}
Email: ${contact.email}
Date: ${contact.timestamp}

Message:
${contact.message}
    `);
}

// Load Stats
function loadStats() {
    const videos = JSON.parse(localStorage.getItem('uploadedVideos')) || [];
    const portfolioItems = JSON.parse(localStorage.getItem('portfolioItems')) || [];
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    // Update stat elements with null checks to prevent errors
    const statVideos = document.getElementById('stat-videos');
    if (statVideos) statVideos.textContent = videos.length;
    
    const statPortfolio = document.getElementById('stat-portfolio');
    if (statPortfolio) statPortfolio.textContent = portfolioItems.length;
    
    const statServices = document.getElementById('stat-services');
    if (statServices) statServices.textContent = services.length;
    
    const statContacts = document.getElementById('stat-contacts');
    if (statContacts) statContacts.textContent = contacts.length;
    
    console.log('📊 Stats updated:', {videos: videos.length, portfolio: portfolioItems.length, services: services.length, contacts: contacts.length});
}

// Activity Log
function addActivity(activity) {
    const activityLog = JSON.parse(localStorage.getItem('activityLog')) || [];
    activityLog.unshift({
        activity,
        timestamp: new Date().toLocaleString()
    });
    // Keep only last 10 activities
    activityLog.splice(10);
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
    updateActivityDisplay();
}

function updateActivityDisplay() {
    const activityLog = JSON.parse(localStorage.getItem('activityLog')) || [];
    const activityElement = document.getElementById('recent-activity');

    if (activityLog.length === 0) {
        activityElement.innerHTML = '<p class="text-gray-400">No recent activity yet. Start managing your portfolio!</p>';
        return;
    }

    activityElement.innerHTML = activityLog.map(log => `
        <div class="flex justify-between text-sm">
            <span class="text-gray-300">${log.activity}</span>
            <span class="text-gray-500">${log.timestamp}</span>
        </div>
    `).join('');
}

// Setup Event Listeners
function setupEventListeners() {
    // Settings form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Settings saved successfully!');
            addActivity('Updated profile settings');
        });
    }

    // Change Password Form
    const changePasswordForm = document.getElementById('change-password-form');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('🔐 Change password form submitted');

            const form = e.target;
            // Use more explicit selectors instead of accessing by index
            const passwordInputs = form.querySelectorAll('input[type="password"]');
            const oldPassword = passwordInputs[0].value.trim();
            const newPassword = passwordInputs[1].value.trim();
            const confirmPassword = passwordInputs[2].value.trim();

            console.log('🔑 Password inputs found:', passwordInputs.length);

            if (!oldPassword) {
                console.warn('❌ Current password is empty');
                alert('Please enter your current password!');
                return;
            }

            if (!newPassword) {
                console.warn('❌ New password is empty');
                alert('Please enter a new password!');
                return;
            }

            if (newPassword !== confirmPassword) {
                console.warn('❌ New passwords do not match');
                alert('New passwords do not match!');
                return;
            }

            if (newPassword.length < 6) {
                console.warn('❌ Password too short');
                alert('Password must be at least 6 characters long!');
                return;
            }

            console.log('✅ Validation passed, changing password...');
            const result = auth.changePassword(oldPassword, newPassword);

            if (result.success) {
                console.log('✅ Password changed successfully');
                alert(result.message);
                closeModal('change-password-modal');
                form.reset();
                addActivity('Changed admin password');
            } else {
                console.warn('❌ Password change failed:', result.message);
                alert(result.message);
            }
        });
    } else {
        console.warn('⚠️ Change password form not found!');
    }

    // Update activity display on page load
    updateActivityDisplay();
}

// Placeholder for edit functions (can be expanded)
function editPortfolioItem(id) {
    alert('Edit functionality can be implemented with a form');
}

function editService(id) {
    alert('Edit functionality can be implemented with a form');
}

// Auto-sync videos to portfolio every 5 seconds
setInterval(() => {
    const videos = JSON.parse(localStorage.getItem('uploadedVideos')) || [];
    localStorage.setItem('syncVideos', JSON.stringify(videos));
}, 5000);

