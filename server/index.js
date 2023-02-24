const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const http = require("http").Server(app);

http.listen(port, () => console.log("server listening on ", port));

// *소켓접속
// *on: 수신 이벤트핸들러
// *connection: socket.io 기본 이벤트, 사용자가 웹 사이트 접속하면 자동 실행됨
const socketIO = require("socket.io")(http, { cors: { origin: "http://localhost:3000" } });

let rooms = [];

// 넘어왔을 때 방이름, 아이디 찾고 없으면

socketIO.on("connection", (socket) => {
  let sendData;
  let dataObj;
  let count = 1;

  console.log(`##############${socket.id} 연결됨###########`);

  // *유저입장 수신
  socket.on("JOIN_ROOM", (message) => {
    const { userName, room } = JSON.parse(message);

    sendData = {};

    sendData = { userName, text: `[공지] ${userName} 입장`, type: "notice" };
    dataObj = JSON.stringify(sendData);
    socketIO.to(room).emit("JOINED_ROOM", dataObj);
  });

  // *유저입장 수신
  socket.on("LOG_IN", (message) => {
    const { userName, room } = JSON.parse(message);
    socket.join(room);

    // 방 이름 찾아서 rooms 데이터 추가

    sendData = { userName, text: `[공지] ${userName} 입장`, type: "notice" };
    dataObj = JSON.stringify(sendData);
    socketIO.to(room).emit("JOINED_ROOM", dataObj);
  });

  // *채팅수신
  socket.on("SEND_MESSAGE", (message) => {
    const { userName, text, room } = JSON.parse(message);
    sendData = { userName, text };
    dataObj = JSON.stringify(sendData);

    socketIO.to(room).emit("RESPONSE_MESSAGE", dataObj);
  });

  // *종료수신
  socket.on("LOG_OUT", (message) => {
    const { userName, room } = JSON.parse(message);
    sendData = { userName, text: `[공지] ${userName} 채팅 종료`, type: "notice" };
    dataObj = JSON.stringify(sendData);

    socketIO.to(room).emit("LOGGED_OUT", dataObj);
    socket.on("disconnect", (reason) => console.log(`${socket.id} LOGGED_OUT disconnected : ${reason}`));
  });

  // *연결종료, 이유출력
  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} disconnected : ${reason}`);
  });
});

/**
 * ! JOIN_ROOM 시 닉네임 검사하면 RESPONSE_MESSAGe, LOG_OUT 때마다 검사해야함
 * ! => connection되면 rooms 데이터를 클라이언트에 전달, 클라이언트에서는 중복 여부를 판단하고 userName값 변경(ex. tester1(1) )
 * ! => JOIN_ROOM에서는 데이터 중복검사하고, 바로 LOG_IN 이벤트 ㄱ
 */
