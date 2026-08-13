import express from "express";

import {
  createOrUpdateRSVP,
  getEventRSVPs
} from "../controllers/rsvp.controller.js";

import {
  authenticate
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/events/:id/rsvp", authenticate, createOrUpdateRSVP);
router.get("/events/:id/rsvps", getEventRSVPs);

export default router;