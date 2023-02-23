import { useEffect, useState } from "react";
import socketIo from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";

let socket;
let sendData; // 전송 데이터를 JSON으로 변환(stringify)
let dataObj; // 전송 데이터

export default function Chat() {
  const { state: userName } = useLocation();
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // let dataObj; // 전송 데이터
  // let jsonObj; // 전송 데이터를 JSON으로 변환(stringify)
  // let receiveData; // 서버로부터 받은 데이터(parse)

  const sendMessage = () => {
    if (message.trim().length <= 0) return;

    sendData = { userName, message };
    dataObj = JSON.stringify(sendData);
    socket.emit("SEND_MSG", dataObj, () => setMessage(""));
    // socket.emit("SEND_MSG", dataObj);
  };

  const closeChat = () => {
    sendData = { userName };
    dataObj = JSON.stringify(sendData);

    socket.emit("LOG_OUT", dataObj);
    navigate(-1);
  };

  // 페이지 이동하면 로그아웃
  window.onbeforeunload = (e) => {
    sendData = { userName };
    dataObj = JSON.stringify(sendData);
    // socket.emit("LOG_OUT", dataObj);
  };

  // 처음 렌더링 되면 사용자 접속을 알림
  useEffect(() => {
    socket = socketIo.connect("http://localhost:4000");

    sendData = { userName };
    dataObj = JSON.stringify(sendData);
    socket.emit("LOG_IN", dataObj);

    socket.on("LOGGED_IN", (message) => {
      const receiveData = JSON.parse(message);
      setChats((chats) => [...chats, receiveData]);
    });
    // socket.on("LOGGED_IN", (data) => setChats([...chats, data]));

    socket.on("RESPONSE_MSG", (message) => {
      const receiveData = JSON.parse(message);
      setChats((chats) => [...chats, receiveData]);
    });
    // socket.on("RESPONSE_MSG", (data) => setChats([...chats, data]));

    socket.on("LOGGED_OUT", (message) => {
      const receiveData = JSON.parse(message);
      setChats((chats) => [...chats, receiveData]);
    });
    // socket.on("LOGED_OUT", (data) => setChats([...chats, data]));
  }, [userName]);

  return (
    <div>
      <h1>Chat</h1>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>전송</button>
      <button onClick={closeChat}>종료</button>

      <section>
        {chats &&
          chats.map((chat, idx) => {
            return (
              <div key={idx}>
                {chat.type ? (
                  chat.message
                ) : (
                  <p>
                    <strong>{chat.userName} : </strong>
                    {chat.message}
                  </p>
                )}
              </div>
            );
          })}
      </section>
    </div>
  );
}
