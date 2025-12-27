import { z } from "zod";

export const createJobSchema = z.object({
  company: z.string().min(2),
  position: z.string().min(2),
  status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED"]),
});
