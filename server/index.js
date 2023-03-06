const express = require("express");
const { send } = require("process");
const app = express();
const port = process.env.PORT || 4000;
const http = require("http").Server(app);

http.listen(port, () => console.log("server listening on ", port));

// !해시로 유저 관리
// Map 사용 가능
const rooms = new Map();

/**
 * users = [{key: 방이름 , value: users: [{key: 유저이름, value: 소켓id}]... }...]
 */

// 전송 데이터 정보
let sendData;

// 소켓 종료
const closeSocketHandler = (room, userName) => {
  const roomUsers = rooms.get(room);
  const deleteUser = roomUsers.get(userName);

  roomUsers.delete(userId);

  if (roomUsers.size > 0) {
    sendData = {
      text: `[공지] ${deleteUser} 채팅 종료`,
      type: "notice",
    };

    socketIO.to(deleteUser).emit("LEAVED_ROOM", sendData);
  }
};

// *소켓접속
const socketIO = require("socket.io")(http, {
  cors: { origin: "http://localhost:3000" },
});

socketIO.on("connection", (socket) => {
  console.log(`##############${socket.id} 연결########### 총 : ${socketIO.engine.clientsCount}`);

  const { userName, room } = socket.handshake.query; // data는 string타입으로 전송됨
  let userId = socket.id;

  // *유저정보X
  if (userName === "null" || room === "null") {
    sendData = { error: `잘못된 접근입니다.`, userId: socket.id };
    socketIO.emit("JOIN_FAILED", sendData);
    socket.disconnect();
    return;
  }

  // *유저중복
  const roomUsers = rooms.get(room) || new Map(); // 만들어져있던 방인지 확인
  if (roomUsers.size > 0) {
    const userExist = roomUsers.has(userName); // 동일 user가 있는지 확인
    if (userExist) {
      sendData = { error: "이미 존재하는 닉네임입니다.", userId: socket.id };
      socketIO.emit("JOIN_FAILED", sendData);
      socket.disconnect();
      return;
    }
  }

  // *정상접속
  roomUsers.set(userName, userId);
  rooms.set(room, roomUsers);

  socket.data = { room, userName };

  socket.join(room); // 해당 소켓을 현 채팅방에 join

  sendData = { userName, text: `[공지] ${userName} 입장`, type: "notice", usersCount: roomUsers.size };
  socketIO.to(room).emit("JOINED_ROOM", sendData);

  // *채팅
  socket.on("SEND_MESSAGE", ({ userName, text, room }) => {
    sendData = { userName, text };
    socketIO.to(room).emit("RESPONSE_MESSAGE", sendData);
  });

  // *연결종료, 이유출력
  socket.on("disconnect", (reason) => {
    const { room, userName } = socket.data;

    const roomUsers = rooms.get(room);

    roomUsers.delete(userName);

    if (roomUsers.size > 0) {
      sendData = {
        // text: `[공지] ${deleteUser} 채팅 종료`,
        text: `[공지] ${userName} 채팅 종료`,
        type: "notice",
      };

      socketIO.to(room).emit("LEAVED_ROOM", sendData);
    } else {
      rooms.delete(room);
    }

    console.log(`##############${socket.id} 종료###########`);
  });
});
