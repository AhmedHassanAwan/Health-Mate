import { StarIcon } from "lucide-react";
import Marquee from "react-fast-marquee";


export default function OurTestimonials() {
    const data = [
        {
            review:
                "HealthMate ne meri ammi ki reports samajhna bohot asan kar diya. Ab doctor se kya sawal karne hain, yeh AI bata deta hai.",
            name: "Zeeshan Khan",
            date: "12 Jan 2025",
            rating: 5,
            image:
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
        },
        {
            review:
                "The Roman Urdu summary is a life saver. My family can finally understand their health reports without waiting for me to translate.",
            name: "Ayesha Ahmed",
            date: "15 Mar 2025",
            rating: 5,
            image:
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
        },
        {
            review:
                "Finally, an app where I can store all my previous reports. Timeline view makes it so easy to see my BP history.",
            name: "Ibrahim Lodhi",
            date: "20 Feb 2025",
            rating: 5,
            image:
                "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
        },
        {
            review:
                "Gemini's analysis is incredibly accurate. It caught abnormal values that I had overlooked in my lab results.",
            name: "Dr. Sara Malik",
            date: "20 Sep 2025",
            rating: 5,
            image:
                "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
        },
    ];

    return (
        <section className="flex flex-col items-center justify-between max-w-6xl mx-auto mt-32 px-4">
            <h3 className="font-domine text-3xl">PATIENT STORIES</h3>
            <p className="mt-4 text-sm/6 text-gray-500 max-w-lg text-center">
                Real families, real health insights. See how HealthMate is making healthcare management easier for everyone.
            </p>

            <Marquee pauseOnHover className="mt-16" gradient speed={30}>
                {data.map((item, index) => (
                    <TestimonialCard key={index} item={item} />
                ))}
            </Marquee>
            <Marquee pauseOnHover className="mt-6" direction="right" gradient speed={30}>
                {data.map((item, index) => (
                    <TestimonialCard key={index} item={item} />
                ))}
            </Marquee>
        </section>
    );
}

function TestimonialCard({ item }) {
    return (
        <div className="w-full max-w-88 mx-2 space-y-4 rounded-md border border-gray-200 bg-white p-3 text-gray-500">
            <div className="flex items-center justify-between">
                <div className="flex gap-1">
                    {[...Array(item.rating)].map((_, index) => (
                        <StarIcon
                            key={index}
                            className="size-4 fill-gray-800 text-gray-800"
                        />
                    ))}
                </div>
                <p>{item.date}</p>
            </div>

            <p>“{item.review}”</p>

            <div className="flex items-center gap-2 pt-3">
                <img
                    className="size-8 rounded-full"
                    width={40}
                    height={40}
                    src={item.image}
                    alt={item.name}
                />
                <p className="font-medium text-gray-800">{item.name}</p>
            </div>
        </div>
    );
}
