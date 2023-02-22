import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName.trim().length <= 0) return;
    navigate("/chat", { state: userName });
  };

  return (
    <div>
      <h1>Home</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" minLength={6} name="username" id="username" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <button>SIGN IN</button>
      </form>
    </div>
  );
}
