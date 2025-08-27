import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  docId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: Object,
  docData: Object,
  amount: Number,
  date: { type: Date, default: Date.now },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }
});


appointmentSchema.index({ docId: 1, slotDate: 1, slotTime: 1 }, { unique: true });

const appointmentModel = mongoose.model("Appointment", appointmentSchema);

export default appointmentModel;   
