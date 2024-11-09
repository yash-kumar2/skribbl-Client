// src/Room.jsx
import { useState } from "react";
import Whiteboard from "./components/Whiteboard";
import CreateGameForm from "./components/GenerateGameForm";
function Room({socket ,option}) {
    const [gameStarted,setGameStarted]=useState(false)
    return (
        gameStarted === true ? (
            <Whiteboard socket={socket} option={option} />
        ) : (
            option === "create" ? <CreateGameForm/>: <h1>game is starting</h1>
        )
    );
    

}
export default Room;
