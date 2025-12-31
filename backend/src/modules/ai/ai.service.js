/**
 * @file ai.service.js
 * @description Service for handling Google Gemini AI integrations for job analysis and auto-fill.
 */

import axios from "axios";
import dotenv from "dotenv";
import pdf from 'pdf-parse-fork';
import AppError from "../../utils/AppError.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();
const MODEL_NAME = "gemini-2.0-flash-exp";

/**
 * NEW: Analyzes raw scraped text to extract structured job application data.
 * Matches the JobApplication model in schema.prisma.
 */
export const analyzeJobDescription = async (rawText) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

    const prompt = `
      Act as a data extraction expert. Extract job details from the provided text.
      The text is scraped from a job board. Identify the company, position, and location.
      
      Text: ${rawText}
      
      Return ONLY a JSON object with these exact keys:
      {
        "company": "string",
        "position": "string",
        "location": "string",
        "notes": "string (a very brief 1-sentence summary of the role)"
      }
      Important: No markdown, no prose, strictly JSON.
    `;

    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) throw new Error("AI failed to provide content.");

    const cleanJson = aiText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("[AI Service] Auto-fill Extraction Error:", error.message);
    return { 
      company: "Unknown", 
      position: "Unknown", 
      location: "Not Specified", 
      notes: "Auto-fill failed to parse details." 
    };
  }
};

/**
 * Analyzes the compatibility between a job description and a user profile.
 */
export const analyzeJobCompatibility = async (jobDescription, userProfile) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY.");

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

    const prompt = `
      Analyze this Job vs Resume. 
      Job: ${jobDescription}
      Resume: ${userProfile}
      
      Return JSON:
      {
        "matchPercentage": number,
        "missingKeywords": ["skill1", "skill2"],
        "improvementTips": ["tip1", "tip2", "tip3"],
        "summary": "2-sentence outlook"
      }
    `;

    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const aiText = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(aiText.replace(/```json|```/g, "").trim());
  } catch (error) {
    console.error("[AI Service] Compatibility Analysis Error:", error.message);
    throw new AppError("AI Analysis failed.", 500);
  }
};

