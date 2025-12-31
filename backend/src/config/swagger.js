import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJSDoc from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Application Tracker API",
      version: "1.0.0",
      description: "Professional API Documentation",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    paths: {
      "/api/jobs/auto-fill": {
        post: {
          summary: "AI Magic Link Scraper",
          tags: ["Jobs"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { url: { type: "string" } }
                }
              }
            }
          },
          responses: { 200: { description: "Success" } }
        }
      },
      "/api/ai/analyze": {
        post: {
          summary: "Analyze job description with AI",
          tags: ["AI"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { description: { type: "string" } }
                }
              }
            }
          },
          responses: { 200: { description: "Analysis successful" } }
        }
      },
      "/api/ai/history": {
        get: {
          summary: "Get my AI analysis history",
          tags: ["AI"],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Success" } }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, "../modules/auth/*.js"), 
  ],
};

export const swaggerSpec = swaggerJSDoc(options);