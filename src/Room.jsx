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
    const onWordChosen = (word) => {
        socket.emit('wordChosen', word);
        setRender(<Whiteboard socket={socket} option={option} mode="drawer" word={word} leaderboard={[]}/>);
    };
    const handleChoosing = (name) => {
        console.log("choseee")
        setRender(<Waiting content={`${name} is choosing the word`} />);
    };
    const handleDrawing = (name)=>{
         console.log("cjc")
    
         setRender(<Whiteboard socket={socket} option={option} mode="guesser" word="*****" leaderboard={[]} />)

    }
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
            setRender(<Whiteboard socket={socket} option={option} mode="guesser" word="hola" leaderboard={[]}/>);
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
            socket.off('choosing', handleChoosing);
            socket.off('drawing', handleDrawing);
        };
    }, [socket, option]);
   
    return (
        gameStarted === true ? (
           <> {render}</>
        ) : (
            option === "create" ? <CreateGameForm socket={socket} setGameStarted={setGameStarted}/>: <Waiting content="game is being started by the owner"/>
        )
    );
    

}
export default Room;
