import { io } from "socket.io-client";

let socket;

export const connectSocket = () => {
  socket = io("http://localhost:8000", {
    auth: {
      token: localStorage.getItem("accessToken"),
    },
  });
};

export const getSocket = () => socket;
