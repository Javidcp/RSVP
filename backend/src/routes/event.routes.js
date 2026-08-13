import express from "express";

import {
    createEvent,
    deleteEvent,
    getEventById,
    getEvents,
    getEventsByRSVPStatus,
    getMyEvents,
    updateEvent
} from "../controllers/event.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getEvents);

router.get("/my-events", authenticate, getMyEvents);
router.get("/rsvp", authenticate, getEventsByRSVPStatus);

router.get("/:id", getEventById);

router.post("/", authenticate, createEvent);
router.put("/:id", authenticate, updateEvent);
router.delete("/:id", authenticate, deleteEvent);

export default router;