# JobPulse - Job Application Tracker 🚀

A professional, full-stack job application management system designed to help developers track their career journey.

## ✨ Features
- **Secure Auth:** JWT-based user authentication and session management.
- **Dynamic Dashboard:** Real-time statistics (Applied, Interview, Offer, Rejected).
- **Advanced Filtering:** Search applications by company or position name.
- **Responsive UI:** Modern, SaaS-style interface built with Tailwind CSS & Lucide Icons.
- **Robust Backend:** RESTful API built with Express, Prisma ORM, and PostgreSQL.

## 🛠 Tech Stack
- **Frontend:** React.js, Tailwind CSS, React Router, Axios, Lucide Icons.
- **Backend:** Node.js, Express.js, Prisma ORM.
- **Database:** PostgreSQL.
- **Validation:** Zod.

## 🚀 Getting Started

1. **Clone the repo:** `git clone <your-repo-url>`
2. **Backend Setup:**
   - `cd backend`
   - `npm install`
   - Configure `.env` (DATABASE_URL, JWT_SECRET)
   - `npx prisma migrate dev`
   - `npm start`
3. **Frontend Setup:**
   - `cd frontend`
   - `npm install`
   - `npm run dev`