import { z } from "zod";

export const createJobSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional(),
  status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED"]).optional(),
}).strict();

export const updateStatusSchema = z.object({
  status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED"], {
    errorMap: () => ({ message: "Invalid status value" }),
  }),
}).strict();