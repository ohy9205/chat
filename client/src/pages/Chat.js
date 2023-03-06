import { useEffect, useRef, useState } from "react";
import socketIo from "socket.io-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message";
import style from "./Chat.module.css";
import { Loader } from "semantic-ui-react";

let socket;
let sendData; // 전송 데이터

export default function Chat() {
  const { state: userName } = useLocation();
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const { room } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef();
  const [isLoading, setIsLoading] = useState();

  // 데이터 전송
  const sendBtnHandler = (e) => {
    // console.log(e);
    // e.preventDefault();
    // if (e.shiftKey) {
    //   setText((prev) => prev + "\n");
    //   return;
    // }
    // // console.log("shift Push", e.shiftKey);
    // if (text.trim().length <= 0) return;
    // sendData = { userName, text, room };
    // socket.emit("SEND_MESSAGE", sendData, setText(""));
  };

  const keyDownHandler = (e) => {
    if (e.keyCode === 13 && e.shiftKey) {
      return;
    } else if (e.keyCode === 13) {
      if (text.trim().length <= 0) return;

      sendData = { userName, text, room };
      socket.emit("SEND_MESSAGE", sendData, setText(""));
    }
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
    // ? socket변수가 일반 변수(let)로 선언되어있는데, 그러면 rerendering됐을 때 초기화돼야하는거 아닌지..
    // ? => Chat 컴포넌트 밖에 선언됐기 때문에 리렌더링이랑은 상관 없음

    setIsLoading(true);
    socket = socketIo.connect("http://localhost:4000", {
      query: {
        // query값들은 string 값으로 전달됨
        userName,
        room,
      },
    });

    socket.on("connect", () => {
      socket.sendBuffer = [];
      setIsLoading(false);
      console.log("socket.on connect");
    });

    socket.on("connect_error", (error) => {
      setIsLoading(true);
      console.log("socket.on connect_error", error);
    });

    socket.on("reconnect_attempt", (count) => {
      if (count === 3) {
        socket.disconnect();
        alert("연결에 실패했습니다.");
        navigate("/");
      }
    });

    socket.on("JOIN_FAILED", (receiveData) => {
      const { userId, error } = receiveData;
      if (userId === socket.id) {
        alert(error);
        navigate("/", { replace: true });
      }
      console.log(` ${userId} 연결종료`);
    });

    socket.on("JOINED_ROOM", (receiveData) => {
      setChats((chats) => [...chats, receiveData]);
      setIsLoading(false);
    });

    socket.on("RESPONSE_MESSAGE", (receiveData) => {
      setChats((chats) => [...chats, receiveData]);
    });

    socket.on("LEAVED_ROOM", (receiveData) => {
      console.log(receiveData);
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
        <span>{}</span>
      </h1>

      <ul className={style.messageBox} ref={scrollRef}>
        {isLoading ? (
          <Loader active inline="centered">
            Loading...
          </Loader>
        ) : (
          chats && chats.map((chat, idx) => <Message key={idx} chat={chat} userName={userName} />)
        )}

        {/* {chats && chats.map((chat, idx) => <Message key={idx} chat={chat} userName={userName} />)} */}
      </ul>

      <form className={`ui action input ${style.sendBox}`}>
        {/* <form className={`ui action input ${style.sendBox}`} onSubmit={sendFormHandler}> */}
        {/* <input type="text" value={text} onChange={(e) => setText(e.target.value)} disabled={isLoading} /> */}
        {/* <textarea onChange={(e) => setText(e.target.value)} value={text} onKeyDown={keyDownHandler} disabled={isLoading} /> */}
        <textarea onChange={(e) => setText(e.target.value)} value={text} onKeyDown={keyDownHandler} disabled={isLoading} />
        <button className={`ui button ${text && "teal"}`} onClick={sendBtnHandler}>
          전송
        </button>
      </form>
    </div>
  );
}
