import crypto from "crypto";
import Razorpay from "razorpay";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { User } from "../models/user.model.js";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });


let razorpay = null;

if (
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET
) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export const createOrder = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    if (!course.isPublished) {
      return res.status(400).json({ message: "Course is not published yet." });
    }

    if (course.creator.toString() === userId) {
      return res.status(400).json({ message: "You cannot purchase your own course." });
    }

    const existingPurchase = await CoursePurchase.findOne({
      courseId,
      userId,
      status: "completed",
    });
    if (existingPurchase) {
      return res.status(400).json({ message: "You have already purchased this course." });
    }

    if (!course.coursePrice || course.coursePrice === 0) {
      const purchase = await CoursePurchase.create({
        courseId,
        userId,
        amount: 0,
        status: "completed",
        paymentId: "free",
      });

      await User.findByIdAndUpdate(userId, {
        $addToSet: { enrolledCourses: courseId },
      });
      await Course.findByIdAndUpdate(courseId, {
        $addToSet: { enrolledStudents: userId },
      });

      return res.status(200).json({
        success: true,
        message: "Enrolled in free course successfully.",
        free: true,
      });
    }

    if (!razorpay) {
      return res.status(503).json({
        message: "Payment gateway is not configured. Please contact support.",
      });
    }

    const amountInPaise = Math.round(course.coursePrice * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${courseId}_${userId}_${Date.now()}`,
      notes: { courseId, userId },
    });

    await CoursePurchase.create({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
      paymentId: order.id,
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseName: course.courseTitle,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment verification data." });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await CoursePurchase.findOneAndUpdate(
        { paymentId: razorpay_order_id },
        { status: "failed" }
      );
      return res.status(400).json({ success: false, message: "Payment verification failed." });
    }

    const purchase = await CoursePurchase.findOne({ paymentId: razorpay_order_id });
    if (!purchase) {
      return res.status(404).json({ message: "Purchase record not found." });
    }

    purchase.status = "completed";
    purchase.paymentId = razorpay_payment_id;
    await purchase.save();

    await User.findByIdAndUpdate(purchase.userId, {
      $addToSet: { enrolledCourses: purchase.courseId },
    });
    await Course.findByIdAndUpdate(purchase.courseId, {
      $addToSet: { enrolledStudents: purchase.userId },
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and course enrolled successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Payment verification failed" });
  }
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator", select: "name photoUrl" })
      .populate({ path: "lectures" });

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    const purchased = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
    });

    return res.status(200).json({
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get course details" });
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");
    return res.status(200).json({
      purchasedCourse: purchasedCourse || [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get purchased courses" });
  }
};
