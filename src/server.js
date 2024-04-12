import dotenv from "dotenv";
dotenv.config();

import express from "express";;
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { socketManager } from "./middleware/socketManager.js";
import { consumeWorkOrderEvents } from './kafka/workorderConsumer.js'

const app = express();
const server = http.createServer(app);
const io = new Server(server, 
  {cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }});

process.on("SIGINT", function () {
  console.log("notification server exit!");
  process.exit(0);
});

io.use(socketManager.handleSocketMiddleware);
io.on("connection", (socket) => socketManager.socketHandler(socket, io));

consumeWorkOrderEvents().catch(console.error);

app.use(cors());
// error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.locals.error = { msg: err.message };
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 2008;
server.listen(PORT, () => {
  console.log("notification server is running on port", PORT);
});
