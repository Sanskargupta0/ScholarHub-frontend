import io from "socket.io-client";
import config from "../config";

let socket;

export const initializeSocket = () => {
  socket = io(config.backendUrl);

  socket.on("connect");

  socket.on("disconnect");

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket first.");
  }
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.close();
  }
};
