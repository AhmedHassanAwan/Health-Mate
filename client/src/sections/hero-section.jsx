import { Loader2Icon, SparklesIcon, TrendingUpIcon, UploadCloudIcon, CheckCircleIcon } from "lucide-react";
import Marquee from "react-fast-marquee";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


export default function HeroSection() {
    const [prompt, setPrompt] = useState("");
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);
    const [file, setFile] = useState(null);

    const { uploadReport, analyzeReport, isLoggedIn } = useContext(AppContext);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            toast.error("Please login to analyze reports");
            navigate("/login");
            return;
        }

        if (!file) {
            toast.error("Please upload a report image first");
            return;
        }

        setLoading(true);
        try {
            // 1. Upload to Cloudinary
            const uploadRes = await uploadReport(file);
            if (!uploadRes.success) throw new Error(uploadRes.message);

            // 2. AI Analysis
            const analysisRes = await analyzeReport(uploadRes.imageUrl, file.name, "General", new Date().toISOString().split('T')[0]);
            if (!analysisRes.success) throw new Error(analysisRes.message);

            toast.success("Analysis Complete!");

            // 3. View Results
            navigate("/view-report", {
                state: {
                    analysis: analysisRes.analysis,
                    imageUrl: uploadRes.imageUrl,
                    title: file.name,
                    date: new Date().toISOString().split('T')[0],
                    type: "General"
                }
            });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            toast.success("Report selected: " + e.target.files[0].name);
        }
    };

    const placeholders = [
        "lab report explanation...",
        "prescription summary...",
        "MRI scan highlights...",
        "blood test analysis...",
        "vitals tracking...",
    ];


    const prompts = [
        {
            label: "Blood Test",
            prompt: "Analyze my CBC report and explain it in simple English and Roman Urdu. Highlights abnormal values.",
        },
        {
            label: "Prescription",
            prompt: "Explain these medicines and their timing. What should I avoid while taking them?",
        },
        {
            label: "MRI / X-Ray",
            prompt: "Summarize this scan result. What are the key findings I should discuss with my doctor?",
        },
        {
            label: "BP & Sugar",
            prompt: "I recorded BP 130/80 and Sugar 95 today. Is this normal? Add this to my timeline.",
        },
        {
            label: "Diet Suggestion",
            prompt: "Based on my high uric acid report, what foods should I avoid and what should I eat?",
        },
    ];


    useEffect(() => {
        if (prompt) return;

        const currentWord = placeholders[textIndex];

        if (!deleting && charIndex === currentWord.length) {
            setTimeout(() => setDeleting(true), 2000);
            return;
        }

        if (deleting && charIndex === 0) {
            setDeleting(false);
            setTextIndex((prev) => (prev + 1) % placeholders.length);
            return;
        }

        const timeout = setTimeout(() => {
            setCharIndex((prev) => prev + (deleting ? -1 : 1));
        }, 50);

        return () => clearTimeout(timeout);
    }, [charIndex, deleting, textIndex, prompt]);

    const animatedPlaceholder = placeholders[textIndex].substring(0, charIndex);

    return (
        <section id="home" className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-gray-500 mt-32">
                <TrendingUpIcon className="size-4.5" />
                <span>Trusted by 2,000+ founders</span>
            </div>

            <h1 className="text-center text-5xl/17 md:text-[64px]/20 font-semibold max-w-4xl m-2">
                HealthMate – Sehat ka Smart Dost
            </h1>

            <p className="text-center text-base text-gray-500 max-w-2xl mt-2 px-4">
                “Upload reports, let Gemini explain them in simple words (Bilingual). Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi.”
            </p>

            <form onSubmit={handleSubmit} className="focus-within:ring-2 focus-within:ring-gray-300 border border-gray-200 rounded-xl max-w-2xl w-full mt-8">
                <textarea
                    className="w-full resize-none p-4 outline-none text-gray-600"
                    placeholder={`Create a ${animatedPlaceholder}`}
                    rows={3}
                    minLength={10}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                />

                <div className="flex items-center justify-between p-4 pt-0">
                    <div className="flex items-center gap-3">
                        <label htmlFor="hero-file" className="border border-gray-200 text-gray-500 p-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition shadow-xs">
                            <input type="file" id="hero-file" hidden onChange={handleFileChange} accept="image/*" />
                            <UploadCloudIcon className="size-4.5" />
                        </label>
                        {file && (
                            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-[11px] font-medium border border-green-100">
                                <CheckCircleIcon className="size-3" />
                                <span className="truncate max-w-[120px]">{file.name}</span>
                            </div>
                        )}
                    </div>

                    <button className={`flex items-center bg-linear-to-b from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 transition px-4 h-9 text-white rounded-lg ${loading ? "cursor-not-allowed opacity-80" : ""}`}>
                        {loading ? (
                            <Loader2Icon className="size-5 animate-spin" />
                        ) : (
                            <>
                                <SparklesIcon className="size-4" />
                                <span className="ml-2">Create</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            <Marquee gradient speed={30} pauseOnHover className="max-w-2xl w-full mt-3" >
                {prompts.map((item) => {
                    const isSelected = selected === item.label;

                    return (
                        <button key={item.label}
                            onClick={() => {
                                setPrompt(item.prompt);
                                setSelected(item.label);
                            }}
                            className={`px-4 py-1.5 mx-2 border rounded-full transition
                                ${isSelected
                                    ? "bg-gray-200 text-gray-800 border-gray-300 cursor-not-allowed"
                                    : "text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100"
                                }
                            `}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </Marquee>
        </section>
    );
}