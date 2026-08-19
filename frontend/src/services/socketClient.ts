import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const serverUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    socket = io(serverUrl, {
      autoConnect: true,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
  }
  return socket;
};
