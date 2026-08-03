const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

// Connect Database
connectDB();

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

// ===============================
// Security Middleware
// ===============================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ===============================
// CORS Configuration
// ===============================
const parseOrigins = (value) =>
  value
    ? value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : ["http://localhost:5173"];

const allowedOrigins = parseOrigins(
  process.env.CLIENT_URL || process.env.FRONTEND_URL || process.env.ALLOWED_ORIGINS || ""
);

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const normalizedAllowedOrigins = [...new Set([...allowedOrigins, ...defaultAllowedOrigins])];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || normalizedAllowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ===============================
// Rate Limiter
// ===============================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: process.env.NODE_ENV === "production" ? 200 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", limiter);

// ===============================
// Body Parser
// ===============================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ===============================
// Static Uploads
// ===============================
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/uploads/:file", (req, res) => {
  const uploadPath = path.join(process.cwd(), "uploads", req.params.file);
  res.sendFile(uploadPath, (error) => {
    if (error) {
      res.status(404).json({ success: false, message: "File not found" });
    }
  });
});

app.get("/uploads", (req, res) => {
  res.status(404).json({ success: false, message: "Upload directory not found" });
});

// ===============================
// Routes
// ===============================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));

// ===============================
// Health Check
// ===============================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PortfolioHub API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ===============================
// 404 Handler
// ===============================
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ===============================
// Global Error Handler
// ===============================
app.use(errorHandler);

// ===============================
// Start Server
// ===============================
const DEFAULT_PORT = Number(process.env.PORT) || 5000;

const startServer = (port = DEFAULT_PORT) => {
  const server = app.listen(port, () => {
    console.log(
      `🚀 Server running in ${
        process.env.NODE_ENV || "development"
      } mode on port ${port}`
    );
  });

  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const fallbackPort = port + 1;
      console.warn(`Port ${port} is busy. Trying ${fallbackPort} instead...`);
      server.close(() => startServer(fallbackPort));
      return;
    }

    console.error(error);
    process.exit(1);
  });
};

const shutdown = () => {
  console.log("Shutting down server...");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();