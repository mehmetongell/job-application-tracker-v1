/**
 * @file ai.service.js
 * @description Service for handling Google Gemini AI integrations for job analysis.
 */

import axios from "axios";
import dotenv from "dotenv";
import pdf from "pdf-parse";
import prisma from "../../config/client.js";
import AppError from "../../utils/AppError.js";

dotenv.config();

/**
 * Analyzes the compatibility between a job description and a user profile.
 * * @param {string} jobDescription - The full text of the job advertisement.
 * @param {string} userProfile - The candidate's resume or profile details.
 * @returns {Promise<Object>} Returns a structured JSON analysis.
 */
export const analyzeJobCompatibility = async (jobDescription, userProfile) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in environment variables.");
    }

    const model = "gemini-2.0-flash-exp";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const prompt = `
      Act as an expert career coach and technical recruiter. 
      Analyze the following Job Description against the User's Profile/Resume.
      
      Job Description: ${jobDescription}
      User Profile: ${userProfile}
      
      Provide a response strictly in JSON format with these keys:
      1. "matchPercentage": (number between 0-100)
      2. "missingKeywords": (array of technical skills/tools mentioned in the job but missing in the profile)
      3. "improvementTips": (array of 3 actionable tips to improve the application)
      4. "summary": (a 2-sentence professional outlook)
      
      Important: Return ONLY the JSON object. No markdown tags, no prose.
    `;

    const response = await axios.post(API_URL, {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    const candidate = response.data.candidates?.[0];
    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      throw new Error("Invalid response structure from Google AI API.");
    }

    const aiText = candidate.content.parts[0].text;

    const cleanJson = aiText.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanJson);

  } catch (error) {
    const detailedError = error.response?.data?.error?.message || error.message;
    console.error("AI_SERVICE_ERROR:", detailedError);

    throw new AppError(
      `AI Analysis failed: ${detailedError}`, 
      error.response?.status || 500
    );
  }
};

export const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new AppError("Could not read the PDF file. Make sure it is not corrupted.", 400);
  }
};

export const saveAnalysis = async (userId, analysisData, jobTitle = "Unknown Job") => {
  return await prisma.analysis.create({
    data: {
      userId,
      jobTitle,
      matchPercentage: analysisData.matchPercentage,
      summary: analysisData.summary,
      missingSkills: analysisData.missingKeywords,
      tips: analysisData.improvementTips
    }
  });
};

/**
 * Generates personalized interview questions based on match analysis
 */
export const generateInterviewQuestions = async (jobDescription, userProfile) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = "gemini-2.0-flash-exp"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const prompt = `
      Based on this Job: ${jobDescription} 
      And this Resume: ${userProfile}
      
      Generate 5 personalized technical interview questions that focus on the "missing skills" or "weak points" of the candidate. 
      Also provide a "Best Answer Hint" for each.
      Return ONLY a JSON array: [{"question": "...", "hint": "..."}]
    `;

    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const aiText = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(aiText.replace(/```json|```/g, "").trim());
  } catch (error) {
    console.error("Interview Prep Error:", error);
    return []; 
  }
};

