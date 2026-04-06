import vitalsModel from "../models/vitalsModel.js";

const addVitals = async (req, res) => {
    try {
        const userId = req.userId;
        const { bloodPressure, sugarLevel, weight, heartRate, notes } = req.body;

        const newVitals = new vitalsModel({
            userId,
            bloodPressure,
            sugarLevel,
            weight,
            heartRate,
            notes
        });

        await newVitals.save();
        res.json({ success: true, message: "Vitals saved successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getVitals = async (req, res) => {
    try {
        const userId = req.userId;
        const vitals = await vitalsModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, vitals });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { addVitals, getVitals };
