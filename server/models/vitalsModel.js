import mongoose from "mongoose";

const vitalsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    bloodPressure: { type: String },
    sugarLevel: { type: String },
    weight: { type: String },
    heartRate: { type: String },
    notes: { type: String },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

const vitalsModel = mongoose.models.vitals || mongoose.model("vitals", vitalsSchema);

export default vitalsModel;
