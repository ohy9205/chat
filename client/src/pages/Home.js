import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "semantic-ui-react";

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

    navigate(`/chat/${roomName}`, { state: userName });
  };

  return (
    <div>
      <h1>Home</h1>
      <form className="" onSubmit={handleSubmit}>
        <Input
          className="ui input"
          type="text"
          minLength={1}
          name="username"
          id="username"
          value={userName}
          placeholder="닉네임"
          onChange={(e) => setUserName(e.target.value)}
        />
        <Input
          className="ui input"
          type="text"
          minLength={1}
          name="room"
          id="room"
          value={roomName}
          placeholder="방이름"
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button className="ui button" type="submit">
          입장
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
