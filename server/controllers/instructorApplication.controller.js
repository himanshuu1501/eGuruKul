import { InstructorApplication } from "../models/instructorApplication.model.js";
import { User } from "../models/user.model.js";

// Student: Submit instructor application
export const submitInstructorApplication = async (req, res) => {
  try {
    const userId = req.id;
    const {
      fullName,
      email,
      phoneNumber,
      areaOfExpertise,
      professionalBio,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !areaOfExpertise || !professionalBio) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled.",
      });
    }

    // Check if user is already an instructor or admin
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role === "instructor" || user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "You already have instructor/admin access.",
      });
    }

    // Check for existing pending application
    const existingApplication = await InstructorApplication.findOne({
      userId,
      status: "pending",
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending application.",
      });
    }

    // If previously rejected, allow resubmission by deleting old one
    if (user.instructorApplicationStatus === "rejected") {
      await InstructorApplication.deleteMany({ userId, status: "rejected" });
    }

    // Create application
    const application = await InstructorApplication.create({
      userId,
      fullName,
      email,
      phoneNumber,
      areaOfExpertise,
      professionalBio,
      linkedinUrl: linkedinUrl || "",
      githubUrl: githubUrl || "",
      portfolioUrl: portfolioUrl || "",
      status: "pending",
    });

    // Update user application status
    await User.findByIdAndUpdate(userId, {
      instructorApplicationStatus: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Your instructor application has been submitted and is awaiting admin review.",
      application,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit instructor application.",
    });
  }
};

// Student: Get own application status
export const getMyApplicationStatus = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId).select("role instructorApplicationStatus");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const application = await InstructorApplication.findOne({ userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      role: user.role,
      instructorApplicationStatus: user.instructorApplicationStatus,
      application: application || null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get application status.",
    });
  }
};

// Admin: Get all instructor applications
export const getAllInstructorApplications = async (req, res) => {
  try {
    const applications = await InstructorApplication.find()
      .populate("userId", "name email photoUrl role instructorApplicationStatus")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get instructor applications.",
    });
  }
};

// Admin: Get single application details
export const getInstructorApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await InstructorApplication.findById(id)
      .populate("userId", "name email photoUrl role instructorApplicationStatus")
      .populate("reviewedBy", "name email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get application details.",
    });
  }
};

// Admin: Approve instructor application
export const approveInstructorApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.id;

    const application = await InstructorApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This application has already been processed.",
      });
    }

    // Update application status
    application.status = "approved";
    application.reviewedBy = adminId;
    application.reviewedAt = new Date();
    await application.save();

    // Update user role and application status
    await User.findByIdAndUpdate(application.userId, {
      role: "instructor",
      instructorApplicationStatus: "approved",
    });

    return res.status(200).json({
      success: true,
      message: "Application approved. User is now an instructor.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to approve application.",
    });
  }
};

// Admin: Reject instructor application
export const rejectInstructorApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.id;
    const { rejectionReason } = req.body;

    const application = await InstructorApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This application has already been processed.",
      });
    }

    // Update application status
    application.status = "rejected";
    application.reviewedBy = adminId;
    application.reviewedAt = new Date();
    application.rejectionReason = rejectionReason || "";
    await application.save();

    // Update user application status (keep role as student)
    await User.findByIdAndUpdate(application.userId, {
      instructorApplicationStatus: "rejected",
    });

    return res.status(200).json({
      success: true,
      message: "Application rejected.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to reject application.",
    });
  }
};
