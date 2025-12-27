import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createJob,
  getAllJobs,
  updateJobStatus,
  deleteJob,
  getJobById,    
  getStats,     
  updateJob      
} from "../controllers/job.controller.js";
import {
  createJobSchema,
  updateJobSchema,       
  updateJobStatusSchema,
} from "../schemas/job.schema.js";

const router = Router();

router.use(authMiddleware);

router.get("/stats", getStats); 

router.get("/", getAllJobs);
router.post("/", validate(createJobSchema), createJob);

router.get("/:id", getJobById);

router.patch("/:id", validate(updateJobSchema), updateJob);


router.patch(
  "/:id/status",
  validate(updateJobStatusSchema),
  updateJobStatus
);

router.delete("/:id", deleteJob);

export default router;