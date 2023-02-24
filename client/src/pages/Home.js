import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "semantic-ui-react";
import { RoomContext } from "../RoomContext";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();
  const { rooms, setRooms } = useContext(RoomContext);
  const [error, setError] = useState();

  //room정보모음
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName.trim().length <= 0 || roomName.trim().length <= 0) {
      setError("닉네임과 방 이름을 입력하세요");
      return;
    }

    // 방이 존재하는지 찾고
    // 존재하면 유저 이름을 검색함
    const roomExist = rooms.findIndex((room) => room.name === roomName);
    let copyRooms = [...rooms];
    // console.log(`roomExist : ${roomExist.name}- ${roomExist.users}`);
    console.log(roomExist);
    if (roomExist !== -1) {
      // 방이 있으면 동일 이름 유저가 존재하는지 검사
      const userExist = copyRooms[roomExist].users.findIndex((user) => user === userName);
      console.log(`userExist : ${userExist}`);

      // 유저가 있으면 에러 셋
      if (userExist !== -1) {
        setError("사용할 수 없느 닉넴");
        return;
      }
      // 유저 없으면 기존 방에 user만 업데이트
      copyRooms[roomExist] = { ...copyRooms[roomExist], users: [...copyRooms[roomExist].users, userName] };
      setRooms(copyRooms);
      // setRooms((rooms) => [...rooms, roomExist.users.push(userName)]);
      // setRooms((rooms) => [...rooms, { ...roomExist, users: [...roomExist.users, userName] }]);
    } else {
      setRooms((rooms) => [...rooms, { name: roomName, users: [userName] }]);
    }
    navigate(`/chat/${roomName}`, { state: userName });

    // console.log(rooms);
    // setRooms((rooms) => [...rooms, { name: roomName, users: [...rooms.users, userName] }]);
    // navigate(`/chat/${roomName}`, { state: userName });
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
