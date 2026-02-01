import { io } from "socket.io-client";
let socket = null;

export const initiateSocketConnection = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true,
});

  }
  return socket;
};

export const getSocket = () => {
  return socket;
};
