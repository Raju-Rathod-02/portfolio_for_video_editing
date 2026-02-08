// Raju Video Portfolio - Web Server
// This server serves the portfolio website and handles all requests

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// Serve admin files
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Routes

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin panel
app.get('/admin/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.get('/admin/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Admin login
app.get('/admin/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

// File system and content management
const fs = require('fs');
const contentFile = path.join(__dirname, 'data', 'content.json');

// Helper function to read content
function getContent() {
    try {
        if (fs.existsSync(contentFile)) {
            const data = fs.readFileSync(contentFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('Error reading content:', err);
    }
    return {};
}

// Helper function to save content
function saveContent(data) {
    try {
        const dir = path.dirname(contentFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(contentFile, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error('Error saving content:', err);
        return false;
    }
}

// API Routes for future backend integration
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields are required' 
        });
    }

    console.log(`📧 New contact message from ${name} (${email}): ${message}`);
    
    // Store in memory for this session (in production, use a database)
    res.json({ 
        success: true, 
        message: 'Message received successfully! We will get back to you soon.' 
    });
});

// ============================================
// CONTENT MANAGEMENT API ENDPOINTS
// ============================================

// GET all content
app.get('/api/content', (req, res) => {
    const content = getContent();
    res.json(content);
});

// GET specific section
app.get('/api/content/:section', (req, res) => {
    const content = getContent();
    const section = req.params.section;
    
    if (content[section]) {
        res.json(content[section]);
    } else {
        res.status(404).json({ success: false, message: 'Section not found' });
    }
});

// UPDATE content section
app.post('/api/content/:section', (req, res) => {
    const content = getContent();
    const section = req.params.section;
    
    // Update the section with new data
    if (!content[section]) {
        content[section] = Array.isArray(req.body) ? [] : {};
    }
    
    // Handle arrays separately to avoid spreading array into object
    if (Array.isArray(req.body)) {
        content[section] = req.body;
    } else {
        content[section] = { ...content[section], ...req.body };
    }
    
    if (saveContent(content)) {
        console.log(`✅ Content updated: ${section}`);
        res.json({ success: true, message: 'Content updated successfully', data: content[section] });
    } else {
        res.status(500).json({ success: false, message: 'Error saving content' });
    }
});

// UPDATE specific item in a section (for arrays)
app.put('/api/content/:section/item/:id', (req, res) => {
    const content = getContent();
    const section = req.params.section;
    const itemId = parseInt(req.params.id);
    
    if (content[section] && content[section].items && Array.isArray(content[section].items)) {
        const itemIndex = content[section].items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            content[section].items[itemIndex] = { ...content[section].items[itemIndex], ...req.body };
            
            if (saveContent(content)) {
                console.log(`✅ Item updated: ${section}/${itemId}`);
                res.json({ success: true, message: 'Item updated successfully', data: content[section].items[itemIndex] });
            } else {
                res.status(500).json({ success: false, message: 'Error saving content' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Item not found' });
        }
    } else {
        res.status(400).json({ success: false, message: 'Invalid section or format' });
    }
});

// ADD new item to a section
app.post('/api/content/:section/item', (req, res) => {
    const content = getContent();
    const section = req.params.section;
    
    if (content[section] && content[section].items && Array.isArray(content[section].items)) {
        const newItem = {
            id: Math.max(...content[section].items.map(item => item.id || 0)) + 1,
            ...req.body
        };
        
        content[section].items.push(newItem);
        
        if (saveContent(content)) {
            console.log(`✅ Item added: ${section}`);
            res.json({ success: true, message: 'Item added successfully', data: newItem });
        } else {
            res.status(500).json({ success: false, message: 'Error saving content' });
        }
    } else {
        res.status(400).json({ success: false, message: 'Invalid section or format' });
    }
});

// DELETE item from a section
app.delete('/api/content/:section/item/:id', (req, res) => {
    const content = getContent();
    const section = req.params.section;
    const itemId = parseInt(req.params.id);
    
    if (content[section] && content[section].items && Array.isArray(content[section].items)) {
        const itemIndex = content[section].items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            content[section].items.splice(itemIndex, 1);
            
            if (saveContent(content)) {
                console.log(`✅ Item deleted: ${section}/${itemId}`);
                res.json({ success: true, message: 'Item deleted successfully' });
            } else {
                res.status(500).json({ success: false, message: 'Error saving content' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Item not found' });
        }
    } else {
        res.status(400).json({ success: false, message: 'Invalid section or format' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        server: 'Raju Portfolio Server',
        environment: NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Handle 404 errors
app.use((req, res) => {
    console.warn(`⚠️ 404 Not Found: ${req.method} ${req.path}`);
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`❌ Server Error:`, err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

// Start server
app.listen(PORT, () => {
    const URL = `http://localhost:${PORT}`;
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║    🎬 RAJU VIDEO PORTFOLIO SERVER                       ║
║                                                            ║
║    Server running on: ${URL}
║    Environment: ${NODE_ENV}
║    Node version: ${process.version}
║                                                            ║
║    👉 Open http://localhost:${PORT} in your browser      ║
║    👉 Admin panel: http://localhost:${PORT}/admin        ║
║    👉 Demo login: admin@raju.com / admin123            ║
║                                                            ║
║    Press CTRL+C to stop the server                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);

    // Log all requests in development
    if (NODE_ENV === 'development') {
        app.use((req, res, next) => {
            console.log(`${req.method} ${req.path}`);
            next();
        });
    }
});

// Handle process termination
process.on('SIGTERM', () => {
    console.log('\n📴 Server shutting down...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n📴 Server shutting down...');
    process.exit(0);
});
