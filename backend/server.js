const dotenv = require("dotenv");
dotenv.config(); 

const express   = require("express");
const cors      = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();

// ── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174"
].filter(Boolean); // filter(Boolean) se agar process.env.CLIENT_URL undefined bhi ho toh error nahi aayega

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));

app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks",    require("./routes/taskRoutes"));

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
