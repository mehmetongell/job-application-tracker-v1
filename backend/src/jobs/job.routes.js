import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  getStats,
} from "./job.controller.js";
import {
  createJobSchema,
  updateStatusSchema,
} from "./job.validation.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/jobs/stats:
 * get:
 * summary: Get analytics
 * tags: [Jobs]
 */
router.get("/stats", getStats);

/**
 * @swagger
 * /api/jobs:
 * get:
 * summary: List jobs
 * tags: [Jobs]
 */
router.get("/", getAllJobs);

/**
 * @swagger
 * /api/jobs:
 * post:
 * summary: Create job
 * tags: [Jobs]
 */
router.post("/", validate(createJobSchema), createJob);

/**
 * @swagger
 * /api/jobs/{id}:
 * patch:
 * summary: Update job
 * tags: [Jobs]
 */
router.patch("/:id", validate(updateStatusSchema), updateJob);

/**
 * @swagger
 * /api/jobs/{id}:
 * delete:
 * summary: Delete job
 * tags: [Jobs]
 */
router.delete("/:id", deleteJob);

export default router;