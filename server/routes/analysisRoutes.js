import { uploadImage, analyzeReport, getUserReports, getReportById } from "../controllers/analysisController.js";
import { upload } from "../config/cloudinary.js";
import userAuth from "../middleware/userAuth.js";
import express from "express";

const analysisRouter = express.Router();

// Route to upload image to Cloudinary (protected)
analysisRouter.post("/upload", userAuth, upload.single("image"), uploadImage);

// Route to analyze report using Gemini (protected)
analysisRouter.post("/analyze", userAuth, analyzeReport);

// Route to get all reports for a user (protected)
analysisRouter.get("/all", userAuth, getUserReports);

// Route to get single report by ID (protected)
analysisRouter.get("/report/:reportId", userAuth, getReportById);

export default analysisRouter;
