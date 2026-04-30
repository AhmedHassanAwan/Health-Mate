import { CheckIcon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
    const navigate = useNavigate();
    const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

    const [state, setState] = useState('Sign Up');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disable, setdisable] = useState(false)

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            axios.defaults.withCredentials = true;

            setdisable(true);

            if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password });

                if (data.success) {
                     toast.success("Account created successfully ");
                    setState("Login")
                    getUserData();
                    setdisable(false);
                } else {
                    console.log(error);
                    toast.error(data.message || "Signup failed");

                    // toast.error(data.message);
                    setdisable(false);
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password });

                if (data.success) {
                     toast.success("Login successful");
                    setIsLoggedIn(true);
                    getUserData();
                    setdisable(false);
                    navigate('/');
                } else {
                     toast.error(data.message || "Login failed");
                    setdisable(false);
                }
            }
        } catch (error) {
            // toast.error(error.message);
             toast.error(error.response?.data?.message || error.message || "Server error");
        }
    }

    return (
        <div className="flex items-center min-h-screen justify-center max-w-6xl px-6 mx-auto">
            <Link to='/' className="flex-1 hidden md:block" title="Go back to home">
                <img
                    className="max-h-90 w-auto"
                    src="/assets/opengraph-image.png"
                    alt="leftSideimg"
                />
            </Link>

            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Mobile Logo */}
                <Link to='/' className="md:hidden mb-8" title="Go back to home">
                    <img
                        className="max-h-42 w-auto"
                        src="/assets/opengraph-image.png"
                        alt="Mobile Logo"
                    />
                </Link>

                <form onSubmit={onSubmitHandler} className="md:w-96 w-full flex flex-col items-center justify-center">
                    <h2 className="text-4xl text-gray-900 font-medium">{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
                    <p className="text-sm text-gray-500/90 mt-3">{state === 'Sign Up' ? 'Join HealthMate today' : 'Welcome back to your Personal Health Vault'}</p>

                    {state === 'Sign Up' && (
                        <div className="flex items-center mt-10 w-full bg-transparent border border-gray-200 focus-within:border-gray-300 h-12 rounded-full overflow-hidden pl-5 gap-2">
                            <UserIcon size={18} className="text-gray-400" />
                            <input
                                onChange={e => setName(e.target.value)}
                                value={name}
                                type="text"
                                placeholder="Full Name"
                                className="bg-transparent placeholder-gray-400 outline-none text-sm w-full h-full"
                                required
                            />
                        </div>
                    )}

                    <div className={`flex items-center ${state === 'Sign Up' ? 'mt-6' : 'mt-10'} w-full bg-transparent border border-gray-200 focus-within:border-gray-300 h-12 rounded-full overflow-hidden pl-5 gap-2`}>
                        <MailIcon size={18} className="text-gray-400" />
                        <input
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder="Email id"
                            className="bg-transparent placeholder-gray-400 outline-none text-sm w-full h-full"
                            required
                        />
                    </div>

                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-200 focus-within:border-gray-300 h-12 rounded-full overflow-hidden pl-5 gap-2">
                        <LockIcon size={18} className="text-gray-400" />
                        <input
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder="Password"
                            className="bg-transparent placeholder-gray-400 outline-none text-sm w-full h-full"
                            required
                        />
                    </div>

                    <div className="w-full flex items-center justify-between mt-8">
                        <label className="flex gap-2 items-center cursor-pointer">
                            <input type="checkbox" className="hidden peer" defaultChecked />
                            <span className="size-4.5 border border-slate-300 rounded relative flex items-center justify-center peer-checked:border-gray-800 peer-checked:bg-gray-800">
                                <CheckIcon className="text-white size-3" />
                            </span>
                            <span className="text-gray-500 select-none text-sm">Remember me</span>
                        </label>
                        <p onClick={() => navigate('/reset-password')} className="text-gray-800 underline text-sm cursor-pointer">Forgot password?</p>
                    </div>

                    <button
                        disabled={disable}
                        type="submit"
                        className={`mt-8 w-full h-11 rounded-full text-white transition
    ${disable
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 active:scale-95"
                            }`}
                    >
                        {state}
                    </button>

                    {state === 'Sign Up' ? (
                        <p className="text-gray-500/90 mt-4 text-sm underline">
                            Already have an account? <span onClick={() => setState('Login')} className="text-gray-800 cursor-pointer font-medium">Login here</span>
                        </p>
                    ) : (
                        <p className="text-gray-500/90 mt-4 text-sm">
                            Don’t have an account? <span onClick={() => setState('Sign Up')} className="text-gray-800 underline cursor-pointer font-medium">Sign up</span>
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}