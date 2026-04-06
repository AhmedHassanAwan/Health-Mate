import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    imageUrl: { type: String, required: true },
    analysis: { type: Object, required: true },
}, { timestamps: true });

const reportModel = mongoose.models.report || mongoose.model("report", reportSchema);

export default reportModel;
