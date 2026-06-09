# 🚀 MERN Portfolio – Full Stack Developer Portfolio

A production-ready, visually stunning portfolio application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Features a dark theme, smooth animations, admin dashboard with full CRUD, JWT authentication, and more.

---

## ✨ Features

### Portfolio (Public)
- 🎨 **Dark theme** with cyan/purple gradient accents and glassmorphism
- ⚡ **Framer Motion** animations throughout every section
- 🔤 **Typewriter effect** for role titles in the hero
- 📱 **Fully responsive** — mobile, tablet, and desktop
- 🏠 **Hero Section** — animated intro with floating particles
- 👤 **About Section** — bio, stats, highlights
- 💡 **Skills Section** — animated progress bars + tech bubble cloud
- 🖥️ **Projects Section** — live from DB, filterable by category
- 📬 **Contact Section** — validated form that stores to MongoDB

### Admin Dashboard
- 🔐 **JWT Authentication** — protected routes
- ✏️ **Add / Edit / Delete** projects with image upload
- 📧 **View contact messages** with status management
- 📊 **Stats overview** — project count, unread messages
- 🗑️ **Soft delete confirmation** modal

### Backend API
- 🛡️ **JWT middleware** for route protection
- 📁 **Multer** image upload support
- ✅ **Express-validator** input validation
- 🍃 **Mongoose** schemas with validation
- 🔄 **Full CRUD** REST API

---

## 📁 Project Structure

```
mern-portfolio/
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Register, login, getMe
│   │   ├── projectController.js # Projects CRUD
│   │   └── contactController.js # Contact messages
│   ├── middleware/
│   │   └── auth.js              # JWT protect + admin check
│   ├── models/
│   │   ├── User.js              # User schema (bcrypt + JWT)
│   │   ├── Project.js           # Project schema
│   │   └── Contact.js           # Contact message schema
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── projects.js          # Project routes + multer
│   │   └── contact.js           # Contact routes
│   ├── uploads/                 # Uploaded project images
│   ├── seed.js                  # Database seeder
│   ├── server.js                # Main Express entry point
│   ├── .env.example             # Environment variables template
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html           # HTML with Google Fonts
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.js    # Sticky nav with mobile menu
    │   │   │   └── Footer.js
    │   │   └── sections/
    │   │       ├── HeroSection.js
    │   │       ├── AboutSection.js
    │   │       ├── SkillsSection.js
    │   │       ├── ProjectsSection.js
    │   │       └── ContactSection.js
    │   ├── context/
    │   │   └── AuthContext.js   # Global auth state
    │   ├── pages/
    │   │   ├── Portfolio.js     # Main public page
    │   │   ├── LoginPage.js     # Admin login/register
    │   │   └── AdminDashboard.js # Admin CRUD panel
    │   ├── utils/
    │   │   └── api.js           # Axios instance + interceptors
    │   ├── App.js               # Routes + Toaster
    │   ├── index.js             # React entry
    │   └── index.css            # Global styles + Tailwind
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    └── package.json
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local) OR MongoDB Atlas account
- npm or yarn

---

### 1. Clone & Setup

```bash
# Navigate to project root
cd mern-portfolio
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env — set your MongoDB URI and JWT secret
nano .env   # or use VS Code: code .env
```

**Required `.env` values:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_super_long_random_secret_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

```bash
# Seed the database with admin user + sample projects
node seed.js

# Start development server
npm run dev
```

Backend will run at: **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env
nano .env
```

**Required `.env` values:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_OWNER_NAME=Your Name
REACT_APP_OWNER_ROLE=Full Stack Developer
REACT_APP_OWNER_EMAIL=you@example.com
REACT_APP_GITHUB_URL=https://github.com/yourusername
REACT_APP_LINKEDIN_URL=https://linkedin.com/in/yourusername
```

```bash
# Start development server
npm start
```

Frontend will run at: **http://localhost:3000**

---

### 4. Access the App

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Public portfolio |
| `http://localhost:3000/admin/login` | Admin login |
| `http://localhost:3000/admin` | Admin dashboard |
| `http://localhost:5000/api/health` | API health check |

**Default Admin Credentials:**
- Email: `admin@portfolio.com`
- Password: `Admin@123`

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |

### Projects
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/projects` | Public |
| GET | `/api/projects/:id` | Public |
| POST | `/api/projects` | Admin |
| PUT | `/api/projects/:id` | Admin |
| DELETE | `/api/projects/:id` | Admin |

### Contact
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/contact` | Public |
| GET | `/api/contact` | Admin |
| PUT | `/api/contact/:id` | Admin |
| DELETE | `/api/contact/:id` | Admin |

---

## 🚀 Deployment

### Backend (Railway / Render / Heroku)

1. Push backend folder to Git
2. Set environment variables on host:
   - `MONGODB_URI` (use MongoDB Atlas URI)
   - `JWT_SECRET`
   - `FRONTEND_URL` (your Vercel/Netlify URL)
   - `PORT=5000`
3. Set build command: `npm install`
4. Set start command: `npm start`

### Frontend (Vercel / Netlify)

1. Push frontend folder to Git
2. Set environment variables:
   - `REACT_APP_API_URL=https://your-backend.railway.app/api`
   - Other `REACT_APP_*` variables
3. Build command: `npm run build`
4. Output directory: `build`

### MongoDB Atlas (Free Tier)

1. Create account at mongodb.com/atlas
2. Create free M0 cluster
3. Add connection string to backend `.env`

---

## 🎨 Customization

### Update Portfolio Info
Edit `frontend/.env`:
```env
REACT_APP_OWNER_NAME=Your Full Name
REACT_APP_OWNER_EMAIL=your@email.com
REACT_APP_GITHUB_URL=https://github.com/you
REACT_APP_LINKEDIN_URL=https://linkedin.com/in/you
```

### Update Skills
Edit `frontend/src/components/sections/SkillsSection.js` — update the `SKILL_CATEGORIES` array.

### Update About Text
Edit `frontend/src/components/sections/AboutSection.js`.

### Add Resume PDF
Place your `resume.pdf` in `frontend/public/resume.pdf`. The download button will work automatically.

### Update Color Theme
Edit `frontend/tailwind.config.js` — change the `accent` color values.

---

## 🛡️ Security Notes

- ✅ Passwords hashed with bcryptjs (12 salt rounds)
- ✅ JWT tokens expire after 7 days
- ✅ Admin routes protected by middleware
- ✅ Input validation on all endpoints
- ✅ CORS configured for specific frontend origin
- ⚠️ **Change `JWT_SECRET` and admin password before deploying**

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Fonts | Syne (display), DM Sans (body), JetBrains Mono |
| HTTP | Axios |
| Notifications | react-hot-toast |
| File Upload | Multer |

---

## 📄 License

MIT — free to use for personal and commercial projects.

---

Built with ❤️ using the MERN Stack
