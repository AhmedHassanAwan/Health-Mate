import express from "express";
import { addVitals, getVitals } from "../controllers/vitalsController.js";
import userAuth from "../middleware/userAuth.js";

const vitalsRouter = express.Router();

vitalsRouter.post("/add", userAuth, addVitals);
vitalsRouter.get("/get", userAuth, getVitals);

export default vitalsRouter;
