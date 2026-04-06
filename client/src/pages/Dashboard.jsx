import { LayoutDashboardIcon, FileTextIcon, ActivityIcon, PlusIcon, ChevronRightIcon, TrendingUpIcon, DropletsIcon, ScaleIcon, HeartPulseIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Dashboard() {
    const navigate = useNavigate();
    const { userData, reports, vitals } = useContext(AppContext);

    // Get the latest vitals entry
    const latestVitals = vitals && vitals.length > 0 ? vitals[0] : {};

    // Map real data to UI structure
    const recentVitals = [
        { id: "bp", label: "Blood Pressure", value: latestVitals.bloodPressure || "--", unit: "mmHg", trend: "Latest", icon: ActivityIcon, color: "text-blue-600", bg: "bg-blue-50" },
        { id: "sugar", label: "Sugar Level", value: latestVitals.sugarLevel || "--", unit: "mg/dL", trend: "Latest", icon: DropletsIcon, color: "text-red-600", bg: "bg-red-50" },
        { id: "weight", label: "Weight", value: latestVitals.weight || "--", unit: "kg", trend: "Latest", icon: ScaleIcon, color: "text-orange-600", bg: "bg-orange-50" },
        { id: "hr", label: "Heart Rate", value: latestVitals.heartRate || "--", unit: "bpm", trend: "Latest", icon: HeartPulseIcon, color: "text-green-600", bg: "bg-green-50" },
    ];

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50/50 px-6 py-10 lg:px-16 lg:py-12">
            <div className="max-w-7xl mx-auto w-full">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, {userData?.name || "User"}!</h2>
                        <p className="text-sm text-gray-500 mt-1">Here's your health summary for today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/upload-report" className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition shadow-sm text-gray-700">
                            <PlusIcon className="size-4" /> Upload Report
                        </Link>
                        <Link to="/add-vitals" className="flex items-center gap-2 bg-linear-to-b from-gray-600 to-gray-800 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:from-gray-700 transition shadow-md">
                            <ActivityIcon className="size-4" /> Add Vitals
                        </Link>
                    </div>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {recentVitals.map((vital) => (
                        <div key={vital.id} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${vital.bg} ${vital.color}`}>
                                    <vital.icon className="size-6" />
                                </div>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">
                                    <TrendingUpIcon className="size-3" /> {vital.trend}
                                </span>
                            </div>
                            <h3 className="text-sm font-medium text-gray-500">{vital.label}</h3>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-2xl font-bold text-gray-900">{vital.value}</span>
                                <span className="text-xs font-medium text-gray-400">{vital.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left: Recent Reports */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <FileTextIcon className="size-5 text-gray-400" /> Recent Reports
                                </h3>
                                <Link to="/timeline" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 transition">
                                    View All <ChevronRightIcon className="size-4" />
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            <th className="px-8 py-4">Report Name</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                            <th className="px-8 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {reports && reports.length > 0 ? (
                                            reports.slice(0, 5).map((report) => (
                                                <tr key={report._id} className="hover:bg-gray-50/30 transition cursor-pointer group">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition group-hover:shadow-sm">
                                                                <FileTextIcon className="size-4 text-gray-600" />
                                                            </div>
                                                            <span className="text-sm font-semibold text-gray-800">{report.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                                                        {new Date(report.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase">{report.type}</span>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter bg-green-100 text-green-700">
                                                            Analyzed
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <button
                                                            onClick={() => navigate(`/view-report/${report._id}`, {
                                                                state: {
                                                                    analysis: report.analysis,
                                                                    imageUrl: report.imageUrl,
                                                                    title: report.title,
                                                                    date: report.date,
                                                                    type: report.type
                                                                }
                                                            })}
                                                            className="text-gray-400 group-hover:text-gray-800 transition"
                                                        >
                                                            <ChevronRightIcon className="size-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-8 py-10 text-center text-gray-400 text-sm italic">
                                                    No reports uploaded yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Insights / Ad Placeholder */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-3xl p-8 text-white relative overflow-hidden group shadow-xl">
                            <div className="absolute -top-10 -right-10 size-40 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition duration-700"></div>
                            <div className="flex items-center gap-2 mb-6">
                                <LayoutDashboardIcon className="size-5 text-yellow-400 fill-yellow-400" />
                                <h3 className="text-xl font-bold tracking-tight">Health Insights</h3>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed mb-8 italic">"Your vitals are looking stable this week. Consistency in weight indicates a healthy metabolism."</p>
                            <Link to="/timeline" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white transition group/btn">
                                Details <ChevronRightIcon className="size-4 group-hover/btn:translate-x-1 transition" />
                            </Link>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Tip</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Drinking at least 8 glasses of water daily helps maintain optimal kidney health and skin hydration.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

