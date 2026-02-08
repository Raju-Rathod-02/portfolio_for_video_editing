# Content Management System - User Guide

## Overview
Your portfolio now has a complete **Content Management System (CMS)** that allows you to control all text, pricing, and content from the admin panel without editing HTML files!

## Features

### 📝 Content Sections You Can Control

1. **Hero Section**
   - Main title (e.g., "Transform Your Vision Into Reality")
   - Subtitle/tagline

2. **Stats Section**
   - Update counters (e.g., "500+", "150+")
   - Update labels (e.g., "Projects Completed", "Satisfied Clients")

3. **Portfolio Section**
   - Section title
   - Each portfolio item:
     - Title
     - Description
     - Tags/Categories

4. **Services Section**
   - Section title
   - Each service:
     - Service name (e.g., "Video Editing")
     - Description
     - **Price** (e.g., "$2000 - $5000") ✨

5. **About Section**
   - Title
   - Two paragraphs of content

6. **Contact Section**
   - Contact section title
   - Email address
   - Phone number
   - Location

7. **Footer**
   - Copyright text
   - Tagline

## How to Use

### Step 1: Login to Admin Panel
1. Open your website and click **"Admin Panel"** button
2. Or go to: `http://yoursite.com/admin`
3. Login with your credentials

### Step 2: Navigate to Content Management
1. Click **"Content Management"** in the sidebar
2. You'll see all sections that can be edited

### Step 3: Edit Content
- **For text fields**: Simply type or update the text
- **For prices**: Update prices in the Services section (e.g., "$1500 - $3000")
- **For tags/categories**: Enter comma-separated values (e.g., "Corporate, 4K, Cinematic")

### Step 4: Save Changes
- Click the **"Save"** button for each section
- You'll see a success message
- Changes appear **instantly** on your front page!

## Example: Changing a Service Price

1. Go to **Content Management**
2. Scroll to **Services Section**
3. Find the "Video Editing" service
4. Change the price from "$2000 - $5000" to your new price
5. Click **"Save Services"**
6. Check your website - price updates immediately! ✨

## Example: Adding a Portfolio Item Description

1. Go to **Content Management**
2. Scroll to **Portfolio Section**
3. Update a portfolio item's description
4. Add tags (comma-separated) like "Music, 4K, Cinematic"
5. Click **"Save Portfolio"**
6. Done!

## Data Storage

- All content is saved in: `data/content.json`
- Changes are **persistent** - they're saved even after you close the browser
- The front page loads content from this file automatically

## API Endpoints (For Developers)

If you want to integrate with other tools:

```
GET    /api/content                    - Get all content
GET    /api/content/:section           - Get specific section (e.g., /api/content/services)
POST   /api/content/:section           - Update entire section
POST   /api/content/:section/item      - Add new item to section
PUT    /api/content/:section/item/:id  - Update specific item
DELETE /api/content/:section/item/:id  - Delete specific item
```

## Tips & Tricks

✅ **What you can customize:**
- All text, titles, and descriptions
- All prices and pricing information
- Stats and counters
- Contact information
- Social links (update contact section)

⚠️ **What's not customizable via CMS:**
- Layout and design
- Colors and styling
- Images and thumbnails
- Navigation structure

## Troubleshooting

**Q: Changes don't appear on the front page?**
- A: Refresh your browser (Ctrl+F5 to do a hard refresh)

**Q: Can I add more portfolio items?**
- A: Not yet through the UI, but the backend supports it. Contact your developer.

**Q: Changes didn't save?**
- A: Check the browser console (F12) for error messages. Ensure you're logged in.

## Security Note

- Only authenticated admin users can modify content
- All changes are logged
- Make regular backups of your `data/content.json` file

---

**Happy Editing!** 🎬
Update your portfolio content anytime, anywhere from the admin panel.
