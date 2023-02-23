import express from "express";
import SOCKET_EVENT from "../common/socket.js";
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
  socket.on(SOCKET_EVENT.JOIN_ROOM, (message) => {
    const { userName, room } = JSON.parse(message);

    sendData = { userName, text: `[공지] ${userName} 입장`, type: "notice" };
    dataObj = JSON.stringify(sendData);
    socketIO.emit(SOCKET_EVENT.JOINED_ROOM, dataObj);
  });

  // *채팅수신
  socket.on(SOCKET_EVENT.SEND_MESSAGE, (message) => {
    const { userName, text, room } = JSON.parse(message);
    sendData = { userName, text };
    dataObj = JSON.stringify(sendData);

    socketIO.emit(SOCKET_EVENT.RESPONSE_MESSAGE, dataObj);
  });

  // *종료수신
  socket.on(SOCKET_EVENT.LOG_OUT, (message) => {
    const { userName } = JSON.parse(message);

    sendData = { userName, text: `[공지] ${userName} 채팅 종료`, type: "notice" };
    dataObj = JSON.stringify(sendData);

    socketIO.emit(SOCKET_EVENT.LOGGED_OUT, dataObj);
    socket.on("disconnect", (reason) => console.log(`${socket.id} LOGGED_OUT disconnected : ${reason}`));
  });

  // *연결종료, 이유출력
  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} disconnected : ${reason}`);
  });
});
