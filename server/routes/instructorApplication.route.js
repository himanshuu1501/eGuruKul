import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAuthenticatedAdmin from "../middlewares/isAuthenticatedAdmin.js";
import {
  submitInstructorApplication,
  getMyApplicationStatus,
  getAllInstructorApplications,
  getInstructorApplicationById,
  approveInstructorApplication,
  rejectInstructorApplication,
} from "../controllers/instructorApplication.controller.js";

const router = express.Router();

// Student routes
router.route("/apply").post(isAuthenticated, submitInstructorApplication);
router.route("/status").get(isAuthenticated, getMyApplicationStatus);

// Admin routes
router.route("/admin/applications").get(isAuthenticatedAdmin, getAllInstructorApplications);
router.route("/admin/applications/:id").get(isAuthenticatedAdmin, getInstructorApplicationById);
router.route("/admin/applications/:id/approve").put(isAuthenticatedAdmin, approveInstructorApplication);
router.route("/admin/applications/:id/reject").put(isAuthenticatedAdmin, rejectInstructorApplication);

export default router;
