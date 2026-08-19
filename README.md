# eGuruKul

**eGuruKul** is a full-stack **Learning Management System (LMS)** built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js).
It allows students to browse courses, enroll, and track progress, while instructors can create, manage, and publish courses.

---

## Features

- **Authentication & Authorization**
  - Secure login/signup using JWT
  - Role-based access: **instructor** (course creator) / **student** (learner)

- **Student Experience**
  - Browse and search published courses
  - Purchase courses via Razorpay (INR)
  - Track course progress with lecture-level completion
  - Manage profile

- **Instructor Dashboard**
  - Create, edit, publish/unpublish, and delete courses
  - Add/edit/remove lectures with video uploads
  - Revenue dashboard with sales charts

- **Courses & Lectures**
  - Video lectures via Cloudinary
  - Course thumbnails, descriptions, categories, levels, pricing
  - Free and paid course support

- **Modern UI**
  - React + Tailwind CSS + shadcn/ui
  - Dark mode support
  - Responsive for mobile and desktop

---

## Tech Stack

**Frontend:** React.js, Redux Toolkit (RTK Query), React Router, Tailwind CSS, shadcn/ui

**Backend:** Node.js, Express.js, MongoDB, Mongoose, Multer, Cloudinary, Razorpay

---

## Environment Variables

Create a `.env` file inside the `server/` folder (see `server/.env.example`):

```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=
SECRET_KEY=
JWT_EXPIRE=5d
COOKIE_EXPIRE=5
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_SERVICE=gmail
SMTP_MAIL=
SMTP_PASSWORD=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

## Installation & Setup

```bash
git clone https://github.com/sureshkumarhere/eGuruKul.git
cd eGuruKul

# Server
cd server
npm install
cp .env.example .env   # fill in your values
npm run dev

# Client (in a new terminal)
cd client
npm install
npm run dev
```

---

## Seed Sample Data

To populate the database with a demo instructor account and 5 sample courses:

```bash
cd server
npm run seed
```

This creates:
- **Instructor account:** `instructor@egurukul.com` / `instructor123`
- **5 published courses** across different categories

The seed script is idempotent — running it again will skip already-created data.

---

## Testing the Flows

### Student Flow
1. Sign up at `/login` (Signup tab) — new users are students by default
2. Browse courses on the homepage
3. Click a course to see details
4. Purchase with Razorpay (or enroll free courses instantly)
5. Access course content and track progress

### Instructor Flow
1. Log in as `instructor@egurukul.com` / `instructor123` (or change any user's role to "instructor" in MongoDB)
2. You'll be redirected to `/admin/dashboard`
3. Use the sidebar to manage courses: Create → Edit → Add Lectures → Publish
4. Published courses appear on the student homepage automatically
5. Use "Back to Home" in the sidebar to view the student-facing site

---

## Roles

| Role       | Description                        |
|------------|------------------------------------|
| student    | Default role, can browse & enroll  |
| instructor | Can create and manage courses      |
