# 🚀 JobPulse - AI-Powered Career Hub

JobPulse is not just a job application tracker; it's an intelligent career assistant. It combines a Kanban-style workflow with **Google Gemini AI** to analyze resumes, generate personalized interview questions, and auto-fill job details from URLs.

Built to help developers manage their job hunt efficiently with a modern, responsive, and interactive interface.

## ✨ Key Features

### 🤖 AI Intelligence (Powered by Google Gemini)
- **Interview Coach:** Generates custom technical and behavioral interview questions based on the specific company and role you applied for.
- **Smart Resume Analyzer:** Upload your PDF resume and get a match score (%) against the job description, along with missing keywords and improvement tips.
- **Auto-Fill from URL:** Paste a LinkedIn or job post URL, and the AI scrapes and extracts the Company, Position, and Location automatically.

### 📋 Application Management
- **Interactive Kanban Board:** Drag-and-drop applications between stages (Applied → Interview → Offer → Rejected) with seamless backend synchronization.
- **Dynamic Dashboard:** Real-time statistics, average AI match scores, and visual status breakdown.
- **Search & Filter:** Instantly filter applications by company name.

### 👤 User Experience
- **Secure Authentication:** JWT-based robust login/register system.
- **Profile Management:** Update personal details, job titles, and bio.
- **Modern UI:** Glassmorphism effects, animated transitions, and a clean, responsive design using Tailwind CSS.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **State & Interactions:** React Router, Axios, React Hot Toast
- **Drag & Drop:** @hello-pangea/dnd
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **AI Integration:** Google Generative AI SDK (Gemini)
- **Scraping:** Puppeteer
- **Validation:** Zod
- **Documentation:** Swagger UI



## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd job-application-tracker

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
cd backend
npm install

Create a .env file in the backend directory and configure the following variables:
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/jobpulse?schema=public"
JWT_SECRET="your_super_secret_random_key"
JWT_EXPIRES_IN="7d"
GEMINI_API_KEY="your_google_gemini_api_key"

Run database migrations to create the necessary tables:
npx prisma migrate dev --name init

Start the backend server:
npm run dev

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend folder, and install dependencies:
cd frontend
npm install

Start the React development server:
npm run dev

### 4. Access the App
Open your browser and navigate to: http://localhost:5173

🚀 Deployment
The project is ready to be deployed on cloud platforms.

Backend (Render / Railway)
1. Push your code to GitHub.

2. Create a new Web Service on Render or Railway.

3. Connect your GitHub repository and select the backend folder as the root directory.

4. Set the Build Command: npm install && npx prisma generate

5. Set the Start Command: npm start

6. Add your Environment Variables (DATABASE_URL, JWT_SECRET, GEMINI_API_KEY) in the dashboard.

Frontend (Vercel / Netlify)
1. Import your GitHub repository to Vercel.

2. Select the frontend folder as the root directory.

3. The Build Command should be automatically detected as npm run build.

4. Deploy! 🚀

📚 API Documentation
The backend comes with built-in Swagger documentation. Once the backend server is running locally, you can explore the API endpoints at: http://localhost:5000/api-docs

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project

2. Create your Feature Branch (git checkout -b feature/AmazingFeature)

3. Commit your Changes (git commit -m 'Add some AmazingFeature')

4. Push to the Branch (git push origin feature/AmazingFeature)

5. Open a Pull Request