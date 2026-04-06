import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout";
import Home from "./pages/home";
import Login from "./pages/login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import UploadReport from "./pages/UploadReport";
import AddVitals from "./pages/AddVitals";
import Timeline from "./pages/Timeline";
import ViewReport from "./pages/ViewReport";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <>
            <Toaster />
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
                    <Route path="/upload-report" element={<ProtectedRoute><UploadReport /></ProtectedRoute>} />
                    <Route path="/add-vitals" element={<ProtectedRoute><AddVitals /></ProtectedRoute>} />
                    <Route path="/view-report/:id?" element={<ProtectedRoute><ViewReport /></ProtectedRoute>} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/email-verify" element={<EmailVerify />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/change-password" element={<ChangePassword />} />
            </Routes>
        </>
    );
}
