import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticatedAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if (!decode || !decode.userId) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    const user = await User.findById(decode.userId).select("role");

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
        success: false,
      });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

export default isAuthenticatedAdmin;
