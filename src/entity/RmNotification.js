import mongoose from "mongoose";

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

const RmNotification = mongoose.model("RmNotification", RmNotificationSchema);

export default RmNotification;
