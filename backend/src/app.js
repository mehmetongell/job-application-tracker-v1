import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";

const app = express();

const cors = require('cors');

app.use(cors({
  origin: 'https://job-application-tracker-v1.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

export default app;
