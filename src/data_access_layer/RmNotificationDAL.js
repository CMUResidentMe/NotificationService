import RmNotification from "../entity/RmNotification.js";

/*  notificationType: { type: String },
    eventTime: { type: String },
    owner: { type: String },
    message: { type: String },*/
const createRmNotification = async (notificationID, notificationType, eventTime, owner, message, sourceID) => {
  const noti = new RmNotification({
    notificationID,
    notificationType,
    eventTime,
    owner,
    message,
    sourceID,
  });
  return noti.save();
};

const getDelRmNotificationsByOwner = async (ownerUuid) => {
  //{ <field>: { $eq: <value> } }
  let notis = await RmNotification.find({owner: ownerUuid });
  await RmNotification.deleteMany({owner: ownerUuid});
  return notis;
};

export {
  createRmNotification,
  getDelRmNotificationsByOwner,
};
