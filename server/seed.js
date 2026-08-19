import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models/user.model.js";
import { Course } from "./models/course.model.js";
import { Lecture } from "./models/lecture.model.js";

dotenv.config();

const INSTRUCTOR_EMAIL = "instructor@egurukul.com";
const ADMIN_EMAIL = "admin@egurukul.com";

const sampleCourses = [
  {
    courseTitle: "Complete MERN Stack Development",
    subtitle: "Build full-stack web apps with MongoDB, Express, React, and Node.js",
    description:
      "<p>Learn to build modern full-stack applications from scratch using the MERN stack. Covers REST APIs, authentication, deployment, and more.</p>",
    category: "MERN Stack Development",
    courseLevel: "Beginner",
    coursePrice: 499,
    isPublished: true,
    lectures: [
      { lectureTitle: "Introduction to MERN Stack", isPreviewFree: true },
      { lectureTitle: "Setting up Node.js & Express", isPreviewFree: false },
      { lectureTitle: "MongoDB & Mongoose Basics", isPreviewFree: false },
    ],
  },
  {
    courseTitle: "Advanced React Patterns & Hooks",
    subtitle: "Master advanced React concepts including custom hooks and compound components",
    description:
      "<p>Take your React skills to the next level. Learn advanced patterns like render props, compound components, custom hooks, and performance optimization.</p>",
    category: "Frontend Development",
    courseLevel: "Advance",
    coursePrice: 799,
    isPublished: true,
    lectures: [
      { lectureTitle: "Custom Hooks Deep Dive", isPreviewFree: true },
      { lectureTitle: "Compound Components Pattern", isPreviewFree: false },
    ],
  },
  {
    courseTitle: "Python for Data Science",
    subtitle: "Hands-on data analysis with Python, Pandas, and Matplotlib",
    description:
      "<p>Learn Python for data science from the ground up. Covers NumPy, Pandas, data visualization, and introductory machine learning concepts.</p>",
    category: "Data Science",
    courseLevel: "Medium",
    coursePrice: 599,
    isPublished: true,
    lectures: [
      { lectureTitle: "Python Basics Refresher", isPreviewFree: true },
      { lectureTitle: "Working with Pandas DataFrames", isPreviewFree: false },
      { lectureTitle: "Data Visualization with Matplotlib", isPreviewFree: false },
    ],
  },
  {
    courseTitle: "Docker & Containerization Essentials",
    subtitle: "Learn Docker from scratch – images, containers, compose, and deployment",
    description:
      "<p>Understand containerization and learn to use Docker for development and deployment. Covers Docker Compose, volumes, networking, and CI/CD basics.</p>",
    category: "Docker",
    courseLevel: "Beginner",
    coursePrice: 399,
    isPublished: true,
    lectures: [
      { lectureTitle: "What is Docker?", isPreviewFree: true },
      { lectureTitle: "Building Your First Image", isPreviewFree: false },
    ],
  },
  {
    courseTitle: "Next.js 14 – The Complete Guide",
    subtitle: "Server components, app router, and full-stack Next.js applications",
    description:
      "<p>Master Next.js 14 with the App Router, server components, server actions, and API routes. Build and deploy production-ready apps.</p>",
    category: "Next JS",
    courseLevel: "Medium",
    coursePrice: 699,
    isPublished: true,
    lectures: [
      { lectureTitle: "App Router Fundamentals", isPreviewFree: true },
      { lectureTitle: "Server vs Client Components", isPreviewFree: false },
      { lectureTitle: "Data Fetching Strategies", isPreviewFree: false },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    let instructor = await User.findOne({ email: INSTRUCTOR_EMAIL });
    if (!instructor) {
      const hashedPassword = await bcrypt.hash("instructor123", 10);
      instructor = await User.create({
        name: "Demo Instructor",
        email: INSTRUCTOR_EMAIL,
        password: hashedPassword,
        role: "instructor",
      });
      console.log("Created instructor account:", INSTRUCTOR_EMAIL);
    } else {
      console.log("Instructor already exists, skipping creation.");
    }

    // Create admin account
    let admin = await User.findOne({ email: ADMIN_EMAIL });
    if (!admin) {
      const adminPassword = await bcrypt.hash("admin123", 10);
      admin = await User.create({
        name: "Admin",
        email: ADMIN_EMAIL,
        password: adminPassword,
        role: "admin",
        instructorApplicationStatus: "none",
      });
      console.log("Created admin account:", ADMIN_EMAIL);
    } else {
      console.log("Admin already exists, skipping creation.");
    }

    const existingCourseCount = await Course.countDocuments({ creator: instructor._id });
    if (existingCourseCount >= sampleCourses.length) {
      console.log(`Instructor already has ${existingCourseCount} courses – skipping seed.`);
      await mongoose.disconnect();
      return;
    }

    for (const courseData of sampleCourses) {
      const exists = await Course.findOne({
        courseTitle: courseData.courseTitle,
        creator: instructor._id,
      });
      if (exists) {
        console.log(`Course "${courseData.courseTitle}" already exists – skipping.`);
        continue;
      }

      const lectureIds = [];
      for (const lec of courseData.lectures) {
        const lecture = await Lecture.create(lec);
        lectureIds.push(lecture._id);
      }

      await Course.create({
        courseTitle: courseData.courseTitle,
        subtitle: courseData.subtitle,
        description: courseData.description,
        category: courseData.category,
        courseLevel: courseData.courseLevel,
        coursePrice: courseData.coursePrice,
        isPublished: courseData.isPublished,
        creator: instructor._id,
        lectures: lectureIds,
      });
      console.log(`Created course: ${courseData.courseTitle}`);
    }

    console.log("\nSeed completed successfully!");
    console.log(`Instructor login: ${INSTRUCTOR_EMAIL} / instructor123`);
    console.log(`Admin login: ${ADMIN_EMAIL} / admin123`);
    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
