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

app.get("/", (req, res) => {
  console.log("Home Called");
  // res.send("App Initialised");
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("User Connected");
});

app.listen(PORT, () => {
  console.log(`Server is Connected to Port ${PORT}`);
});
