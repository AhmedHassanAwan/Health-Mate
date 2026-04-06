import { CalendarIcon, FilePlusIcon, HeartIcon, SearchIcon, FilterIcon, ChevronRightIcon, FileTextIcon, ActivityIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useMemo } from "react";
import { AppContext } from "../context/AppContext";

export default function Timeline() {
    const navigate = useNavigate();
    const { reports, vitals } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all"); // all, reports, vitals

    // Combine and sort reports and vitals for the timeline
    const timelineData = useMemo(() => {
        const combined = [
            ...(reports || []).map(r => ({
                id: r._id,
                date: r.date,
                type: "Report",
                category: r.type,
                title: r.title,
                description: (typeof r.analysis?.primary_diagnosis === 'object' && r.analysis?.primary_diagnosis !== null)
                    ? (r.analysis.primary_diagnosis.en || r.analysis.primary_diagnosis.ur)
                    : (r.analysis?.primary_diagnosis || "Analysis available"),
                icon: FileTextIcon,
                color: "bg-blue-100 text-blue-600",
                raw: r
            })),
            ...(vitals || []).map(v => ({
                id: v._id,
                date: v.date,
                type: "Vital",
                category: "Health Metric",
                title: "Vitals Recorded",
                description: `BP: ${v.bloodPressure || "--"}, Heart: ${v.heartRate || "--"}`,
                icon: ActivityIcon,
                color: "bg-red-100 text-red-600",
                raw: v
            }))
        ];

        return combined
            .filter(item => {
                const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesFilter = activeFilter === "all" ||
                    (activeFilter === "reports" && item.type === "Report") ||
                    (activeFilter === "vitals" && item.type === "Vital");

                return matchesSearch && matchesFilter;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [reports, vitals, searchTerm, activeFilter]);

    return (
        <div className="flex flex-col items-center min-h-[calc(100vh-80px)] px-6 py-12 bg-gray-50 lg:px-12">
            <div className="max-w-4xl w-full">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl text-gray-900 font-medium">Health Timeline</h2>
                        <p className="text-sm text-gray-500/90 mt-2">Your complete medical history at a glance.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/upload-report" className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition shadow-sm">
                            <FilePlusIcon className="size-4" />
                            Upload Report
                        </Link>
                        <Link to="/add-vitals" className="flex items-center gap-2 bg-linear-to-b from-gray-600 to-gray-800 text-white px-5 py-2 rounded-full text-sm font-medium hover:from-gray-700 transition shadow-md">
                            <HeartIcon className="size-4" />
                            Add Vitals
                        </Link>
                    </div>
                </div>

                {/* Filters/Search */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-10 w-full overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex items-center bg-white border border-gray-200 h-12 rounded-full px-6 gap-3 flex-1 min-w-[280px] shadow-sm focus-within:ring-2 focus-within:ring-gray-200 transition order-2 md:order-1">
                        <SearchIcon size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search clinical reports or vitals..."
                            className="bg-transparent outline-none text-sm w-full font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-white border border-gray-100 p-1 rounded-full shadow-sm order-1 md:order-2">
                        {["all", "reports", "vitals"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${activeFilter === filter ? 'bg-linear-to-b from-gray-600 to-gray-800 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timeline Axis */}
                <div className="relative pl-8 md:pl-32">
                    <div className="absolute top-0 bottom-0 left-[41px] md:left-[113px] w-px bg-gray-200"></div>

                    <div className="flex flex-col gap-10">
                        {timelineData.length > 0 ? timelineData.map((item) => (
                            <div key={item.id} className="relative transition group">
                                {/* Date on the left for desktop */}
                                <div className="hidden md:block absolute -left-32 top-1 text-right w-24">
                                    <p className="text-base font-bold text-gray-900">{new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight">{new Date(item.date).getFullYear()}</p>
                                </div>

                                {/* Marker */}
                                <div className={`absolute left-0 top-1 size-8 rounded-full border-[3px] border-white ring-4 ring-gray-100 z-10 flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition duration-300`}>
                                    <item.icon className="size-4" />
                                </div>

                                {/* Content Card */}
                                <div
                                    onClick={() => {
                                        if (item.type === "Report") {
                                            navigate(`/view-report/${item.id}`, {
                                                state: {
                                                    analysis: item.raw.analysis,
                                                    imageUrl: item.raw.imageUrl,
                                                    title: item.raw.title,
                                                    date: item.raw.date,
                                                    type: item.raw.type
                                                }
                                            });
                                        }
                                    }}
                                    className={`ml-12 block bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition duration-300 relative overflow-hidden ${item.type === "Report" ? "cursor-pointer" : ""}`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${item.color}`}>{item.type}</span>
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.title}</h3>
                                        </div>
                                        {item.type === "Report" && <ChevronRightIcon className="size-5 text-gray-300 group-hover:text-gray-900 transition" />}
                                    </div>
                                    <div className="md:hidden mb-3">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{item.category}</p>
                                    <p className="text-sm text-gray-600 bg-gray-50/80 p-4 rounded-2xl border border-dashed border-gray-100 italic">{item.description}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 ml-12">
                                <SearchIcon className="size-10 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400 font-medium">No records found matching your timeline.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <button className="text-gray-300 text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition px-8 py-3 border border-gray-100 rounded-full">End of History</button>
                </div>
            </div>
        </div>
    );
}
