import React from "react";
import style from "./Message.module.css";

export default function Message({ chat, userName }) {
  return (
    <li className={style.Message}>
      {chat.type === "notice" ? (
        <p className={style.notice}>{chat.text}</p>
      ) : (
        <p className={`${style.textBox} ${userName === chat.userName && style.mine}`}>
          <span className={style.text}>{chat.text}</span>
          <span className={style.userName}>{chat.userName}</span>
        </p>
      )}
    </li>
  );
}
