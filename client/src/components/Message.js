import React from "react";
import style from "./Message.module.css";
// import MessageItem from "./MessageItem";

export default function Message({ chat, userName }) {
  return (
    <>
      {chat.type === "notice" ? (
        <li className={style.notice}>{chat.text}</li>
      ) : (
        <li className={`${style.textBox} ${userName === chat.userName && style.mine}`}>
          <span className={style.text}>{chat.text}</span>
          <span className={style.userName}>{chat.userName}</span>
        </li>
      )}
    </>
  );
}
