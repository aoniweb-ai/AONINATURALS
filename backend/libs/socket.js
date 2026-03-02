import { Server } from "socket.io";
import http from "http";

let io;

const onlineUsers = new Map();

export function initSocket(app) {
  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URI,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("register", (userData) => {
      onlineUsers.set(socket.id, {
        socketId: socket.id,
        fullname: userData?.fullname || "Guest",
        email: userData?.email || null,
        phone: userData?.phone || null,
        currentPage: userData?.currentPage || "/",
        device: userData?.device || "Unknown",
        joinedAt: new Date().toISOString(),
      });
      emitOnlineUsers();
    });

    socket.on("pageChange", (page) => {
      const user = onlineUsers.get(socket.id);
      if (user) {
        user.currentPage = page;
        onlineUsers.set(socket.id, user);
        emitOnlineUsers();
      }
    });

    socket.on("adminJoin", () => {
      socket.join("admin-room");
      socket.emit("onlineUsers", getOnlineUsersArray());
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
      onlineUsers.delete(socket.id);
      emitOnlineUsers();
    });
  });

  return server;
}

function getOnlineUsersArray() {
  return Array.from(onlineUsers.values());
}

function emitOnlineUsers() {
  if (io) {
    io.to("admin-room").emit("onlineUsers", getOnlineUsersArray());
  }
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}
