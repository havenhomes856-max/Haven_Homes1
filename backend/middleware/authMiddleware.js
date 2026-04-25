import jwt from "jsonwebtoken";

export const adminProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin access denied - no token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify this is an admin token (has email field matching admin email)
    if (!decoded.email || decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Admin access denied - invalid admin token",
      });
    }

    req.admin = { email: decoded.email };
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Admin access denied - invalid token",
    });
  }
};

export default adminProtect;
