import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  getStats,
  autoFillFromLink,
  updateJobStatus 
} from "./job.controller.js";
import {
  createJobSchema,
  updateStatusSchema,
} from "./job.validation.js";

const router = Router();

router.post('/auto-fill', authMiddleware, autoFillFromLink);

router.get("/stats", authMiddleware, getStats);
router.get("/", authMiddleware, getAllJobs);
router.post("/", authMiddleware, validate(createJobSchema), createJob);
router.patch("/:id", authMiddleware, validate(updateStatusSchema), updateJob);

router.patch("/:id/status", authMiddleware, updateJobStatus);

router.delete("/:id", authMiddleware, deleteJob);

export default router;