import { io } from "socket.io-client";

let socket;

export const connectSocket = () => {
  socket = io(`http://172.27.0.81:8000`, {
    auth: {
      token: localStorage.getItem("accessToken"),
    },
  });
};

export { socket };
