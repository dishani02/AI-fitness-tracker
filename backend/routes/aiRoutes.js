import express from "express";
import { generateAI } from "../controllers/aiControllers.js";

const router = express.Router();

router.post("/generate", generateAI);

export default router;
