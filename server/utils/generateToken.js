import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE || "5d",
  });

  const cookieExpire = parseInt(process.env.COOKIE_EXPIRE || "5", 10);

  const { password, ...safeUser } = user.toObject ? user.toObject() : user;

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: cookieExpire * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message,
      user: safeUser,
    });
};
