import { useEffect, useState } from "react";
import socketIo from "socket.io-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message";

let socket;
let sendData; // 전송 데이터
let dataObj; // 전송 데이터를 JSON타입으로 변환

export default function Chat() {
  const { state: userName } = useLocation();
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const { room } = useParams();
  const navigate = useNavigate();

  const sendMessage = () => {
    if (text.trim().length <= 0) return;

    sendData = { userName, text, room };
    dataObj = JSON.stringify(sendData);
    socket.emit("SEND_MESSAGE", dataObj, setText(""));
  };

  const closeChat = () => {
    sendData = { userName, room };
    dataObj = JSON.stringify(sendData);

    socket.emit("LOG_OUT", dataObj);
    navigate(-1);
  };

  // 페이지 이동하면 로그아웃
  window.onbeforeunload = (e) => {
    sendData = { userName, room };
    dataObj = JSON.stringify(sendData);
    socket.emit("LOG_OUT", dataObj);
  };
  useEffect(() => {
    socket = socketIo.connect("http://localhost:4000");

    sendData = { userName, room };
    dataObj = JSON.stringify(sendData);
    socket.emit("JOIN_ROOM", dataObj); // 처음 렌더링 되면 사용자 접속을 알림

    socket.on("JOINED_ROOM", (message) => {
      const receiveData = JSON.parse(message);
      setChats((chats) => [...chats, receiveData]);
    });

    socket.on("RESPONSE_MESSAGE", (message) => {
      const receiveData = JSON.parse(message);
      setChats((chats) => [...chats, receiveData]);
    });

    socket.on("LOGGED_OUT", (message) => {
      const receiveData = JSON.parse(message);
      setChats((chats) => [...chats, receiveData]);
    });
  }, [userName, room]);

  return (
    <div>
      <h1>Chat</h1>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={sendMessage}>전송</button>
      <button onClick={closeChat}>종료</button>

      <ul>{chats && chats.map((chat, idx) => <Message key={idx} chat={chat} />)}</ul>
    </div>
  );
}
