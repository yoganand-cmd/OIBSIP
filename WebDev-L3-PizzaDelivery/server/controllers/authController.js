
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const createEmailTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email configuration is missing");
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const sendTokenEmail = async ({ email, subject, message, url }) => {
  const transporter = createEmailTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text: `${message}\n\n${url}\n\nThis link expires in 30 minutes.`,
  });
};

// Register a new user and send a verification email.
const registerUser = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      isEmailVerified: false,
      emailVerificationToken: hashToken(rawToken),
      emailVerificationExpires: new Date(Date.now() + 30 * 60 * 1000),
    });

    const clientUrl = process.env.CLIENT_URL;

    if (!clientUrl) {
      await User.deleteOne({ _id: user._id });
      return res.status(500).json({
        message: "Frontend URL is not configured",
      });
    }

    try {
      await sendTokenEmail({
        email,
        subject: "Verify your Pizza Delivery account",
        message: "Click the link below to verify your email:",
        url: `${clientUrl}/verify-email?token=${rawToken}`,
      });
    } catch (emailError) {
      await User.deleteOne({ _id: user._id });
      console.error("Verification email could not be sent");
      return res.status(503).json({
        message: "Could not send verification email. Please try again.",
      });
    }

    return res.status(201).json({
      message: "Registration successful. Check your email to verify your account.",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    console.error("Registration failed:", error.message);
    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

// Verify the token sent by email.
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
      });
    }

    const user = await User.findOne({
      emailVerificationToken: hashToken(token),
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Verification link is invalid or expired",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Email verification failed:", error.message);
    return res.status(500).json({
      message: "Email verification failed",
    });
  }
};

// Login an existing user.
const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login failed:", error.message);
    return res.status(500).json({
      message: "Login failed",
    });
  }
};

// Request a password reset email.
const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Use the same response whether or not the account exists.
    const genericMessage =
      "If an account exists for that email, a reset link will be sent.";

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: genericMessage });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = hashToken(rawToken);
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    try {
      if (!process.env.CLIENT_URL) {
        throw new Error("CLIENT_URL is not configured");
      }

      await sendTokenEmail({
        email,
        subject: "Reset your Pizza Delivery password",
        message: "Use the link below to reset your password:",
        url: `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`,
      });
    } catch (emailError) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();

      console.error("Password reset email could not be sent");
      return res.status(503).json({
        message: "Could not send reset email. Please try again.",
      });
    }

    return res.status(200).json({ message: genericMessage });
  } catch (error) {
    console.error("Forgot password failed:", error.message);
    return res.status(500).json({
      message: "Could not process password reset request",
    });
  }
};

// Set a new password using the reset token.
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token and new password are required",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const user = await User.findOne({
      passwordResetToken: hashToken(token),
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or expired",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully. Please log in.",
    });
  } catch (error) {
    console.error("Password reset failed:", error.message);
    return res.status(500).json({
      message: "Could not reset password",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
