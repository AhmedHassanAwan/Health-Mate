# 🏥 HealthMate - AI-Powered Medical Insights & Vault

![HealthMate Banner](client/public/assets/HealthMate%20thumbnail.png)

HealthMate is a premium, secure medical report management and AI analysis platform. It empowers users to take control of their health data by transforming complex medical documents into actionable, bilingual insights.

---

## 🚀 Core Features

### 1. Intelligent Medical Analysis
- **AI-Powered Diagnostics**: Utilizes **Google Gemini 1.5 Flash** to analyze uploaded medical reports.
- **Actionable Insights**: Automatically generates suggested doctor questions, dietary advice (foods to eat/avoid), and supportive home remedies.
- **Bilingual Support**: Full support for **English** and **Roman Urdu**, ensuring accessibility for a wider audience.
- **Executive Summary**: Provides a clear, big-picture overview of medical findings.

### 2. Secure Health Vault (Timeline)
- **Centralized History**: A beautiful, chronologically organized timeline of all your medical reports and vitals.
- **Smart Filtering**: Quickly filter between "Reports" and "Vitals" with a themed category switcher.
- **Visual Evidence**: Stores and displays original document previews alongside AI analysis.

### 3. User Experience & Security
- **Premium Interface**: A sleek, dark-mode-inspired aesthetic using modern CSS (Glassmorphism, linear gradients).
- **Drag & Drop Upload**: Intuitive file interaction with real-time visual feedback.
- **Secure Authentication**: Robust JWT-based authentication system with password hashing and email verification.

---

## 🛠️ Technology Stack

### Frontend (Client-Side)
| Technology | Purpose |
| :--- | :--- |
| **React 19** | The core library for building the interactive user interface. |
| **Vite** | Next-generation frontend tool for fast development and optimized builds. |
| **Tailwind CSS 4** | Used for rapid, utility-first styling with a custom "Premium" design system. |
| **Lucide React** | A consistent and beautiful icon library. |
| **React Router 7** | Handles client-side routing and navigation smoothly. |
| **Axios** | For making secure API requests to the backend. |
| **React Hot Toast** | For lightweight, non-intrusive user notifications. |
| **Lenis UI** | Implemented for modern, smooth-scrolling behavior. |

### Backend (Server-Side)
| Technology | Purpose |
| :--- | :--- |
| **Node.js & Express 5** | The runtime and framework powering the RESTful API. |
| **MongoDB & Mongoose** | NoSQL database used for storing user data, reports, and analysis. |
| **Google Gemini API** | Advanced AI model used for medical image/text analysis. |
| **Cloudinary** | Secure cloud storage service for medical report images. |
| **JSON Web Token (JWT)** | For secure, stateless user authentication. |
| **Bcryptjs** | Used for standard industry-level password hashing. |
| **Nodemailer** | Handles backend email triggers (verification, password resets). |
| **Multer** | Middleware for handling multipart/form-data (file uploads). |

---

## 🧠 Technical Deep-Dive (For Interview/QA)

### 1. How does the AI Analysis work?
The backend sends the medical report (stored in Cloudinary) along with a **Structured Prompt** to Google's Gemini-1.5-Flash model. The prompt is engineered to return a strict JSON structure.
- **The Challenge**: AI sometimes adds conversational "chatter".
- **The Solution**: We implemented a robust **Regex-based JSON extractor** in `analysisController.js` to ensure only the raw JSON is parsed, preventing application crashes.

### 2. Why Vercel Routing Configuration?
Single Page Applications (SPAs) like React handle routing internally. If a user refreshes `/dashboard`, the server looks for a file that doesn't exist.
- **The Solution**: We added `vercel.json` with a **Rewrite Rule** that directs all traffic to `index.html`, letting React Router take over.

### 3. Bilingual Approach
To bridge the gap in healthcare accessibility, we instructed the AI to provide every clinical finding in both English and Roman Urdu. The frontend uses a dynamic `viewMode` state to toggle between languages seamlessly.

---

## 📁 Project Structure

```bash
HealthMate/
├── client/                # React Vite Frontend
│   ├── src/
│   │   ├── pages/         # Dashboard, Timeline, Upload, ViewReport
│   │   ├── components/    # Navbar, Footer, Shared UI
│   │   └── context/       # Global State Management (AppContext)
│   └── vercel.json        # Frontend Deployment Config
└── server/                # Express Node.js Backend
    ├── controllers/       # Business Logic (Analysis, Auth, User)
    ├── models/            # Mongoose Schemas (User, Report)
    ├── routes/            # API Endpoints
    └── vercel.json        # Backend Deployment Config
```

---

## 🏁 Getting Started

1. **Clone the Repo**
2. **Install Dependencies**: `npm install` in both `client` and `server` folders.
3. **Environment Variables**: Set up your `.env` with:
   - `GEMINI_API_KEY`
   - `CLOUDINARY_URL`
   - `MONGODB_URI`
   - `JWT_SECRET`
4. **Run Locally**:
   - Client: `npm run dev`
   - Server: `npm run server`
