import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "5d", // Token valid for 5 days
  });

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "lax", // Allows sending cookie on top-level navigation & cross-origin GET requests
      maxAge: 5 * 24 * 60 * 60 * 1000, // Cookie expires in 5 days (ms)
    })
    .json({
      success: true,
      message,
      user,
    });
};
