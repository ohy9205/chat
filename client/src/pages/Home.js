import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "semantic-ui-react";
import style from "./Home.module.css";

export default function Home() {
  const [userName, setUserName] = useState(""); // 닉네임
  const [roomName, setRoomName] = useState(""); // 방 이름
  const navigate = useNavigate();
  const [error, setError] = useState(); // 에러 내용을 담은 state

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName.trim().length <= 0 || roomName.trim().length <= 0) {
      setError("닉네임과 방 이름을 입력하세요");
      return;
    }

    navigate(`/chat/${roomName}`, { state: userName, replace: true });
  };

  useEffect(() => {
    if (userName.trim().length > 0 && roomName.trim().length > 0) setError();
  }, [userName, roomName]);

  return (
    <div className={`${style.Home} ui floating message`}>
      <h1 className={style.title}>Join</h1>
      <form className={style.form} onSubmit={handleSubmit}>
        <Input
          type="text"
          minLength={1}
          maxLength={7}
          name="username"
          id="username"
          value={userName}
          placeholder="닉네임"
          onChange={(e) => setUserName(e.target.value)}
        />
        <Input
          type="text"
          minLength={1}
          maxLength={10}
          name="room"
          id="room"
          value={roomName}
          placeholder="방이름"
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button className={`ui button teal ${style.formBtn}`} type="submit">
          입장
        </button>
        {error && <p className={style.error}>{error}</p>}
      </form>
    </div>
  );
}
