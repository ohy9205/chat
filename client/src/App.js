import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Reset } from "styled-reset";
import Home from "./pages/Home";
import Chat from "./pages/Chat";

function App() {
  return (
    // <div className="App">
    <BrowserRouter>
      <Reset />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/chat/:room" element={<Chat />}></Route>
      </Routes>
    </BrowserRouter>
    // </div>
  );
}

export default App;
