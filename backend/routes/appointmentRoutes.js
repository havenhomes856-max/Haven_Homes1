import express from "express";
import {
  scheduleViewing,
  getAllAppointments,
  updateAppointmentStatus,
  updateAppointmentMeetingLink,
  getAppointmentStats
} from "../controller/appointmentController.js";


const router = express.Router();

// User routes — guest booking supported
router.post("/schedule", scheduleViewing);              // Guest booking (no auth required)

// Admin routes
router.get("/all", getAllAppointments);
router.get("/stats", getAppointmentStats);
router.put("/status", updateAppointmentStatus);
router.put("/update-meeting", updateAppointmentMeetingLink);

export default router;