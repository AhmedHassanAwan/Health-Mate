import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { MailIcon, LockIcon } from "lucide-react";

const ResetPassword = () => {

    const { backendUrl } = useContext(AppContext)
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isEmailSent, setIsEmailSent] = useState(false)
    const [otp, setOtp] = useState(0)
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

    const inputRefs = React.useRef([])

    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split('');
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char;
            }
        })
    }

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && setIsEmailSent(true)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const onSubmitOtp = async (e) => {
        e.preventDefault();
        const otpArray = inputRefs.current.map(e => e.value)
        setOtp(otpArray.join(''))
        setIsOtpSubmitted(true)
    }

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword })
            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && navigate('/login')
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 mx-auto bg-white">
            <Link to="/" className="mb-8">
                <img src="/assets/logo.svg" alt="Logo" width={68} height={26} className="h-8 w-auto" />
            </Link>

            {!isEmailSent &&
                <form onSubmit={onSubmitEmail} className="md:w-96 w-full flex flex-col items-center justify-center p-8 border border-gray-100 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-md">
                    <h2 className="text-3xl text-gray-900 font-medium text-center">Reset Password</h2>
                    <p className="text-sm text-gray-500/90 mt-3 text-center">Enter your registered email address.</p>

                    <div className="flex items-center mt-10 w-full bg-transparent border border-gray-200 focus-within:border-gray-300 h-12 rounded-full overflow-hidden pl-5 gap-2">
                        <MailIcon size={18} className="text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email id"
                            className="bg-transparent placeholder-gray-400 outline-none text-sm w-full h-full"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="mt-8 w-full h-11 rounded-full text-white bg-linear-to-b from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 transition font-medium">
                        Send OTP
                    </button>

                    <p onClick={() => navigate('/login')} className="text-gray-500/90 mt-6 text-sm underline cursor-pointer hover:text-gray-800 transition">
                        Back to Login
                    </p>
                </form>
            }

            {!isOtpSubmitted && isEmailSent &&
                <form onSubmit={onSubmitOtp} className="md:w-96 w-full flex flex-col items-center justify-center p-8 border border-gray-100 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-md">
                    <h2 className="text-3xl text-gray-900 font-medium text-center">Enter OTP</h2>
                    <p className="text-sm text-gray-500/90 mt-3 text-center">Enter the 6-digit code sent to your email.</p>

                    <div className="flex justify-between w-full mt-10 mb-8" onPaste={handlePaste}>
                        {Array(6).fill(0).map((_, index) => (
                            <input
                                type="text"
                                maxLength="1"
                                key={index}
                                required
                                className="w-12 h-12 bg-white border border-gray-200 text-gray-800 text-center text-xl rounded-xl focus:border-gray-400 outline-none transition shadow-sm"
                                ref={e => inputRefs.current[index] = e}
                                onInput={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>

                    <button type="submit" className="w-full h-11 rounded-full text-white bg-linear-to-b from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 transition font-medium">
                        Submit OTP
                    </button>
                </form>
            }

            {isOtpSubmitted && isEmailSent &&
                <form onSubmit={onSubmitNewPassword} className="md:w-96 w-full flex flex-col items-center justify-center p-8 border border-gray-100 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-md">
                    <h2 className="text-3xl text-gray-900 font-medium text-center">New Password</h2>
                    <p className="text-sm text-gray-500/90 mt-3 text-center">Enter your new password below.</p>

                    <div className="flex items-center mt-10 w-full bg-transparent border border-gray-200 focus-within:border-gray-300 h-12 rounded-full overflow-hidden pl-5 gap-2">
                        <LockIcon size={18} className="text-gray-400" />
                        <input
                            type="password"
                            placeholder="New Password"
                            className="bg-transparent placeholder-gray-400 outline-none text-sm w-full h-full"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="mt-8 w-full h-11 rounded-full text-white bg-linear-to-b from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 transition font-medium">
                        Update Password
                    </button>
                </form>
            }
        </div>
    )
}

export default ResetPassword
