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
  console.log(`##############${socket.id} 연결됨###########`);

  let sendData;
  let dataObj;

  // *유저입장 수신
  socket.on("LOG_IN", (data) => {
    const { userName } = JSON.parse(data);
    sendData = { userName, message: `[공지] ${userName} 입장`, type: "notice" };
    dataObj = JSON.stringify(sendData);
    socketIO.emit("LOGGED_IN", dataObj);
  });

  // *채팅수신
  socket.on("SEND_MSG", (data) => {
    const { userName } = JSON.parse(data);
    const { message } = JSON.parse(data);
    sendData = { userName, message: message };
    dataObj = JSON.stringify(sendData);

    socketIO.emit("RESPONSE_MSG", dataObj);
  });

  // *종료수신
  socket.on("LOG_OUT", (data) => {
    const { userName } = JSON.parse(data);

    sendData = { userName, message: `[공지] ${userName} 채팅 종료`, type: "notice" };
    dataObj = JSON.stringify(sendData);

    socketIO.emit("LOGGED_OUT", dataObj);
    // socket.on("disconnect", (reason) => console.log(`${socket.id} disconnected : ${reason}`));
  });

  // *연결종료, 이유출력
  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} disconnected : ${reason}`);
  });
});
