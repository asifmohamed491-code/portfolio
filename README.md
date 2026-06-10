# 🚀 MERN Portfolio – Full Stack Developer Portfolio

A production-ready portfolio application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring authentication, Cloudinary storage, admin dashboard, and full CRUD functionality.

---

## ✨ Features

### Portfolio (Public)

* 🎨 Modern dark UI
* ⚡ Framer Motion animations
* 📱 Fully responsive
* 👤 Dynamic About section
* 🖥️ Database-powered Projects section
* 📬 Contact form storage

### Admin Dashboard

* 🔐 JWT Authentication
* ✏️ Add / Edit / Delete Projects
* 🖼️ Upload Project Images → Cloudinary
* 👤 Upload Profile Image → Cloudinary
* 📄 Upload Resume PDF → Cloudinary
* 📊 Dashboard Stats

### Backend API

* ☁️ Cloudinary media storage
* 📁 Multer memory upload
* 🍃 MongoDB + Mongoose
* 🔄 Full REST CRUD API

---

# ☁️ Cloudinary Storage

Uploaded files are stored directly in Cloudinary.

```text
portfolio/
├── projects/
├── profile/
└── resume/
```

MongoDB stores:

* secure_url
* public_id
* metadata

---

# 📁 Project Structure

```text
mern-portfolio/
│
├── backend/
│   │
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── contactController.js
│   │   └── projectController.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── Contact.js
│   │   ├── Project.js
│   │   ├── SiteMeta.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── about.js
│   │   ├── auth.js
│   │   ├── contact.js
│   │   ├── projects.js
│   │   └── resume.js
│   │
│   ├── scripts/
│   │   └── migrate-uploads-to-cloudinary.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── sections/
│   │   │
│   │   ├── context/
│   │   │
│   │   ├── pages/
│   │   │
│   │   ├── utils/
│   │   │
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   │
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

```

---

# ⚡ Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env

# Server
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=

# JWT
JWT_SECRET=
JWT_EXPIRE=7d

# Frontend CORS origins
FRONTEND_URL=http://localhost:3000

# Admin seed credentials
ADMIN_EMAIL=
ADMIN_PASSWORD=

# ─── Cloudinary ───────────────────────────────────────────────────────────────
# Get these from: https://cloudinary.com/console → Settings → API Keys
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Run:

```bash
npm run dev
```

---

# ⚡ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Create:

```env
# Absolute URL — never falls back to CRA proxy, ensures CORS headers come through
REACT_APP_API_URL=http://localhost:5000/api

# Portfolio owner info
REACT_APP_OWNER_NAME=
REACT_APP_OWNER_ROLE=
REACT_APP_OWNER_EMAIL=
REACT_APP_GITHUB_URL=
REACT_APP_LINKEDIN_URL=
  

```

---

# 📦 Tech Stack

Frontend

* React
* Tailwind CSS
* Framer Motion

Backend

* Node.js
* Express.js

Database

* MongoDB
* Mongoose

Storage

* Cloudinary
* Multer

Authentication

* JWT
* bcryptjs

---

Built with ❤️ by Mohamed Asif
