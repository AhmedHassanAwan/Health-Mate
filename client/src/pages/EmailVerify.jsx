import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

const EmailVerify = () => {

    axios.defaults.withCredentials = true;
    const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext)

    const navigate = useNavigate()

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

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const otpArray = inputRefs.current.map(e => e.value)
            const otp = otpArray.join('')

            const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp })

            if (data.success) {
                toast.success(data.message)
                getUserData()
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        isLoggedIn && userData && userData.isAccountVerified && navigate('/')
    }, [isLoggedIn, userData])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 mx-auto bg-white">
            <Link to="/" className="mb-8">
                <img src="/assets/logo.svg" alt="Logo" width={68} height={26} className="h-8 w-auto" />
            </Link>

            <form onSubmit={onSubmitHandler} className="md:w-96 w-full flex flex-col items-center justify-center p-8 border border-gray-100 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-md">
                <h2 className="text-3xl text-gray-900 font-medium text-center">Verify Email</h2>
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
                    Verify Account
                </button>

                <p onClick={() => navigate('/')} className="text-gray-500/90 mt-6 text-sm underline cursor-pointer hover:text-gray-800 transition">
                    Back to Home
                </p>
            </form>
        </div>
    )
}

export default EmailVerify
