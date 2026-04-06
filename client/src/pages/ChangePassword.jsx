import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { LockIcon } from "lucide-react";

const ChangePassword = () => {

    const { backendUrl } = useContext(AppContext)
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const { data } = await axios.post(backendUrl + '/api/auth/change-password', { oldPassword, newPassword })

            if (data.success) {
                toast.success(data.message)
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 mx-auto bg-white">
            <Link to="/" className="mb-8">
                <img src="/assets/logo.svg" alt="Logo" width={68} height={26} className="h-8 w-auto" />
            </Link>

            <form onSubmit={onSubmitHandler} className="md:w-96 w-full flex flex-col items-center justify-center p-8 border border-gray-100 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-md">
                <h2 className="text-3xl text-gray-900 font-medium text-center">Change Password</h2>
                <p className="text-sm text-gray-500/90 mt-3 text-center">Update your account password securely.</p>

                <div className="flex items-center mt-10 w-full bg-transparent border border-gray-200 focus-within:border-gray-300 h-12 rounded-full overflow-hidden pl-5 gap-2">
                    <LockIcon size={18} className="text-gray-400" />
                    <input
                        type="password"
                        placeholder="Old Password"
                        className="bg-transparent placeholder-gray-400 outline-none text-sm w-full h-full"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="flex items-center mt-6 w-full bg-transparent border border-gray-200 focus-within:border-gray-300 h-12 rounded-full overflow-hidden pl-5 gap-2">
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

                <p onClick={() => navigate('/')} className="text-gray-500/90 mt-6 text-sm underline cursor-pointer hover:text-gray-800 transition text-center">
                    Back to Dashboard
                </p>
            </form>
        </div>
    )
}

export default ChangePassword
