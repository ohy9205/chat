import React from "react";

export default function Message({ chat }) {
  return (
    <li>
      {chat.type ? (
        chat.text
      ) : (
        <p>
          <strong>{chat.userName} : </strong>
          {chat.text}
        </p>
      )}
    </li>
  );
}
