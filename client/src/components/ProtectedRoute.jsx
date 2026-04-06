import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            toast.error("Please login to access this page", {
                id: "auth-denied", // Prevent duplicate toasts
            });
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    return isLoggedIn ? children : null;
};

export default ProtectedRoute;
