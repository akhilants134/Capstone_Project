const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
require("dotenv").config();

const userRouter = require("./routes/userRoutes");
const listingRouter = require("./routes/listingRoutes");
const matchRouter = require("./routes/matchRoutes");
const messageRouter = require("./routes/messageRoutes");
const notificationRouter = require("./routes/notificationRoutes");
const adminRouter = require("./routes/adminRoutes");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

// Basic Middlewares
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(
  cors({
    origin: (process.env.CLIENT_URL || "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim()),
    credentials: true,
  }),
);

// Body parser
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
const sanitizeNoSqlInput = (value) => {
  if (Array.isArray(value)) {
    value.forEach((item) => sanitizeNoSqlInput(item));
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  Object.keys(value).forEach((key) => {
    if (key.startsWith("$") || key.includes(".")) {
      delete value[key];
      return;
    }

    sanitizeNoSqlInput(value[key]);
  });
};

app.use((req, res, next) => {
  sanitizeNoSqlInput(req.body);
  sanitizeNoSqlInput(req.params);
  sanitizeNoSqlInput(req.query);
  next();
});

// Protect against HTTP Parameter Pollution
app.use(hpp());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/matches", matchRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/admin", adminRouter);

// Basic Route
app.get("/", (req, res) => {
  res.json({ message: "Resource & Donation Matcher API (Lite) is running..." });
});

// Database Connection — Atlas via env, local fallback for dev without .env
const DB =
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  "mongodb://127.0.0.1:27017/resourcematcher";

mongoose
  .connect(DB)
  .then(() => console.log("✅ MongoDB connection successful"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
