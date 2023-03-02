import { useEffect, useRef, useState } from "react";
import socketIo from "socket.io-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message";
import style from "./Chat.module.css";

let socket;
let sendData; // 전송 데이터

export default function Chat() {
  const { state: userName } = useLocation();
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const { room } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef();

  console.log();

  // 데이터 전송
  const sendMessageHandler = (e) => {
    e.preventDefault();
    if (text.trim().length <= 0) return;

    sendData = { userName, text, room };
    socket.emit("SEND_MESSAGE", sendData, setText(""));
  };

  // 페이지 이동하면 로그아웃
  const leaveChatHandler = (e) => {
    socket.disconnect();
    navigate("/", { replace: true });
  };

  // 스크롤 이동
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    socket = socketIo.connect("http://localhost:4000");

    sendData = { userName, room };
    socket.emit("JOIN_ROOM", sendData, (error) => {
      alert(error.error);
      navigate("/", { replace: true });
    }); // 처음 렌더링 되면 사용자 접속을 알림

    socket.on("JOINED_ROOM", (receiveData) => {
      setChats((chats) => [...chats, receiveData]);
    });

    socket.on("RESPONSE_MESSAGE", (receiveData) => {
      setChats((chats) => [...chats, receiveData]);
    });

    socket.on("LEAVED_ROOM", (receiveData) => {
      setChats((chats) => [...chats, receiveData]);
    });
  }, [room, userName, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  return (
    <div className={`${style.Chat} ui floating message`}>
      <h1 className={style.title}>
        <i className={`angle left icon teal ${style.leaveBtn}`} onClick={leaveChatHandler}></i>
        {room}
      </h1>

      <ul className={style.messageBox} ref={scrollRef}>
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
