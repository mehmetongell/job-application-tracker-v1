import * as jobService from "./job.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../../utils/email.js";
import { getInterviewPrepTemplate } from "../../utils/emailTemplates.js";
import AppError from "../utils/AppError.js";


export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.getJobs(req.user.id, req.query);
  res.status(200).json({ status: "success", results: jobs.length, data: jobs });
});

export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.user.id, req.body);
  res.status(201).json({ status: "success", data: job });
});

export const updateJob = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const jobId = req.params.id;

  const updatedJob = await jobService.updateJob(jobId, req.body);

  if (status === "INTERVIEW") {
    const lastAnalysis = await prisma.analysis.findFirst({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    const emailHtml = getInterviewPrepTemplate(
      req.user.name || "Candidate",
      updatedJob.company,
      lastAnalysis?.matchPercentage || "Unknown",
      lastAnalysis?.tips || ["Prepare for common interview questions."]
    );

    await sendEmail({
      email: req.user.email,
      subject: `Interview Invitation: ${updatedJob.company} Preparation Guide`,
      html: emailHtml
    });
  }

  res.status(200).json({ status: "success", data: updatedJob });
});

export const deleteJob = asyncHandler(async (req, res) => {
  await jobService.deleteJob(req.params.id, req.user.id);
  res.status(204).json({ status: "success", data: null });
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await jobService.getDashboardStats(req.user.id);

  res.status(200).json({
    status: "success",
    data: stats
  });
});

