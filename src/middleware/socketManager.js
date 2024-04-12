import dotenv from "dotenv";
dotenv.config();

class SocketManager {

  constructor(io) {
    this.userMap = {};
  }

  async handleSocketMiddleware(socket, next) {
    const userUUID = socket.handshake.auth.token;
    console.log(`handleSocketMiddleware: ${userUUID}`);
    //get UUID from toekn
    if (userUUID != null && userUUID != "undefined") { 
      socket.userUUID = userUUID;
    }else{
      return;
    }
    next();
  }

  async socketHandler(socket, io) {
    let userUUID = socket.userUUID;
    if (userUUID == null || userUUID == "undefined") {
      return;
    }
    this.io = io;
    this.addUser(userUUID, socket);
    socket.on("disconnect", () => this.handleDisconnect(socket, io));
  }

  async addUser(userUUID, socket) {
    // Add user to socket map
    if(!(userUUID in this.userMap)){
      this.userMap[userUUID] = new Set();
    }
    this.userMap[userUUID].add(socket.id);
  }

  async handleDisconnect(socket) {
    console.log(`${socket.id} disconnected from socketHandler`);
    try {
      removeUser(socket);
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  }

  async removeUser(socket) {
    // Remove user from socket map
    if((socket.userUUID in this.userMap) && this.userMap[userUUID].has(socket.id)){
      this.userMap[userUUID].delete(socket.id);
    }
    if(this.userMap[userUUID].size == 0){
      delete this.userMap[userUUID];
    }
  }

  async emitUserMessage(userUUID, topic, msg){
    let sidList = this.userMap[userUUID];
    if(sidList){
      sidList.forEach((sid) => {
        console.log(msg['msgType']);
        this.io.to(sid).emit(msg['msgType'], msg);
      });
    }
  }
}

const socketManager = new SocketManager();
export { socketManager };
