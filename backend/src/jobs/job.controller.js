import * as jobService from "./job.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/email.js";
import { getInterviewPrepTemplate } from "../utils/emailTemplates.js";
import { scrapeJobLink } from '../modules/scraper/scraper.service.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as scraperService from "../modules/scraper/scraper.service.js";
import * as aiService from "../modules/ai/ai.service.js";
import prisma from "../prisma/client.js"; 
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

export const updateJobStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 

  const validStatuses = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];
  if (!validStatuses.includes(status)) {
    throw new AppError("Invalid status value.", 400);
  }

  const updatedJob = await prisma.jobApplication.update({
    where: { 
      id: id,
      userId: req.user.id 
    },
    data: { status }
  });

  res.status(200).json({
    status: "success",
    data: updatedJob
  });
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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const autoFillFromLink = async (req, res) => {
  try {
    const { url } = req.body;
    const userId = req.user.id; 

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const rawContent = await scraperService.scrapeJobLink(url);

    const aiParsedData = await aiService.analyzeJobDescription(rawContent);

    const newJobApplication = await prisma.jobApplication.create({
      data: {
        company: aiParsedData.company || "Unknown Company",
        position: aiParsedData.position || "Unknown Position",
        location: aiParsedData.location || "Not Specified",
        notes: aiParsedData.notes || "",
        status: "APPLIED", 
        userId: userId
      }
    });

    console.log(`[Job Controller] Job saved: ${newJobApplication.id}`);

    return res.status(201).json({
      success: true,
      message: "Job details extracted and saved successfully",
      data: newJobApplication
    });

  } catch (error) {
    console.error("[Job Controller] Auto-fill Error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: "Could not process job application",
      details: error.message 
    });
  }
};