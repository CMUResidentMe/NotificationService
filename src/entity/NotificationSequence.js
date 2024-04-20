import mongoose from "mongoose";
import { notificationDB } from "../data_access_layer/mongooseConnect.js";

const NotificationSequenceSchema = new mongoose.Schema(
  {
    name: { type: String },
    seq: { type: Number },
  },
);

const NotificationSequence = mongoose.model("NotificationSequence", NotificationSequenceSchema);

const generateSequence = async (seqName) => {
  return NotificationSequence.findOneAndUpdate(
    { name: { $eq: seqName } },
    { $inc: { seq: 1 } }, 
    {
    upsert: true,
    new: true,
    }
  );
}

export { generateSequence };
