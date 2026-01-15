import './polyfill.js';
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express"; 

import { swaggerSpec } from "./config/swagger.js"; 
import aiRoutes from "./modules/ai/ai.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import jobRoutes from "./jobs/job.routes.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet()); 
app.use(morgan("dev")); 

const corsOptions = {
  origin: [
    "http://localhost:5173",                      
    "https://job-application-tracker-v1.vercel.app", 
    process.env.FRONTEND_URL                     
  ].filter(Boolean), 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true, 
};

app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.use(globalErrorHandler);

export default app;