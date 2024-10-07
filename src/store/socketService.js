import io from "socket.io-client";
import config from "../config";

let socket;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(config.backendUrl);
  }

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

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
