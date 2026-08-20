# **eGuruKul**

**eGuruKul** is a full-stack **Learning Management System (LMS)** built using the **MERN Stack** — **MongoDB, Express.js, React.js, and Node.js**.

It provides a **role-based e-learning platform** where students can browse and purchase courses, track their learning progress, apply to become instructors, and manage their profiles. Instructor access is controlled through an **admin approval workflow**.

---

## **🚀 Features**

### **🔐 Authentication & Authorization**

- Secure **login and signup** using **JWT-based authentication**
- **Role-Based Access Control (RBAC)** for **Student**, **Instructor**, and **Admin**
- Protected routes to restrict unauthorized dashboard and course management access
- Secure authentication using **JWT tokens and HTTP cookies**

### **👨‍🎓 Student Experience**

- Browse and search **published courses**
- View detailed course information
- Purchase paid courses using **Razorpay**
- Access **free courses**
- Track **lecture-level course progress**
- Manage and update user profile
- Apply to become an instructor
- Track instructor application status

### **👨‍🏫 Instructor Application & Approval Workflow**

- Students can apply to become instructors using their existing account
- Instructor applications remain in a **Pending** state until reviewed
- **Admin approval workflow** for instructor access
- Admin can **approve or reject** instructor applications
- Approved users receive instructor privileges without creating a separate account
- Admin can remove instructor access when required

```text
Student Account
      ↓
Apply to Become an Instructor
      ↓
Application Pending
      ↓
Admin Review
      ↓
Approved / Rejected
      ↓
Instructor Access Enabled

```

## 📚 Instructor Dashboard

- Create new courses
- Edit and update course information
- Publish and unpublish courses
- Delete courses
- Create, edit, and remove lectures
- Upload and manage course content
- Set course price, category, level, description, and thumbnail
- View course sales and revenue analytics

## 🛡️ Admin Dashboard

- Dedicated dashboard for platform management
- Review instructor applications
- Approve or reject instructor requests
- Manage instructor access
- Remove instructor privileges when required
- Monitor platform activity
- Manage courses and educational content

## 🎥 Courses & Lectures

- Create structured courses with multiple lectures
- Video lecture management with Cloudinary integration
- Course thumbnails and rich descriptions
- Course categories and difficulty levels
- Free and paid course support
- Course publishing workflow
- Lecture-level learning progress tracking
- Rich text editor for detailed course descriptions

## 💳 Course Purchase & Enrollment

- Paid course purchase integration using Razorpay
- Free course enrollment support
- Secure course enrollment workflow
- Purchased courses available in the student's dashboard
- Learning progress tracking for enrolled courses

## 🎨 Modern User Interface

- Built with React.js
- Styled using Tailwind CSS
- Reusable UI components with shadcn/ui
- Responsive design for desktop and mobile devices
- Dashboard-based navigation
- Toast notifications for user actions
- Modern and intuitive user experience

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Redux Toolkit
- RTK Query
- React Router
- Tailwind CSS
- shadcn/ui
- Lucide React
- Sonner

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js
- Multer

### Third-Party Services

- Cloudinary — Media and video uploads
- Razorpay — Course payment integration

## 🔑 Environment Variables

Create a `.env` file inside the `server/` folder.

Refer to `server/.env.example` for the required environment variables.

```env
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

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
````

> **Important:** Never commit your actual `.env` file containing secrets to GitHub.

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/himanshuu1501/eGuruKul.git
cd eGuruKul
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file using `.env.example` and add your environment variables.

Start the backend:

```bash
npm run dev
```

### 3. Setup the Frontend

Open a new terminal and run:

```bash
cd client
npm install
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## 🌱 Seed Sample Data

To populate the database with sample data:

```bash
cd server
npm run seed
```

This can create demo data such as:

* Sample instructor account
* Sample courses
* Published course data

Update the seed data according to your current `server/seed.js` configuration.

## 🧪 Testing the Application

### 👨‍🎓 Student Flow

1. Sign up or log in using a student account.
2. Browse and search available courses.
3. View detailed course information.
4. Purchase a paid course using Razorpay or enroll in a free course.
5. Access course lectures.
6. Track learning progress.
7. Apply to become an instructor if desired.

### 👨‍🏫 Instructor Flow

1. Submit an instructor application using a student account.
2. Wait for admin approval.
3. Log in using the same approved account.
4. Access the instructor dashboard.
5. Create a new course.
6. Add course details and lectures.
7. Publish the course.
8. Manage course content and analytics.

### 🛡️ Admin Flow

1. Log in using an admin account.
2. Access the admin dashboard.
3. Review pending instructor applications.
4. Approve or reject instructor requests.
5. Manage instructor access.
6. Monitor courses and platform activity.

## 👥 Roles & Permissions

| Role       | Description                                                                    |
| ---------- | ------------------------------------------------------------------------------ |
| Student    | Default user role; can browse, purchase, enroll, and learn from courses        |
| Instructor | Can create, manage, and publish courses after admin approval                   |
| Admin      | Manages instructor applications, instructors, courses, and platform operations |

## 📁 Project Structure

```text
eGuruKul/
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   └── pages/
│   │       ├── admin/
│   │       ├── instructor/
│   │       └── student/
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── seed.js
│   └── index.js
│
├── .gitignore
└── README.md
```

## ✨ Key Highlights

* Full-Stack MERN Architecture
* JWT-Based Authentication
* Role-Based Access Control
* Admin-Controlled Instructor Approval Workflow
* Protected Routes
* Course Creation and Publishing Lifecycle
* Lecture and Video Content Management
* Razorpay Payment Integration
* Course Enrollment
* Lecture-Level Progress Tracking
* Cloudinary Media Management
* Responsive Modern UI

## 🔮 Future Improvements

* Email or in-app notifications
* Course reviews and ratings
* Certificates after course completion
* Advanced search and filtering
* Personalized course recommendations
* Instructor performance analytics
* Advanced admin reporting
* Student discussion and Q&A system

```
```
