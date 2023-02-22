import { useEffect, useState } from "react";
import socketIo from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";

export default function Chat() {
  const { state: userName } = useLocation();
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const socket = socketIo.connect("http://localhost:4000");
  const navigate = useNavigate();

  const sendMessage = () => {
    if (message.trim().length <= 0) return;
    socket.emit("SEND_MSG", { userName, message });
    setMessage("");
  };

  const closeChat = () => {
    socket.emit("LOG_OUT", { userName });
    navigate(-1);
  };

  // 페이지 이동하면 로그아웃
  window.onbeforeunload = (e) => {
    socket.emit("LOG_OUT", { userName });
  };

  useEffect(() => {
    socket.emit("LOG_IN", { userName });
  }, []);

  useEffect(() => {
    socket.on("LOGGED_IN", (data) => setChats([...chats, data]));
    socket.on("RESPONSE_MSG", (data) => setChats([...chats, data]));
    socket.on("LOGED_OUT", (data) => setChats([...chats, data]));
  }, [chats, socket]);

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
                <strong>{chat.userName}</strong>
                {chat.message}
              </div>
            );
          })}
      </section>
      {/* <section>{chats && chats.map((chat) => <p>{chat.userName}</p>)}</section> */}
    </div>
  );
}
