import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
  createRmNotification,
  getDelRmNotificationsByOwner,
} from "../data_access_layer/RmNotificationDAL.js";
import { generateSequence } from "../entity/NotificationSequence.js";
dotenv.config();

class SocketManager {
  constructor(io) {
    this.userMap = {};
  }

  // Middleware to handle socket connection
  async handleSocketMiddleware(socket, next) {
    const token = socket.handshake.auth.token;
    if (token == null || token == "undefined") {
      return;
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userUUID = decoded.id;
      if (userUUID != null && userUUID != "undefined") {
        socket.userUUID = userUUID;
      } else {
        return;
      }
      next();
    } catch (error) {
      //console.error(error);
      return;
    }
  }

  // Handle socket connection
  async socketHandler(socket, io) {
    let userUUID = socket.userUUID;
    if (userUUID == null || userUUID == "undefined") {
      return;
    }
    console.log(userUUID + " connected");
    this.io = io;
    this.addUser(userUUID, socket);
    socket.on("disconnect", () => this.handleDisconnect(socket, io));
  }

  // Add user to socket map
  async addUser(userUUID, socket) {
    // Add user to socket map
    if (!(userUUID in this.userMap)) {
      this.userMap[userUUID] = new Set();
    }
    this.userMap[userUUID].add(socket.id);
    //send stored notis and delete them
    let notis = await getDelRmNotificationsByOwner(userUUID);
    notis.forEach((element) => {
      socket.emit(element.notificationType, element);
    });
  }

  // Handle socket disconnect
  async handleDisconnect(socket) {
    console.log(`${socket.id} disconnected from socketHandler`);
    try {
      this.removeUser(socket);
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  }

  // Remove user from socket map
  async removeUser(socket) {
    // Remove user from socket map
    if (
      socket.userUUID in this.userMap &&
      this.userMap[socket.userUUID].has(socket.id)
    ) {
      this.userMap[socket.userUUID].delete(socket.id);
    }
    if (this.userMap[socket.userUUID].size == 0) {
      delete this.userMap[socket.userUUID];
    }
  }

  // Emit user message based on userUUID
  async emitUserMessage(userUUID, msg) {
    let notiSeq = await generateSequence("RmNotificationSeq");
    msg.notificationID = notiSeq.seq;
    let sidList = this.userMap[userUUID];
    if (sidList && sidList.size > 0) {
      sidList.forEach((sid) => {
        console.log(`emit ${msg["notificationType"]} to ${userUUID}`);
        this.io.to(sid).emit(msg["notificationType"], msg);
      });
    } else {
      //store to DB for later emit
      //(notificationType, eventTime, owner,  message)
      console.log("store notification to DB for later send");
      createRmNotification(
        msg.notificationID,
        msg.notificationType,
        msg.eventTime,
        msg.owner,
        msg.message,
        msg.sourceID
      );
    }
  }
}

const socketManager = new SocketManager();
export { socketManager };
