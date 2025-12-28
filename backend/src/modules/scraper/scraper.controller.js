import * as scraperService from "./scraper.service.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from "../utils/asyncHandler.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const autoFillJobData = asyncHandler(async (req, res) => {
  const { url } = req.body;

  const rawData = await scraperService.scrapeJobData(url);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `
    Extract the following information from this raw job data:
    Raw Data: ${JSON.stringify(rawData)}
    
    Return ONLY a JSON object with these keys:
    "companyName", "jobTitle", "location", "jobType" (Remote/Hybrid/On-site).
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const structuredData = JSON.parse(response.text().replace(/```json|```/g, ""));

  res.status(200).json({
    status: "success",
    data: structuredData
  });
});