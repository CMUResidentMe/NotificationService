import dotenv from "dotenv";
dotenv.config();

class SocketManager {

  constructor() {
    this.socketMap = {};
    this.userMap = {}; 
  }

  async handleSocketMiddleware(socket, next) {
    const userUUID = socket.handshake.auth.userUUID;
    if (userUUID != null && userUUID != "undefined") { 
      socket.userUUID = userUUID;
      socket.topic = userTopic;
    }else{
      return;
    }
    const userTopic = socket.handshake.auth.topic;
    if (userTopic != null && userTopic != "undefined") { 
      socket.topic = userTopic;
    }
    next();
  }

  async socketHandler(socket, io) {
    let userUUID = socket.userUUID;
    if (userUUID == null || userUUID == "undefined") {
      return;
    }
    this.addUser(userUUID, socket);
    socket.on("disconnect", () => this.handleDisconnect(socket, io));
  }

  async addUser(userUUID, socket) {
    // Add user to socket map
    let socketId = socket.id;
    if(!(userUUID in userMap)){
      this.userMap[userUUID] = {};
      this.userMap[userUUID]['sockets'] = new Set();
      this.userMap[userUUID]['topics'] = new Set();
      this.userMap[userUUID]['topics'].add(process.env.DEFAULT_TOPICS);
    }
    this.socketMap[socketId] = socket;
    this.userMap[userUUID].add(socketId);
  }

  async handleDisconnect(socket) {
    console.log(`${socket.id} disconnected from socketHandler`);
    try {
      removeUser(socket);
      await updateUserLeaveAndNotifyOthers(username, io, socket.token);
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  }

  async removeUser(socket) {
    // Remove user from socket map
    if(socket.userUUID in this.userMap){
      this.userMap[userUUID]['sockets'].delete(socket.id);
      delete this.socketMap[socket.id];
      if(this.userMap[userUUID]['sockets'].size == 0){
        delete this.userMap[userUUID];
      }
    }
  }

  async emitMessage(userUUID, topic, msg){
    let sidList = this.userMap[userUUID];
    if(sidList){
      sidList.forEach((sid) => {
        let socket = this.socketMap[sid];
        if(socket.topic == topic || socket.topic == 'ALL'){
          socket.emit(messageType, msg);
        }
      });
    }
  }
}

const socketManager = new SocketManager();
export { socketManager };
