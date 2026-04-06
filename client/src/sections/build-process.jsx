import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "lucide-react";


const leftSteps = [
    {
        title: "Understand the Problem",
        description:
            "Reports manage karna aur unka samajhna mushkil hota hai. HealthMate simplifies this process for you and your family.",
        link: "/timeline",
        cta: "View Timeline"
    },
    {
        title: "AI Summary Generation",
        description:
            "Gemini generates a simple summary, bilingual explanation, and suggests questions to ask your doctor.",
        link: "/view-report/1",
        cta: "See Example"
    },
];

const rightSteps = [
    {
        title: "Upload Your Reports",
        description:
            "Upload any PDF or image of your lab reports. Our AI reads them directly—no manual data entry required.",
        link: "/upload-report",
        cta: "Upload Now"
    },
    {
        title: "Track Manual Vitals",
        description:
            "Add sugar, BP, or weight readings manually to keep your health timeline complete even without a lab visit.",
        link: "/add-vitals",
        cta: "Add Vitals"
    },
];

export default function BuildProcess() {
    const segmentRefs = useRef([]);
    const [progress, setProgress] = useState([0, 0, 0]);


    useEffect(() => {
        const handleScroll = () => {
            const updated = segmentRefs.current.map((el) => {
                if (!el) return 0;

                const rect = el.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                const start = windowHeight * 0.6;
                const end = windowHeight * 0.2;

                let percent = (start - rect.top) / (start - end);

                percent = Math.min(Math.max(percent, 0), 1);

                return percent;
            });

            setProgress(updated);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section id="process" className="flex flex-col items-center mt-32">
            <p className="font-domine">Simple 4-Step Process</p>

            <h3 className="text-3xl max-w-lg text-gray-500 text-center mt-5 px-4">
                Your 4-Step Journey to Smarter Health Management
            </h3>

            <div className="flex flex-col md:flex-row mt-20 md:mt-32 px-6">
                <div className="flex flex-col gap-10">
                    {leftSteps.map((step, index) => (
                        <div key={index} className="max-w-lg md:h-60 md:mt-60 flex flex-col items-start">
                            <h3 className="text-xl underline font-domine">{step.title}</h3>
                            <p className="mt-6 text-gray-500 text-sm/6">{step.description}</p>
                            <Link to={step.link} className="mt-4 text-xs font-semibold text-gray-800 flex items-center gap-1 hover:gap-2 transition-all">
                                {step.cta} <ChevronRightIcon className="size-3" />
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="hidden md:flex flex-col items-center">
                    <div className="size-4 bg-gray-800" />

                    {[0, 1, 2].map((i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div ref={(el) => { if (el) segmentRefs.current[i] = el; }} data-index={i} className="relative w-0.5 mx-10 h-60 bg-gray-300 overflow-hidden" >
                                <div style={{ height: `${progress[i] * 100}%` }} className="absolute top-0 left-0 w-full bg-gray-800" />
                            </div>
                            <div className={`size-4 ${progress[i] > 0.95 ? "bg-gray-800" : "bg-gray-300"}`} />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-10">
                    {rightSteps.map((step, index) => (
                        <div key={index} className={`max-w-lg md:h-60 flex flex-col items-start ${index === 0 ? "" : "md:mt-60"}`} >
                            <h3 className="text-xl underline font-domine">{step.title}</h3>
                            <p className="mt-6 text-gray-500 text-sm/6">{step.description}</p>
                            <Link to={step.link} className="mt-4 text-xs font-semibold text-gray-800 flex items-center gap-1 hover:gap-2 transition-all">
                                {step.cta} <ChevronRightIcon className="size-3" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}