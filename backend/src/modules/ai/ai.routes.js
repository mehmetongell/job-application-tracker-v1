import { Router } from "express";
import * as aiController from "./ai.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js"; 

const router = Router();

router.use(authMiddleware);


router.post("/analyze", aiController.getJobAnalysis);

router.post(
  "/analyze-resume", 
  upload.single("resume"), 
  aiController.analyzeWithResumeFile
);

router.get("/history", aiController.getMyAnalyses);

export default router;