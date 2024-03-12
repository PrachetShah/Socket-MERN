const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = 5000;

const io = new Server(server);

/*
For React
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
*/

let users = [];
const addUser = (id, name, room) => {
  const user = { id, name, room };
  users.push(user);

  return { user };
};

app.get("/", (req, res) => {
  // res.send("App Initialised");
  res.sendFile(__dirname + "/index.html");
});

app.get("/chat", (req, res) => {
  // res.send("App Initialised");
  console.log(users);
  res.sendFile(__dirname + "/start.html");
});

// Main Socket Logic
io.on("connection", (socket) => {
  // console.log(socket.id);
  console.log("a user connected: ", socket.id);

  // joining room
  socket.on("join", ({ name, room }) => {
    const { user } = addUser(socket.id, name, room);
    socket.join(user.room);
    socket.emit("welcome", {
      user: "Admin",
      text: `Welocome to ${user.room}`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "Admin", text: `${user.name} has joined!` });

    // for chat message
    socket.on("room message", (msg) => {
      console.log("roon message: ", msg, socket.id);
      io.emit("room message", msg);
    });
  });

  // for chat message
  socket.on("chat message", (msg) => {
    console.log("message: ", msg, socket.id);
    io.emit("chat message", msg);
  });

  // when user disconnects
  socket.on("disconnect", () => {
    console.log("User with id: ", socket.id, " is disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is Connected to Port ${PORT}`);
});
