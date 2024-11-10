// src/Room.jsx
import { useState,useEffect } from "react";
import Whiteboard from "./components/Whiteboard";
import CreateGameForm from "./components/GenerateGameForm";
import Waiting from "./components/Waiting";
import WordSelection from "./components/ChoseWord";
function Room({socket ,option}) {

    
    const [gameStarted,setGameStarted]=useState(false)
    const [wait,setWait]=useState(false)
    const [render,setRender]=useState(<Whiteboard socket={socket} option={option} />)
    useEffect(() => {
        const handleChooseWord = (words) => {
            setRender(<WordSelection words={words} ms={25000} onWordChosen={onWordChosen} />);
            console.log("Word selection phase", words);
        };

        const handleStartDraw = () => {
            setRender(<Whiteboard socket={socket} option={option} mode="drawer" word="hola" leaderboard={[]}/>);
        };

        const handleGameStarted = () => {
            setGameStarted(true);
        };

        // Register socket events
        socket.on('chooseWord', handleChooseWord);
        socket.on('startDraw', handleStartDraw);
        socket.on('gameStarted', handleGameStarted);
        socket.on('choosing',handleChoosing);
        socket.on('drawing',handleDrawing);

        // Cleanup listeners on component unmount
        return () => {
            socket.off('chooseWord', handleChooseWord);
            socket.off('startDraw', handleStartDraw);
            socket.off('gameStarted', handleGameStarted);
        };
    }, [socket, option]);
    const onWordChosen = (word) => {
        socket.emit('startDraw', word);
        setRender(<Whiteboard socket={socket} option={option} mode="drawer" word="hola" leaderboard={[]}/>);
    };
    const handleChoosing = (name) => {
        setRender(<Waiting content={`${name} is choosing the word`} />);
    };
    const handleDrawing = (name)=>{
         setRender(<Whiteboard socket={socket} option={option} mode="guesser" word="hola" leaderboard={[]} />)

    }
    return (
        gameStarted === true ? (
           <> {render}</>
        ) : (
            option === "create" ? <CreateGameForm socket={socket} setGameStarted={setGameStarted}/>: <Waiting content="jdfs"/>
        )
    );
    

}
export default Room;
