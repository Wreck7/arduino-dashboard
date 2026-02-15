const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ⚠️ CHANGE THIS to your actual port
const port = new SerialPort({
  path: "COM6",  // example Windows
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

parser.on("data", (data) => {
  try {
    const jsonData = JSON.parse(data);
    console.log("Received:", jsonData);

    io.emit("sensorData", jsonData);

  } catch (err) {
    console.log("Invalid JSON:", data);
  }
});

app.use(express.static("public"));

server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
