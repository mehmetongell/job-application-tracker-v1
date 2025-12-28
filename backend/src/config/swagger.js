import swaggerJSDoc from "swagger-jsdoc";

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get job applications (filter, paginate, sort)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [APPLIED, INTERVIEW, OFFER, REJECTED]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 */



const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Application Tracker API",
      version: "1.0.0",
      description: "Professional API Documentation for Job Tracking Platform",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Server"
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/modules/**/*.js", "./src/jobs/*.js"], 
};

export const swaggerSpec = swaggerJSDoc(options);
