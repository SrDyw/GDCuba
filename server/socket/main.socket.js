import { Server as SocketServer } from "socket.io";
import { mainConfig } from "../configs/main.config.js";
import { serverConfig } from "../configs/server.config.js";
import { serverData } from "../data/server.data.js";
import server from "../server.js";
import { disconnect, groupSwitch, message } from "./event.socket.js";
import { log } from "../debug/main.debug.js";

export const io = new SocketServer(server, {
  cors: {
    origin: mainConfig.origin,
  },
});

export const configureSocket = () => {
  io.on("connection", (socket) => {

    //#region INITIALS_VALIDATIONS
    if (serverConfig.usersConected.length < serverConfig.userConcurrent) {
      serverConfig.usersConected = [...serverConfig.usersConected, socket.id];

      let groupsName = [];
      serverData.groups.forEach((g) => (groupsName = [...groupsName, g.name]));
      log(groupsName);

      socket.emit("generalInfoUpdate", {
        groups: groupsName,
      });
      log(serverConfig.usersConected);
    } else {
      log("conexion bloqued");
      return;
    }
    //#endregion
    
    // Events
    socket.on("disconnect", () => disconnect(socket));
    socket.on("message", (data) => message(socket, data));
    socket.on("groupSw", (data) => groupSwitch(socket, data));
  });
};
