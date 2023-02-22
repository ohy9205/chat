const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const http = require("http").Server(app);

http.listen(port, () => console.log("server listening on ", port));

// *소켓접속
// *on: 수신 이벤트핸들러
// *connection: socket.io 기본 이벤트, 사용자가 웹 사이트 접속하면 자동 실행됨
const socketIO = require("socket.io")(http, { cors: { origin: "http://localhost:3000" } });

socketIO.on("connection", (socket) => {
  // console.log(`##############${socket.id} 연결됨###########`);
  // *유저입장 수신
  socket.on("LOG_IN", (data) => {
    socketIO.emit("LOGGED_IN", { message: `[공지] ${data.userName} 입장` });
  });

  // *채팅수신
  socket.on("SEND_MSG", (data) => {
    socketIO.emit("RESPONSE_MSG", data);
  });

  // *종료수신
  socket.on("LOG_OUT", (data) => {
    socketIO.emit("LOGED_OUT", { message: `[공지] ${data.userName} 채팅방 나감` });
    socket.on("disconnect", (reason) => console.log(reason));
  });

  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} disconnected : ${reason}`);
  });
});
