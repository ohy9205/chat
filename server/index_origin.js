const express = require("express");
const { send } = require("process");
const app = express();
const port = process.env.PORT || 4000;
const http = require("http").Server(app);

http.listen(port, () => console.log("server listening on ", port));

// user정보: userName, room, sockeId
let users = [];

// 전송 데이터 정보
let sendData;

// 소켓 종료
const closeSocketHandler = (socketId) => {
  const userIdx = users.findIndex((user) => user.userId === socketId);
  const user = userIdx !== -1 && users.splice(userIdx, 1);

  if (user) {
    sendData = {
      text: `[공지] ${user[0].userName} 채팅 종료`,
      type: "notice",
    };

    socketIO.to(user[0].room).emit("LEAVED_ROOM", sendData);
  }
};

// *소켓접속
const socketIO = require("socket.io")(http, {
  cors: { origin: "http://localhost:3000" },
});

socketIO.on("connection", (socket) => {
  console.log(`##############${socket.id} 연결###########`);

  // *유저입장
  socket.on("JOIN_ROOM", ({ userName, room }, callback) => {
    if (!userName || !room) {
      callback({ error: `올바른 접근이 아닙니다.` });
      return;
    }

    const userExist = users.find((user) => user.room === room && user.userName === userName);
    if (userExist) {
      callback({ error: `${userName}은 이미 사용중인 이름입니다.` });
      return;
    }

    users.push({ userId: socket.id, userName, room }); // 정상 입장하면 유저 정보 저장
    socket.join(room); // 해당 소켓을 현 채팅방에 join

    sendData = { userName, text: `[공지] ${userName} 입장`, type: "notice" };
    socketIO.to(room).emit("JOINED_ROOM", sendData);
  });

  // *채팅
  socket.on("SEND_MESSAGE", ({ userName, text, room }) => {
    sendData = { userName, text };
    socketIO.to(room).emit("RESPONSE_MESSAGE", sendData);
  });

  // *연결종료, 이유출력
  socket.on("disconnect", (reason) => {
    closeSocketHandler(socket.id);
    console.log(`##############${socket.id} 종료###########`);
  });
});