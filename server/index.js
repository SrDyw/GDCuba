import server from "./server.js";
import { config } from "./configs/main.config.js";
import { configureSocket } from "./socket/main.socket.js";

configureSocket();

server.listen(config.PORT, () => {
  console.log(`Server on port ${config.PORT}`);
  
  // fetch('https://gdbrowser.com/api/profile/6079944')
  // .then(res => res.json())
  // .then(res => console.log(res));
});
