import express from "express";
import { getResponse } from "../controllers/ai.controller.js"; // Import with .js extension

const router = express.Router();

router.post("/get-response", getResponse);

export default router; // Use `export default` instead of `module.exports`
