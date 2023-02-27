import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "semantic-ui-react";
import style from "./Home.module.css";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState();

  //room정보모음
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName.trim().length <= 0 || roomName.trim().length <= 0) {
      setError("닉네임과 방 이름을 입력하세요");
      return;
    }

    navigate(`/chat/${roomName}`, { state: userName, replace: true });
  };

  return (
    // <div className={style.Home}>
    <div className={`${style.Home} ui floating message`}>
      <h1 className={style.title}>JOIN</h1>
      <form className={style.form} onSubmit={handleSubmit}>
        <Input type="text" minLength={1} name="username" id="username" value={userName} placeholder="닉네임" onChange={(e) => setUserName(e.target.value)} />
        <Input type="text" minLength={1} name="room" id="room" value={roomName} placeholder="방이름" onChange={(e) => setRoomName(e.target.value)} />
        <button className={`ui button teal ${style.formBtn}`} type="submit">
          입장
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
