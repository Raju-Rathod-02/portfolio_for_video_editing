# 🎬 Raju Video Portfolio - Deployment Guide

Premium video editing portfolio website with secure admin panel.

## 📋 Features

- ✅ Responsive portfolio showcase
- ✅ Secure admin panel with authentication
- ✅ Video management (upload, edit, delete)
- ✅ Contact form integration
- ✅ Activity logging
- ✅ Password management
- ✅ Mobile-friendly design

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js v14+ installed
- npm (comes with Node.js)

### Installation

1. **Navigate to project folder:**
```bash
cd d:\portfoli
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the server:**
```bash
npm start
```

4. **Open in browser:**
```
http://localhost:3000
```

### Admin Panel
- **URL:** http://localhost:3000/admin
- **Email:** admin@raju.com
- **Password:** admin123

## 🌐 Deployment Options

### Option 1: Heroku (Easiest - Free/Paid)

1. **Install Heroku CLI:** https://devcenter.heroku.com/articles/heroku-cli

2. **Login to Heroku:**
```bash
heroku login
```

3. **Create app:**
```bash
heroku create YOUR_APP_NAME
```

4. **Deploy:**
```bash
git push heroku main
```

5. **View site:**
```bash
heroku open
```

### Option 2: Vercel (Free/Paid)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Follow prompts and open link**

### Option 3: Render (Free/Paid)

1. **Go to:** https://render.com
2. **Sign up with GitHub**
3. **Create new Web Service**
4. **Connect your repository**
5. **Set Start Command:** `node server.js`
6. **Deploy**

### Option 4: Traditional Hosting (Shared/VPS)

1. **Upload files to server via FTP**
2. **SSH into server:**
```bash
ssh user@yourdomain.com
```

3. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install dependencies:**
```bash
npm install
```

5. **Start with PM2 (for persistence):**
```bash
npm install -g pm2
pm2 start server.js --name "raju-portfolio"
pm2 startup
pm2 save
```

6. **Setup Nginx reverse proxy:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 5: Docker (Production-Ready)

Create `Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t raju-portfolio .
docker run -p 3000:3000 raju-portfolio
```

## 📁 Project Structure

```
d:\portfoli\
├── index.html              # Main portfolio page
├── server.js               # Express server (new!)
├── package.json            # Dependencies (new!)
├── .gitignore             # Git ignore file (new!)
├── js/
│   ├── main.js            # Portfolio JS
│   ├── admin.js           # Admin panel JS
│   └── auth.js            # Authentication
├── admin/
│   ├── index.html         # Admin dashboard
│   └── login.html         # Admin login
└── README.md              # This file
```

## 🔐 Security Notes

- Change default admin password immediately after deployment
- Store passwords in environment variables for production
- Use HTTPS on live sites (auto with Heroku/Vercel)
- Keep Node.js updated

## 📊 Environment Variables

Create `.env` file for production:
```env
NODE_ENV=production
PORT=3000
```

## 🐛 Troubleshooting

### Port already in use:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Dependencies not installing:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Server won't start:
```bash
node -v          # Check Node version
npm -v           # Check npm version
npm list          # Check installed packages
```

## 📝 Admin Features

- **Dashboard:** Statistics and quick actions
- **Videos:** Upload, edit, delete videos
- **Portfolio:** Manage portfolio items
- **Services:** Add/edit service offerings
- **Contacts:** View contact form submissions
- **Settings:** Change password, view activity log

## 🎨 Customization

Edit `index.html` to:
- Change portfolio content
- Update service descriptions
- Modify contact information
- Customize styling with Tailwind CSS

## 📞 Support

For issues:
1. Check browser console (F12)
2. Check server logs
3. Verify all files are present
4. Ensure Node.js is up to date

## 📄 License

ISC - Raju Productions 2026

---

**Ready to deploy? Start with Option 1 (Heroku) for easiest setup!** 🚀
