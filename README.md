# Stream Monitoring - Deployment Guide

This guide will walk you through setting up the Stream Monitoring application on your local machine.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:
- Git
- Python 3.7+
- Node.js and npm
- A Google account (for YouTube API)
- A Supabase account

---

## 🚀 Step 1: Project Setup

### Clone the Repository
```bash
git clone https://github.com/ZyrusAlvez/Stream-Monitoring.git
cd Stream-Monitoring
```

---

## 🔧 Step 2: Backend Configuration

### Navigate to Backend Directory
```bash
cd backend
```

### Create Environment File
Create a `.env` file in the backend folder with these **exact variable names**:
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Start Backend Server
```bash
uvicorn main:app --reload
```

> ✅ Backend should now be running on http://localhost:8000

---

## 🎨 Step 3: Frontend Configuration

### Open New Terminal & Navigate to Frontend
```bash
cd Stream-Monitoring/frontend
```

### Create Environment File
Create a `.env` file in the frontend folder with these **exact variable names**:
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_KEY=your_supabase_key_here
VITE_BACKEND_URL=http://localhost:8000
```

### Install Dependencies
```bash
npm install
```

### Start Frontend Server
```bash
npm run dev
```

> ✅ Frontend should now be running on http://localhost:5173

---

## 🔑 Step 4: YouTube API Setup

### Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click **Select a project** (top bar) → **New Project**
4. Enter a project name and click **Create**
5. Ensure your new project is selected (check top bar)

### Enable YouTube API

6. Navigate to **APIs & Services** → **Library** (left menu)
7. Search for **YouTube Data API v3**
8. Click on it and press **Enable**

### Generate API Key

9. Go to **APIs & Services** → **Credentials**
10. Click **Create Credentials** → **API Key**
11. Copy the generated API key
12. Update `YOUTUBE_API_KEY` in your backend `.env` file

---

## 🗄️ Step 5: Supabase Database Setup

### Create Supabase Project

1. Visit [Supabase Dashboard](https://app.supabase.com/)
2. Sign in and click **New Project**
3. Fill in:
   - Project name
   - Database password
   - Region
4. Click **Create new project**

### Create Database Tables

5. In your project dashboard, go to **SQL Editor** (left sidebar)
6. Download and open this SQL script: [Database Schema](https://drive.google.com/file/d/1n9Tr5BELcDOKVvnvwT9UGZEwqcmCMgBG/view?usp=sharing)
7. Copy the SQL content and paste it into the editor
8. Click **RUN** to execute the script
9. Verify tables were created in **Table Editor** → **Tables**

---

## 👤 Step 6: Authentication Setup

### Create User Account

1. In Supabase dashboard, click **Authentication** (left sidebar)
2. Go to **Users** tab
3. Click **Add User** → **Create new user**
4. Enter your preferred email and password
5. **Remember this email - you'll need it in the next step**

### Configure Login Credentials

6. Open `frontend/src/pages/Login.tsx`
7. Find line 15 with the `email` variable
8. Replace its value with the email from Step 4

---

## 🔗 Step 7: Connect to Supabase

### Get Connection Details

1. In your Supabase project dashboard, click **Connect** (upper middle)
2. Select **App frameworks**
3. Copy the **Project URL** and **anon/public key**

### Update Environment Files

4. Update both `.env` files:
   - **Backend**: Set `SUPABASE_URL` and `SUPABASE_KEY`
   - **Frontend**: Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY`

---

## ✅ Step 8: Verification

If everything is set up correctly:

- **Backend**: Running on http://localhost:8000
- **Frontend**: Running on http://localhost:5173
- **Database**: Tables created and accessible
- **Authentication**: User account ready
- **YouTube API**: Enabled and key configured

---

## 🆘 Troubleshooting

**Backend won't start?**
- Check if Python dependencies are installed
- Verify `.env` file has correct variable names
- Ensure port 8000 is available

**Frontend won't start?**
- Check if Node.js and npm are installed
- Verify `.env` file has correct variable names with `VITE_` prefix
- Run `npm install` again if needed

**API errors?**
- Verify YouTube API key is valid and API is enabled
- Check Supabase URL and keys are correct
- Ensure database tables were created successfully

---

## 📞 Support

If you encounter issues, please check:
1. All environment variables are correctly named and filled
2. All dependencies are installed
3. Ports 8000 and 5173 are available
4. YouTube API and Supabase services are properly configured