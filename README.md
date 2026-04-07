 🏥 HealthMate - AI-Powered Medical Insights & Vault



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


 ### 🧠 System Architecture & Logic
**AI Workflow**
**Upload**: User securely uploads a PDF/Image of a medical report.

**Processing**: The backend triggers the Gemini API with a structured prompt.

**Response**: The AI generates a structured JSON response containing both English and Roman Urdu translations.

**Delivery**: The frontend parses the JSON and populates the dashboard.


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


## 🎯 Summary

 ## HealthMate simplifies medical data by combining AI intelligence, bilingual accessibility, and secure data management into a single, user-friendly platform. ## 
