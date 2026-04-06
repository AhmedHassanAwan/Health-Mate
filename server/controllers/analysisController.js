import { GoogleGenAI } from "@google/genai";
import { cloudinary } from "../config/cloudinary.js";
import fs from "fs";
import reportModel from "../models/reportModel.js";

// const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// console.log("Google Gemeni ✅" , process.env.GEMINI_API_KEY);
// console.log("Cloudinary name ✅" , process.env.CLOUDINARY_CLOUD_NAME);
// console.log("Cloudinary API Key ✅" , process.env.CLOUDINARY_API_KEY);
// console.log("Cloudinary API Secret ✅" , process.env.CLOUDINARY_API_SECRET);




const uploadImage = async (req, res) => {
    try {
        // console.log("FILE:", req.file);

        if (!req.file) {
            return res.json({ success: false, message: "No file uploaded" });
        }

        res.json({
            success: true,
            imageUrl: req.file.path
        });

    } catch (error) {
        console.error("UPLOAD ERROR:", error);  
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




const analyzeReport = async (req, res) => {
    try {
        // console.log("req body ✅" , req.body);

        
        // console.log("hellow AnalyzeReport visited ✅");
        
        const { imageUrl, title, type, date } = req.body;
        const userId = req.userId;

        if (!imageUrl) {
            return res.json({ success: false, message: "Image URL is required" });
        }

        const response = await fetch(imageUrl);

        // console.log("Image URL: ✅", imageUrl);

        const buffer = await response.arrayBuffer();
        const base64Data = Buffer.from(buffer).toString("base64");

        const structuredPrompt = `
        You are a medical AI.

STRICT RULES:
- Return ONLY valid JSON
- Do NOT add explanation text
- Do NOT add markdown
- Do NOT add anything outside JSON
- Response must start with { and end with }
Analyze this medical report image. 

Provide a COMPREHENSIVE and EASY TO UNDERSTAND analysis.
For all text fields, provide a Bilingual response: one in English and one in Roman Urdu (Urdu written in English script).

IMPORTANT GUIDELINES:
- If information for a specific field is strictly missing from the report (like Patient Age), provide a friendly explanation like "Information not specified in this document" (EN).
- HOWEVER, for "doctor_questions", "dietary_advice", and "home_remedies", you MUST generate these yourself based on your analysis of the report findings to help the patient or their family, even if they are not explicitly written in the document.
- CRITICAL: Even if the report is an autopsy or medical examiner's report for a deceased person, DO NOT say "not applicable". Instead, provide proactive health insights (e.g., preventative measures for relatives based on the findings) or general wellness tips related to the condition mentioned.
- The summary should be BIG, easy to understand, and provide actionable context for a parent or patient.
- Ensure the tone is supportive and professional.
- ALWAYS include a friendly concluding note: "Always consult your doctor before making any decision." (EN) and "Koi bhi faisla karne se pehle hamesha apne doctor se mashwara karein." (UR).

Return ONLY valid JSON in this exact format:

{
  "summary": {
    "en": "Big and easy to understand summary in English",
    "ur": "Roman Urdu mein wazeh aur bari tafseelat"
  },
  "patient_info": {
    "age": "",
    "gender": ""
  },
  "primary_diagnosis": {
    "en": "",
    "ur": ""
  },
  "medical_conditions": [
    { "en": "", "ur": "" }
  ],
  "developmental_status": {
    "speech": { "en": "", "ur": "" },
    "gross_motor": { "en": "", "ur": "" },
    "fine_motor": { "en": "", "ur": "" },
    "social": { "en": "", "ur": "" },
    "behavior": { "en": "", "ur": "" }
  },
  "strengths": [
    { "en": "", "ur": "" }
  ],
  "recommendations": [
    { "en": "", "ur": "" }
  ],
  "doctor_questions": [
    { "en": "Question 1", "ur": "Sawal 1" }
  ],
  "dietary_advice": {
    "foods_to_avoid": [ { "en": "", "ur": "" } ],
    "foods_to_eat": [ { "en": "", "ur": "" } ]
  },
  "home_remedies": [
    { "en": "", "ur": "" }
  ]
}
`;

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: structuredPrompt },
                        {
                            inlineData: {
                                mimeType: "image/jpeg",
                                data: base64Data,
                            },
                        },
                    ],
                },
            ],
            config: {
                generationConfig: {
                    responseMimeType: "application/json",
                },
            },
        });

        // const responseText = result.text || "";


        // const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        // if (!jsonMatch) {
        //     console.error("AI Response was:", responseText);
        //     throw new Error("AI failed to return valid JSON format");
        // }

        // const analysis = JSON.parse(jsonMatch[0]);

        let analysis;

        try {
            const responseText = result.text || "";

            // console.log("Gemini RAW Response:", responseText); 

            const jsonMatch = responseText.match(/\{[\s\S]*\}/);

            if (!jsonMatch) {
                return res.status(500).json({
                    success: false,
                    message: "AI did not return valid JSON"
                });
            }

            analysis = JSON.parse(jsonMatch[0]);

        } catch (error) {
            console.error("JSON Parse Error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to parse AI response"
            });
        }


        const newReport = new reportModel({
            userId,
            title: title || "Medical Report",
            type: type || "General",
            date: date || new Date(),
            imageUrl,
            analysis
        });

        await newReport.save();

        res.json({ success: true, analysis, reportId: newReport._id });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};




const getUserReports = async (req, res) => {
    console.log("hellow getUserReports  ✅");
    try {
        const userId = req.userId;
        const reports = await reportModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, reports });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get single report by ID
const getReportById = async (req, res) => {
    console.log("hellow getReportById  ✅");

    try {
        const { reportId } = req.params;
        const userId = req.userId;
        const report = await reportModel.findOne({ _id: reportId, userId });

        if (!report) {
            return res.json({ success: false, message: "Report not found or access denied" });
        }

        res.json({ success: true, report });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { uploadImage, analyzeReport, getUserReports, getReportById };









// import { GoogleGenAI } from "@google/genai";
// import reportModel from "../models/reportModel.js";

// const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// // ✅ Upload Image Controller
// export const uploadImage = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No file uploaded"
//             });
//         }

//         return res.json({
//             success: true,
//             imageUrl: req.file.path, // Cloudinary URL hona chahiye
//             publicId: req.file.filename
//         });

//     } catch (error) {
//         console.error("Upload Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // ✅ Analyze Report (MAIN LOGIC)
// export const analyzeReport = async (req, res) => {
//     try {
//         const { imageUrl, title, type, date } = req.body;
//         const userId = req.userId;

//         // 🔴 Validation
//         if (!imageUrl) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Image URL is required"
//             });
//         }

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized user"
//             });
//         }

//         // 🔥 STEP 1: Fetch image
//         let base64Data;
//         try {
//             const response = await fetch(imageUrl);

//             if (!response.ok) {
//                 throw new Error("Image fetch failed");
//             }

//             const buffer = await response.arrayBuffer();
//             base64Data = Buffer.from(buffer).toString("base64");

//         } catch (err) {
//             console.error("Image Fetch Error:", err);

//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to process image"
//             });
//         }

//         // 🔥 STEP 2: SIMPLE TEST PROMPT (100% stable)
//         const prompt = `
// Analyze this medical report image and return ONLY valid JSON.

// {
//   "summary": "Explain report in simple English"
// }
// `;

//         // 🔥 STEP 3: Gemini API call
//         const result = await genAI.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: [
//                 {
//                     role: "user",
//                     parts: [
//                         { text: prompt },
//                         {
//                             inlineData: {
//                                 mimeType: "image/jpeg",
//                                 data: base64Data,
//                             },
//                         },
//                     ],
//                 },
//             ],
//         });

//         console.log("🔍 FULL GEMINI RESPONSE:", result);

//         const text = result.text || "";
//         console.log("🧠 GEMINI TEXT:", text);

//         // 🔥 STEP 4: SAFE JSON PARSE
//         let analysis;

//         try {
//             const jsonMatch = text.match(/\{[\s\S]*\}/);

//             if (!jsonMatch) {
//                 throw new Error("No JSON found in response");
//             }

//             analysis = JSON.parse(jsonMatch[0]);

//         } catch (err) {
//             console.error("❌ JSON Parse Error:", err);

//             return res.status(500).json({
//                 success: false,
//                 message: "AI response parsing failed"
//             });
//         }

//         // 🔥 STEP 5: Save to DB
//         const newReport = new reportModel({
//             userId,
//             title: title || "Medical Report",
//             type: type || "General",
//             date: date || new Date(),
//             imageUrl,
//             analysis
//         });

//         await newReport.save();

//         // 🔥 FINAL RESPONSE
//         return res.json({
//             success: true,
//             analysis,
//             reportId: newReport._id
//         });

//     } catch (error) {
//         console.error("🔥 FINAL ERROR:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // ✅ Get All Reports
// export const getUserReports = async (req, res) => {
//     try {
//         const userId = req.userId;

//         const reports = await reportModel.find({ userId }).sort({ date: -1 });

//         return res.json({
//             success: true,
//             reports
//         });

//     } catch (error) {
//         console.error("Get Reports Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // ✅ Get Single Report
// export const getReportById = async (req, res) => {
//     try {
//         const { reportId } = req.params;
//         const userId = req.userId;

//         const report = await reportModel.findOne({
//             _id: reportId,
//             userId
//         });

//         if (!report) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Report not found"
//             });
//         }

//         return res.json({
//             success: true,
//             report
//         });

//     } catch (error) {
//         console.error("Get Report Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };