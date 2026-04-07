🏥 HealthMate – AI-Powered Medical Insights Platform

HealthMate is a secure, AI-driven medical report analysis platform designed to help users better understand their health data. It transforms complex medical reports into clear, actionable insights in both English and Roman Urdu, making healthcare information more accessible and user-friendly.

🚀 Core Features
AI-Powered Analysis
Utilizes Google Gemini 1.5 Flash to analyze uploaded medical reports and extract meaningful insights.
Bilingual Output
Provides results in both English and Roman Urdu, improving accessibility for a wider audience.
Executive Summary
Generates a simplified, easy-to-understand overview of the medical report.
Actionable Recommendations
Suggests:
Questions to ask doctors
Dietary recommendations (foods to eat/avoid)
Basic home care guidance
Health Vault (Timeline)
Stores all reports in a structured timeline for easy access and history tracking.
Secure Authentication
Implements JWT-based authentication with encrypted passwords for user data protection.
🛠️ Technology Stack

Frontend:

React (Vite)
Tailwind CSS
Axios

Backend:

Node.js & Express
MongoDB (Mongoose)
Google Gemini API
Cloudinary (file storage)
🧠 How the AI System Works
User uploads a medical report
The backend sends the report to the Gemini API with a structured prompt
AI returns a clean JSON response containing:
English insights
Roman Urdu translation
The frontend displays the data based on user-selected language (EN / UR / BOTH)
🔄 Language Toggle Logic

The application uses a viewMode state to control language display:

EN → Shows English content
UR → Shows Roman Urdu content
BOTH → Displays both

👉 No API calls are made when switching languages
👉 The UI simply toggles between already available data

📁 Project Structure
client/ → Frontend (React UI)
server/ → Backend (API, AI processing, authentication)
🎯 Summary

HealthMate simplifies medical data by combining AI intelligence, bilingual accessibility, and secure data management into a single, user-friendly platform.