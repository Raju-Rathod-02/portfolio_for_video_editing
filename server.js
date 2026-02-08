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
