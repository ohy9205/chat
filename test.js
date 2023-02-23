var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

var port = 7777;
http.listen(port, () => {
  console.log("server listening on : " + port);
});

/*
==============
프로토콜 정의
==============

Client To Server (client:send, server:receive)
{ "cmd":"LOG-IN", "userName":"XX" }
{ "cmd":"MSG-TO", "userName":"XX", "toUserName":"XXXX" }
{ "cmd":"LOG-OUT", "userName":"XXX" }

Server To Client (server:send, client:receive)
{ "cmd":"CONNECTED" }
{ "cmd":"LOGGED-IN", "userName":"XXXX" }
{ "cmd":"MSG-FROM", "fromUserName":"XXXX", "message":"XXXXXXXX" }
{ "cmd":"LOGGED-OUT", "userName":"XX" }

*/

var users = new Map();

io.on("connection", function (socket) {
  console.log(socket.id, "client connected...");

  // client socket 접속이 되었음을 client에게 알림.
  var DATA_OBJ = { cmd: "CONNECTED" };
  var DATA_STR = JSON.stringify(DATA_OBJ);
  socket.emit("MSG", DATA_STR);

  socket.on("MSG", function (data) {
    console.log(data);
    let receiveObj = JSON.parse(data);

    if (receiveObj.cmd == "LOG-IN") {
      // 클라이언트의 로그인 요청을 수신시. 클라이언트에서 보내온 사용자 이름으로 사용자를 등록한다.

      let client = {
        userName: receiveObj.userName,
        socket: socket,
      };

      console.log(client);

      map.set(receiveObj.userName, client);

      DATA_OBJ = { cmd: "LOGGED-IN", userName: receiveObj.userName };
      DATA_STR = JSON.stringify(DATA_OBJ);

      client.socket.emit("MSG", DATA_STR);
    } else if (receiveObj.cmd == "MSG-TO") {
      // 클라이언트의 메세지 전송 요청을 수신시.

      let client = map.get(receiveObj.userName);
      let toClient = map.get(receiveObj.toUserName);

      if (client && toClient) {
        DATA_OBJ = { cmd: "MSG-FROM", fromUserName: receiveObj.userName, message: receiveObj.message };
        DATA_STR = JSON.stringify(DATA_OBJ);

        toClient.socket.emit("MSG", DATA_STR);
      }
    } else if (receiveObj.cmd == "LOG-OUT") {
      // 클라이언트의 로그아웃 요청을 수신시. 다른 사용자에게 알리고, 로그아웃하는 사용자를 map에서 삭제한다.

      // map을 interate 하여 순환하며 모든 client에게 현재 client가 로그아웃 하였음을 알림.
      // ? socket.emit을 안쓰고 순환해서 알리는 이유는?
      map.forEach((obj, key) => {
        let toClient = obj;

        if (toClient) {
          DATA_OBJ = { cmd: "LOGGED-OUT", userName: receiveObj.userName };
          DATA_STR = JSON.stringify(DATA_OBJ);

          toClient.socket.emit("MSG", DATA_STR);
        }
      });

      // map에서 현재 사용자 삭제
      map.delete(receiveObj.userName);
    }
  });
});
