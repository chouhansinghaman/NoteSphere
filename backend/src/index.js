import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"

import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js"
import rateLimiter from "./middleware/rateLimiter.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2001;
const __dirname = path.resolve();

// Middlewares
if (process.env.NODE_ENV !== "production") {
    app.use(cors({
        origin: "http://localhost:5173",
    }));
}

app.use(express.json());
app.use(rateLimiter);

// Routes
app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

// 🚨 DEBUG: Dump registered routes to detect malformed paths
console.log("🚀 Dumping registered route paths:");
app._router.stack.forEach((middleware) => {
    if (middleware.route && middleware.route.path) {
        console.log("➡️", middleware.route.path);
    }
});

// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("✅ Server is running on port:", PORT);
    });
});