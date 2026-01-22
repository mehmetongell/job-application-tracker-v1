import { Router } from "express";
import * as authController from "./auth.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 * name: Auth
 * description: Authentication management
 */

/**
 * @swagger
 * /auth/register:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * - email
 * - password
 * properties:
 * name:
 * type: string
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 201:
 * description: User registered successfully
 * 400:
 * description: Email already in use
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 * post:
 * summary: Login user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 200:
 * description: Login successful
 * 401:
 * description: Invalid credentials
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/me:
 * get:
 * summary: Get current user profile
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: User profile data
 * 401:
 * description: Not authorized
 */
router.get("/me", authMiddleware, authController.getMe);

/**
 * @swagger
 * /auth/me:
 * patch:
 * summary: Update user profile
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * title:
 * type: string
 * bio:
 * type: string
 * responses:
 * 200:
 * description: Profile updated successfully
 * 401:
 * description: Not authorized
 */
router.patch("/me", authMiddleware, authController.updateProfile);

export default router;