import { ChartSplineIcon, LayoutPanelTopIcon, NotebookPenIcon } from "lucide-react";


export default function FeaturesSection() {

    const features = [
        {
            icon: LayoutPanelTopIcon,
            title: "Medical Health Vault",
            description: "Securely store and organize all your test reports and prescriptions in one place.",
        },
        {
            icon: NotebookPenIcon,
            title: "AI Report Analysis",
            description: "Gemini AI reads your reports directly and explains complex terms in simple words.",
        },
        {
            icon: ChartSplineIcon,
            title: "Bilingual Summaries",
            description: "Get explanations in both English and Roman Urdu for better understanding.",
        },
    ];
    return (
        <div id="features" className="grid border mt-42 rounded-lg max-w-6xl mx-auto border-gray-200/70 grid-cols-1 divide-y divide-gray-200/70 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {features.map((item, index) => (
                <div key={index} className="flex flex-col items-start gap-4 hover:bg-gray-50 transition duration-300 p-8 pb-14">
                    <div className="flex items-center gap-2 text-gray-500">
                        <item.icon className="size-5" />
                        <h2 className="font-medium text-base">{item.title}</h2>
                    </div>
                    <p className="text-gray-500 text-sm/6 max-w-72">{item.description}</p>
                </div>
            ))}
        </div>
    );
}