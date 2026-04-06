import { MenuIcon, XIcon, ChevronDownIcon, UserIcon, ShieldCheckIcon, LogOutIcon } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const lastScrollY = useRef(0);
    const navigate = useNavigate();
    const { userData, backendUrl, setUserData, setIsLoggedIn, setReports, setVitals } = useContext(AppContext);
    const [showDropdown, setShowDropdown] = useState(false);

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + '/api/auth/logout');
            if (data.success) {
                setIsLoggedIn(false);
                setUserData(false);
                // CRUCIAL: Clear sensitive data from memory on logout
                setReports([]);
                setVitals([]);
                navigate('/');
                toast.success('Logged Out Successfully');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
            if (data.success) {
                navigate('/email-verify');
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Timeline", href: "/timeline" },
        { name: "Upload", href: "/upload-report" },
        { name: "Add Vitals", href: "/add-vitals" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;

            if (currentScroll > lastScrollY.current && currentScroll > 80) {
                setShowNavbar(false);
            } else {
                setShowNavbar(true);
            }

            lastScrollY.current = currentScroll;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-40 bg-white/60 backdrop-blur-md transition-transform duration-400 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="flex items-center justify-between px-4 py-4 md:px-16 lg:px-24 xl:px-32 border-b border-gray-200">
                    <div className="md:flex-1">
                        <Link to="/">
                            <img src="/assets/logo.svg" alt="Logo" width={68} height={26} className="h-7 w-auto" />
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-gray-600">
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.href} className="hover:text-gray-800">
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center justify-end md:flex-1 gap-2">
                        <div className="hidden md:flex items-center gap-2">
                            {userData ? (
                                <div className="relative group">
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="size-10 flex justify-center items-center rounded-full bg-linear-to-b from-gray-600 to-gray-800 text-white font-bold uppercase transition hover:scale-105 active:scale-95"
                                    >
                                        {userData.name[0]}
                                    </button>

                                    {showDropdown && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                                <p className="text-xs text-gray-500 font-medium truncate">Logged in as</p>
                                                <p className="text-sm font-semibold text-gray-800 truncate">{userData.name}</p>
                                            </div>
                                            <ul className="py-1">
                                                {!userData.isAccountVerified && (
                                                    <li
                                                        onClick={() => { sendVerificationOtp(); setShowDropdown(false); }}
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition"
                                                    >
                                                        <ShieldCheckIcon className="size-4 text-gray-500" />
                                                        Verify Account
                                                    </li>
                                                )}
                                                <li
                                                    onClick={() => { navigate('/change-password'); setShowDropdown(false); }}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition"
                                                >
                                                    <UserIcon className="size-4 text-gray-500" />
                                                    Change Password
                                                </li>
                                                <li
                                                    onClick={() => { logout(); setShowDropdown(false); }}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition"
                                                >
                                                    <LogOutIcon className="size-4" />
                                                    Logout
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="px-6 py-2.5 hover:bg-gray-100 rounded-lg whitespace-nowrap">
                                        Login
                                    </Link>
                                    <Link to="/" className="bg-linear-to-b from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 transition px-5 py-2 text-white rounded-lg whitespace-nowrap">
                                        Try Demo
                                    </Link>
                                </>
                            )}
                        </div>

                        <button onClick={() => setIsOpen(true)} className="transition active:scale-90 md:hidden">
                            <MenuIcon className="size-6.5" />
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`flex flex-col items-center justify-center gap-6 text-lg font-medium fixed inset-0 bg-white/40 backdrop-blur-md z-50 transition-all duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                {navLinks.map((link) => (
                    <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)}>
                        {link.name}
                    </Link>
                ))}

                {userData ? (
                    <div className="flex flex-col items-center gap-4">
                        <p className="font-semibold text-gray-800">Hi, {userData.name}</p>
                        <button onClick={() => { logout(); setIsOpen(false); }} className="text-red-600 font-medium">
                            Logout
                        </button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" onClick={() => setIsOpen(false)} className="px-6 py-2.5">
                            Login
                        </Link>

                        <Link
                            to="/"
                            onClick={() => setIsOpen(false)}
                            className="bg-linear-to-b from-gray-600 to-gray-800 px-5 py-2 text-white rounded-lg"
                        >
                            Try Demo
                        </Link>
                    </>
                )}

                <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-md bg-linear-to-b from-gray-600 to-gray-800 p-2 text-white ring-white active:ring-2"
                >
                    <XIcon />
                </button>
            </div>
            <div className="h-18" />
        </>
    );
}
