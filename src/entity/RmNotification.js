import mongoose from "mongoose";

// The schema for the RmNotification model
const RmNotificationSchema = new mongoose.Schema(
  {
    notificationID: { type: String },
    notificationType: { type: String },
    eventTime: { type: String },
    owner: { type: String },
    message: { type: String },
    sourceID: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create the RmNotification model
const RmNotification = mongoose.model("RmNotification", RmNotificationSchema);

export default RmNotification;
