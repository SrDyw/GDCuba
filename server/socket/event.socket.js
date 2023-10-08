import { serverData } from "../data/server.data.js";


/**
 * @description Recive the message from the client and resend to all group members
 * @param {*} socket socket to trigger the event
 * @param {*} data Data from client
 */
export const message = (socket, data) => {
  console.log(serverData.groups[data.targetGroup], data.targetGroup);
  serverData.groups[data.targetGroup].members.forEach((m) => {
    if (m != socket) {
      m.emit("message", {
        message: data.message,
        user: data.user,
        id: data.id,
      });
    }
  });
};

/**
 * @description Recive the group change request from the client
 * @param {*} socket socket to trigger the event
 * @param {*} data Data from client
 */
export const groupSwitch = (socket, data) => {
  const requestInfo = {
    message: "",
    status: 200,
    code: 1,
    targetGroup: data.targetGroup,
  };
  const currentGroup = serverData.groups[data.currentGroup];
  console.log(data);
  if (serverData.groups[data.targetGroup]) {
    const group = serverData.groups[data.targetGroup];

    if (group.members.length < group.limit) {
      if (!group.members.includes(socket)) {
        group.members = [...group.members, socket];
        requestInfo.message = "Successfully";
        requestInfo.code = 1;
        console.log(`User ${socket.id} add to group ${group.name}`);
      } else {
        requestInfo.message = "Already in";
        requestInfo.code = 2;
      }
    } else {
      requestInfo.message = "Full party";
      requestInfo.status = 204;
      requestInfo.code = 3;
    }
  } else {
    // If the gropu doesn't exist create one
    serverData.groups = [
      ...serverData.groups,
      {
        name: "Group" + serverData.groups.length + 1,
        pass: "",
        limit: 4,
        members: [socket],
      },
    ];
  }
  if (requestInfo.code == 1 && currentGroup) {
    currentGroup.members = currentGroup.members.filter((m) => m != socket);
  }
  console.log(serverData.groups);
  socket.emit("groupSw", requestInfo);
};
