import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import rsvpRoutes from "./routes/rsvp.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api", rsvpRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "RSVP Tracker API is running"
    });
});


app.use(errorHandler);

export default app;