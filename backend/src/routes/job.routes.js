import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createJob,
  getAllJobs,
  updateJobStatus,
  deleteJob,
  getJobById,    // Ekledik
  getStats,      // Yeni eklediğimiz dashboard fonksiyonu
  updateJob      // Genel güncelleme için
} from "../controllers/job.controller.js";
import {
  createJobSchema,
  updateJobSchema,       // Ekledik
  updateJobStatusSchema,
} from "../schemas/job.schema.js";

const router = Router();

// Tüm rotalar için giriş yapılmış olması şart
router.use(authMiddleware);

// --- 1. Statik Rotalar (Önce bunlar gelmeli) ---
router.get("/stats", getStats); 

// --- 2. Koleksiyon Rotaları ---
router.get("/", getAllJobs);
router.post("/", validate(createJobSchema), createJob);

// --- 3. Dinamik Rotalar (Parametreli olanlar en sonda) ---
router.get("/:id", getJobById);

// Tüm işi güncellemek için (Şirket, pozisyon vb.)
router.patch("/:id", validate(updateJobSchema), updateJob);

// Sadece statü güncellemek için
router.patch(
  "/:id/status",
  validate(updateJobStatusSchema),
  updateJobStatus
);

router.delete("/:id", deleteJob);

export default router;