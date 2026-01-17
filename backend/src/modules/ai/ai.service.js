import axios from "axios";
import dotenv from "dotenv";
import pdf from 'pdf-parse-fork';
import AppError from "../../utils/AppError.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();
const MODEL_NAME = "gemini-2.0-flash-exp";

export const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    throw new Error("Could not read the PDF file. Ensure it is a valid PDF.");
  }
};

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
    return {
      company: "Unknown",
      position: "Unknown",
      location: "Not Specified",
      notes: "Auto-fill failed to parse details."
    };
  }
};

export const analyzeJobCompatibility = async (jobDescription, userProfile) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY.");

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

    const prompt = `
      Analyze this Job vs Resume/Document. 
      Job: ${jobDescription}
      Document Content: ${userProfile}
      
      Return JSON:
      {
        "matchPercentage": number,
        "missingKeywords": ["skill1", "skill2"],
        "improvementTips": ["tip1", "tip2", "tip3"],
        "summary": "2-sentence outlook on why this matches or does not match."
      }
    `;

    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const aiText = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(aiText.replace(/```json|```/g, "").trim());
  } catch (error) {
    throw new AppError("AI Analysis failed.", 500);
  }
};

export const saveAnalysis = async (userId, analysisData, jobTitle) => {
  return await prisma.analysis.create({
    data: {
      userId,
      jobTitle,
      matchPercentage: analysisData.matchPercentage,
      summary: analysisData.summary,
      missingSkills: analysisData.missingKeywords || [],
      tips: analysisData.improvementTips || []
    }
  });
};


export const generateInterviewQuestions = async (company, position) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
      Create an interview preparation guide for a "${position}" role at "${company}".
      
      Return ONLY a JSON object with this structure:
      {
        "technicalQuestions": [
          {"question": "string", "hint": "brief hint about the answer"}
        ],
        "behavioralQuestions": [
           {"question": "string", "hint": "what interviewers look for"}
        ],
        "curveballQuestion": "one very difficult/trick question",
        "companyCultureTip": "1 sentence tip about this specific company's culture"
      }
      Important: Return ONLY JSON. No markdown.
    `;

    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanJson = aiText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("[AI Service] Interview Prep Error:", error.message);
    return {
      technicalQuestions: [{ question: "Describe a challenging project.", hint: "Focus on problem solving." }],
      behavioralQuestions: [{ question: "Why do you want to work here?", hint: "Show passion." }],
      curveballQuestion: "How many golf balls fit in a bus?",
      companyCultureTip: "Research their values."
    };
  }
};