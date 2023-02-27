import { useEffect, useRef, useState } from "react";
import socketIo from "socket.io-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message";
import style from "./Chat.module.css";

let socket;
let sendData; // 전송 데이터
let dataObj; // 전송 데이터를 JSON타입으로 변환

export default function Chat() {
  const { state: userName } = useLocation();
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const { room } = useParams();
  const navigate = useNavigate();
  const messageBoxRef = useRef();

  const sendMessageHandler = (e) => {
    e.preventDefault();
    if (text.trim().length <= 0) return;

    sendData = { userName, text, room };
    dataObj = JSON.stringify(sendData);
    socket.emit("SEND_MESSAGE", dataObj, setText(""));
  };

  // 페이지 이동하면 로그아웃
  const leaveChatHandler = (e) => {
    sendData = { userName, room };
    dataObj = JSON.stringify(sendData);
    socket.emit("LEAVE_ROOM", dataObj);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    socket = socketIo.connect("http://localhost:4000");

    sendData = { userName, room };
    dataObj = JSON.stringify(sendData);
    socket.emit("JOIN_ROOM", dataObj, (error) => {
      alert(error.error);
      navigate("/", { replace: true });
    }); // 처음 렌더링 되면 사용자 접속을 알림

    socket.on("JOINED_ROOM", (message) => {
      const receiveData = JSON.parse(message);
      setChats((chats) => [...chats, receiveData]);
    });

    socket.on("RESPONSE_MESSAGE", (message) => {
      const receiveData = JSON.parse(message);
      setChats((chats) => [...chats, receiveData]);
    });

    socket.on("LEAVED_ROOM", (message) => {
      const receiveData = JSON.parse(message);
      setChats((chats) => [...chats, receiveData]);
    });
  }, [room, userName, navigate]);

  // chats이 갱신되면 스크롤을 맨 밑으로
  useEffect(() => {
    // window.addEventListener('scorll', )
  }, [chats]);

  return (
    <div className={`${style.Chat} ui floating message`}>
      <h1 className={style.title}>
        <i class={`angle left icon teal ${style.leaveBtn}`}></i>

        {room}
      </h1>

      <ul className={style.messageBox} ref={messageBoxRef}>
        {chats && chats.map((chat, idx) => <Message key={idx} chat={chat} userName={userName} />)}
      </ul>

      <form className={`ui action input ${style.sendBox}`}>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        <button className={`ui button ${text && "teal"}`} onClick={sendMessageHandler}>
          전송
        </button>
      </form>
    </div>
  );
}
