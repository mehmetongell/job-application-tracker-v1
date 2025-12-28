import { Router } from "express";
import * as userController from "./user.controller.js";

const router = Router();

router.get("/public/:username", userController.getPublicProfile);
router.patch("/updateMe", authMiddleware, userController.updateMe);

export default router;