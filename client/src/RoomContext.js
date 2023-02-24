import React, { useEffect, useState } from "react";

/*
 *ROOM Context 생성하고 방 이름 저장
 방 생성할때 context에 해당 이름 있는지 확인
 있으면 실패, 없으면 
 */
export const RoomContext = React.createContext("");

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([
    { name: "abc", users: ["tester1", "tester2"] },
    { name: "abc2", users: ["tester1", "tester2"] },
  ]);

  console.log(rooms);

  //rooms={id:'', name:'', users: []}

  useEffect(() => {}, []);

  return <RoomContext.Provider value={{ rooms, setRooms }}>{children}</RoomContext.Provider>;
};
