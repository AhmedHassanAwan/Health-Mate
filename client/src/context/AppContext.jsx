import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    
    const backendUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000").replace(/\/$/, "");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);
    const [reports, setReports] = useState([]);
    const [vitals, setVitals] = useState([]);

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
            if (data.success) {
                setIsLoggedIn(true);
                getUserData();
            }
        } catch (error) {
            
            console.log(error);
            
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');
            data.success ? setUserData(data.userData) : console.log("err" , error);
            
            
        } catch (error) {
            console.log(error);
            
            // toast.error(error.message);
        }
    }

    const getReports = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/analysis/all');
            if (data.success) {
                setReports(data.reports);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const getVitals = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/vitals/get');
            if (data.success) {
                setVitals(data.vitals);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const addVitals = async (vitalsData) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/vitals/add', vitalsData);
            if (data.success) {
                toast.success(data.message);
                getVitals(); // Refresh vitals
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    }

    const uploadReport = async (file) => {
    try {
        const formData = new FormData();

        formData.append('image', file);
        console.log("FormData:", formData.get('image')); // Debugging line to check FormData content

        const { data } = await axios.post(
            backendUrl + '/api/analysis/upload',
            formData
        );

        return data;
    } catch (error) {
        toast.error(error.message);
        return { success: false, message: error.message };
    }
};

    const analyzeReport = async (imageUrl, title, type, date) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/analysis/analyze', { imageUrl, title, type, date });
            if (data.success) {
                getReports(); // Refresh reports list
            }
            return data;
        } catch (error) {
            toast.error(error.message);
            return { success: false, message: error.message };
        }
    }

    useEffect(() => {
        getAuthState();
        if (isLoggedIn) {
            getReports();
            getVitals();
        }
    }, [isLoggedIn]);

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData,
        reports, setReports,
        getReports,
        vitals, setVitals,
        getVitals,
        addVitals,
        uploadReport,
        analyzeReport
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}
