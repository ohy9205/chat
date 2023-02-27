const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const http = require("http").Server(app);

http.listen(port, () => console.log("server listening on ", port));

// *소켓접속
// *on: 수신 이벤트핸들러
// *connection: socket.io 기본 이벤트, 사용자가 웹 사이트 접속하면 자동 실행됨
const socketIO = require("socket.io")(http, { cors: { origin: "http://localhost:3000" } });

let users = []; // user정보: userName, room, sockeId

socketIO.on("connection", (socket) => {
  let sendData;
  let dataObj;

  console.log(`##############${socket.id} 연결됨###########`);

  // *유저입장
  socket.on("JOIN_ROOM", (message, callback) => {
    const { userName, room } = JSON.parse(message);

    const userExist = users.find((user) => user.room === room && user.userName === userName);
    if (userExist) {
      callback({ error: `${userName}은 이미 사용중인 이름입니다.` });
      return;
    }

    users.push({ id: socket.id, userName, room });
    socket.join(room);

    sendData = { userName, text: `[공지] ${userName} 입장`, type: "notice" };
    dataObj = JSON.stringify(sendData);
    socketIO.to(room).emit("JOINED_ROOM", dataObj);
  });

  // *채팅
  socket.on("SEND_MESSAGE", (message) => {
    const { userName, text, room } = JSON.parse(message);
    sendData = { userName, text };
    dataObj = JSON.stringify(sendData);

    socketIO.to(room).emit("RESPONSE_MESSAGE", dataObj);
  });

  // *채팅종료
  // socket.on("LOG_OUT", (message) => {
  socket.on("LEAVE_ROOM", (message) => {
    const userIdx = users.findIndex((user) => user.id === socket.id); // socket id로 user검색
    const user = userIdx !== -1 && users.splice(userIdx, 1); //splice: 원본수정, return Array

    if (user) {
      sendData = { text: `[공지] ${user[0].userName} 채팅 종료`, type: "notice" };
      dataObj = JSON.stringify(sendData);

      // socketIO.to(user[0].room).emit("LOGGED_OUT", dataObj);
      socketIO.to(user[0].room).emit("LEAVED_ROOM", dataObj);
    }
    console.log(`################### ${socket.id} disconnected ###################`);
  });

  // *연결종료, 이유출력
  socket.on("disconnect", (reason) => {
    const userIdx = users.findIndex((user) => user.id === socket.id);
    const user = userIdx !== -1 && users.splice(userIdx, 1); //splice: 원본수정, return Array
    // user: 삭제한애

    if (user) {
      sendData = { text: `[공지] ${user[0].userName} 채팅 종료`, type: "notice" };
      dataObj = JSON.stringify(sendData);

      socketIO.to(user[0].room).emit("LOGGED_OUT", dataObj);
    }

    console.log(`${socket.id} disconnected : ${reason}`);
  });
});
