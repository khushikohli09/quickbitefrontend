import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("✅ WebSocket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ WebSocket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.log("⚠️ WebSocket connection error:", error.message);
});

export const connectSocket = (userId, role) => {
  if (!socket.connected) {
    socket.connect();
  }
  socket.emit("register", { userId, role });
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
