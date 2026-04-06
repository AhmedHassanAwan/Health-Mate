import { ActivityIcon, DropletsIcon, ScaleIcon, ThermometerIcon, FileTextIcon, SaveIcon, Loader2 } from "lucide-react";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function AddVitals() {
    const navigate = useNavigate();
    const { addVitals } = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    const [vitals, setVitals] = useState({
        bloodPressure: "",
        sugarLevel: "",
        weight: "",
        heartRate: "",
        notes: ""
    });

    const vitalInputs = [
        { id: "bloodPressure", label: "Blood Pressure", icon: ActivityIcon, placeholder: "120/80", unit: "mmHg" },
        { id: "sugarLevel", label: "Sugar Level", icon: DropletsIcon, placeholder: "95", unit: "mg/dL" },
        { id: "weight", label: "Weight", icon: ScaleIcon, placeholder: "70", unit: "kg" },
        { id: "heartRate", label: "Heart Rate", icon: ThermometerIcon, placeholder: "72", unit: "bpm" },
    ];

    const handleChange = (id, value) => {
        setVitals(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await addVitals(vitals);
        setLoading(false);
        if (success) {
            navigate("/dashboard");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12 bg-white">
            <div className="max-w-3xl w-full">
                <div className="text-center mb-10">
                    <h2 className="text-4xl text-gray-900 font-medium">Add Manual Vitals</h2>
                    <p className="text-sm text-gray-500/90 mt-3">Track your health daily even without a lab visit.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 border border-gray-100 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {vitalInputs.map((input) => (
                            <div key={input.id} className="flex flex-col gap-2 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl hover:border-gray-200 transition">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                                        <input.icon className="size-4 text-gray-600" />
                                    </div>
                                    <label className="text-sm font-semibold text-gray-700">{input.label}</label>
                                </div>
                                <div className="flex items-center bg-white border border-gray-200 focus-within:border-gray-300 h-11 rounded-xl px-4 gap-2 shadow-sm">
                                    <input
                                        type="text"
                                        placeholder={input.placeholder}
                                        value={vitals[input.id]}
                                        onChange={(e) => handleChange(input.id, e.target.value)}
                                        className="bg-transparent outline-none text-sm w-full h-full text-gray-700"
                                    />
                                    <span className="text-xs font-medium text-gray-400">{input.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-2 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                                <FileTextIcon className="size-4 text-gray-600" />
                            </div>
                            <label className="text-sm font-semibold text-gray-700">Additional Notes</label>
                        </div>
                        <textarea
                            rows={3}
                            placeholder="How are you feeling today?"
                            value={vitals.notes}
                            onChange={(e) => handleChange("notes", e.target.value)}
                            className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none text-sm text-gray-700 shadow-sm focus:border-gray-300 resize-none transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-8 w-full h-12 rounded-full text-white bg-linear-to-b from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 transition font-medium shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <SaveIcon className="size-5" />}
                        {loading ? "Saving..." : "Save Vitals"}
                    </button>

                    <Link to="/" className="block text-center mt-6 text-gray-500 text-sm hover:text-gray-800 transition underline">
                        Back to Home
                    </Link>
                </form>
            </div>
        </div>
    );
}
