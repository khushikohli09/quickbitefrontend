// src/socket.js
import { io } from "socket.io-client";

export const socket = io("https://quickbite-backend-47wd.onrender.com"); // change to your backend URL
export const registerSocketUser = (userId, role) => {
  socket.emit("register", { userId, role });
};

