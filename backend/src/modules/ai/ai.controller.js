import * as aiService from "./ai.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @route   POST /api/ai/analyze
 * @desc    Analyze compatibility using raw text for both job description and profile
 */
export const getJobAnalysis = asyncHandler(async (req, res) => {
  const { jobDescription, userProfile } = req.body;

  if (!jobDescription || !userProfile) {
    throw new AppError("Please provide both job description and user profile text.", 400);
  }

  const analysis = await aiService.analyzeJobCompatibility(jobDescription, userProfile);

  res.status(200).json({
    status: "success",
    data: analysis
  });
});

/**
 * @route   POST /api/ai/analyze-resume
 * @desc    Analyze compatibility by extracting text from an uploaded PDF resume
 */
export const analyzeWithResumeFile = asyncHandler(async (req, res) => {
  const { jobDescription, jobTitle } = req.body;

  if (!jobDescription) throw new AppError("Please provide a job description.", 400);
  if (!req.file) throw new AppError("Please upload a resume.", 400);

  const resumeText = await aiService.extractTextFromPDF(req.file.buffer);

  const analysis = await aiService.analyzeJobCompatibility(jobDescription, resumeText);

  const savedRecord = await aiService.saveAnalysis(req.user.id, analysis, jobTitle || "Unknown Position");

  res.status(200).json({
    status: "success",
    data: {
      analysis,
      recordId: savedRecord.id 
    }
  });
});

/**
 * @route   GET /api/ai/history
 * @desc    Get current user's analysis history
 */
export const getMyAnalyses = asyncHandler(async (req, res) => {
  const history = await prisma.analysis.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" }
  });

  res.status(200).json({
    status: "success",
    results: history.length,
    data: history
  });
});

/**
 * @route   POST /api/ai/interview-prep
 * @desc    Generate interview questions based on company and position
 */
export const getInterviewQuestions = asyncHandler(async (req, res) => {
  const { company, position } = req.body;

  if (!company || !position) {
    throw new AppError("Company and Position are required.", 400);
  }

  const questions = await aiService.generateInterviewQuestions(company, position);

  res.status(200).json({
    status: "success",
    data: questions
  });
});