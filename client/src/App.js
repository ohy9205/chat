import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import { RoomProvider } from "./RoomContext";

function App() {
  return (
    <RoomProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/chat/:room" element={<Chat />}></Route>
        </Routes>
      </BrowserRouter>
    </RoomProvider>
  );
}

export default App;
