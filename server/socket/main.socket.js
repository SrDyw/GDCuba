import { Server as SocketServer } from "socket.io";
import { config } from "../configs/main.config.js";
import { serverConfig } from "../configs/server.config.js";
import { serverData } from "../data/server.data.js";
import server from "../server.js";
import { groupSwitch, message } from "./event.socket.js";

export const io = new SocketServer(server, {
  cors: {
    origin: config.origin,
  },
});

export const configureSocket = () => {
  io.on("connection", (socket) => {
    if (serverConfig.usersConected.length < serverConfig.userConcurrent) {
      serverConfig.usersConected = [...serverConfig.usersConected, socket.id];

      let groupsName = [];
      serverData.groups.forEach((g) => (groupsName = [...groupsName, g.name]));
      console.log(groupsName);

      socket.emit("generalInfoUpdate", {
        groups: groupsName,
      });
      console.log(serverConfig.usersConected);
    } else {
      console.log("conexion bloqued");
      return;
    }
    socket.on("disconnect", () => {
      serverConfig.usersConected = serverConfig.usersConected.filter(
        (m) => m != socket.id
      );
      serverData.groups.forEach((data) => {
        data.members = data.members.filter((m) => m != socket);
      });
      console.log(
        `User ${socket.id} disconnected: `,
        serverConfig.usersConected
      );
    });

    socket.on("message", (data) => message(socket, data));

    socket.on("groupSw", (data) => groupSwitch(socket, data));
  });
};
