import { CalendarIcon, FileTextIcon, Loader2, UploadIcon, XIcon } from "lucide-react";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export default function UploadReport() {
    const { uploadReport, analyzeReport } = useContext(AppContext);
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [type, setType] = useState("Blood Test");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const reportTypes = ["Blood Test", "MRI / X-Ray", "Prescription", "Vitals Log", "Others"];

    const handleFileChange = (e) => {
        const selectedFile = e.target ? e.target.files[0] : e;
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return toast.error("Please select a file first");
        
        setLoading(true);
        try {
            // 1. Upload Image to Cloudinary
            console.log("hellow file" + file);
            const uploadRes = await uploadReport(file);
            console.log("UPLOAD RESPONSE:", uploadRes);
            if (!uploadRes.success) throw new Error(uploadRes.message);

            // 2. Analyze using Gemini
            const analysisRes = await analyzeReport(uploadRes.imageUrl, file.name, type, date);
            if (!analysisRes.success) throw new Error(analysisRes.message);

            console.log("🔥 ANALYZE API HIT");
            console.log("UPLOAD RESPONSE:", uploadRes);
            console.log("ANALYSIS RESPONSE:", analysisRes);

            toast.success("Analysis Complete!");
            // 3. Navigate to View Report with data (passing analysis in state for now as we don't have DB persistence for reports yet)
            navigate("/view-report", {
                state: {
                    analysis: analysisRes.analysis,
                    imageUrl: uploadRes.imageUrl,
                    title: file.name,
                    date: date,
                    type: type
                }
            });
        } catch (error) {
            toast.error(error.message || "Something went wrong");
            // toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12 bg-white">
            <div className="max-w-xl w-full">
                <div className="text-center mb-10">
                    <h2 className="text-4xl text-gray-900 font-medium">Upload Report</h2>
                    <p className="text-sm text-gray-500/90 mt-3">Add your medical reports to your secure health vault.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 border border-gray-100 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-md">
                    {/* File Dropzone */}
                    <div className="relative group">
                        {!file ? (
                            <label
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition ${isDragging ? "border-gray-800 bg-gray-50 scale-[1.02]" : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"}`}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className={`p-3 rounded-full mb-3 transition ${isDragging ? "bg-gray-800 text-white scale-110" : "bg-gray-100 text-gray-600 group-hover:scale-110"}`}>
                                        <UploadIcon className="size-6" />
                                    </div>
                                    <p className="mb-2 text-sm text-gray-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-400">PDF, JPG or PNG (MAX. 5MB)</p>
                                </div>
                                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                            </label>
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-gray-100">
                                        <FileTextIcon className="size-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button type="button" onClick={() => setFile(null)} className="p-1 hover:bg-gray-200 rounded-full transition">
                                    <XIcon className="size-4 text-gray-500" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Report Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-gray-500 ml-2">Report Type</label>
                            <div className="flex items-center bg-gray-50 border border-gray-200 focus-within:border-gray-300 h-11 rounded-full px-4 gap-2">
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm w-full h-full text-gray-700 cursor-pointer appearance-none"
                                >
                                    {reportTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-gray-500 ml-2">Report Date</label>
                            <div className="flex items-center bg-gray-50 border border-gray-200 focus-within:border-gray-300 h-11 rounded-full px-4 gap-2">
                                <CalendarIcon size={16} className="text-gray-400" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="bg-transparent outline-none text-sm w-full h-full text-gray-700 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full h-11 rounded-full text-white bg-linear-to-b from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 transition font-medium shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <><Loader2 className="size-4 animate-spin" /> Analyzing...</>
                        ) : (
                            "Start Analysis"
                        )}
                    </button>

                    <Link to="/" className="text-center text-gray-500 text-sm hover:text-gray-800 transition underline">
                        Back to Home
                    </Link>
                </form>
            </div>
        </div>
    );
}
