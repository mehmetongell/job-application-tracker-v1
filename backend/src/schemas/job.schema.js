import { z } from "zod";

export const createJobSchema = z.object({
  body: z.object({
    company: z.string().min(1, "Company is required"),
    position: z.string().min(1, "Position is required"),
    location: z.string().optional(),
    status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED"]).optional(),
  }),
});

export const updateJobSchema = z.object({
  body: z.object({
    company: z.string().optional(),
    position: z.string().optional(),
    location: z.string().optional(),
    status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED"]).optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const updateJobStatusSchema = z.object({
  body: z.object({
    status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED"]),
  }),
  params: z.object({
    id: z.string(),
  }),
});
