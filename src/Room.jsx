// src/Room.jsx
import { useState,useEffect } from "react";
import Whiteboard from "./components/Whiteboard";
import CreateGameForm from "./components/GenerateGameForm";
import Waiting from "./components/Waiting";
import WordSelection from "./components/ChoseWord";
import RoundEnded from "./components/RoundEnded";
import FinalResults from "./components/FinalResults"
function Room({socket ,option}) {

    
    const [gameStarted,setGameStarted]=useState(false)
    const [wait,setWait]=useState(false)
    const [render,setRender]=useState(<Whiteboard socket={socket} option={option} />)
    const onWordChosen = (word) => {
        socket.emit('wordChosen', word);
        //setRender(<Whiteboard socket={socket} option={option} mode="drawer" word={word} leaderboard={[]}/>);
    };
    const handleChoosing = (name) => {
        console.log("choseee")
        setRender(<Waiting content={`${name} is choosing the word`} />);
    };
    const handleDrawing = ({totalScores})=>{
         console.log("cjc")
    
         setRender(<Whiteboard socket={socket} option={option} mode="guesser" word="*****" leaderboard={totalScores} />)

    }
    const handleRoundEnded = (data) => {
        console.log("Round ended:", data);
        setRender(<RoundEnded data={data} />);
    };
    const handleGameEnded = (data) => {
        console.log("Game ended:", data);
        setRender(<FinalResults data={data} />);
    };
    
    
    useEffect(() => {
        const handleChooseWord = (words) => {
            setRender(<WordSelection words={words} ms={25000} onWordChosen={onWordChosen} />);
            console.log("Word selection phase", words);
        };

        const handleStartDraw = ({totalScores}) => {
            setRender(<Whiteboard socket={socket} option={option} mode="drawer" word="dsasd" leaderboard={totalScores}/>);
        };

        const handleGameStarted = ({totalScores}) => {
            setGameStarted(true);
            console.log(totalScores)
            setRender(<Whiteboard socket={socket} option={option} mode="guesser" word={word} leaderboard={totalScores}/>);
        };
        

        // Register socket events
        socket.on('chooseWord', handleChooseWord);
        socket.on('startDraw', handleStartDraw);
        socket.on('gameStarted', handleGameStarted);
        socket.on('choosing',handleChoosing);
        socket.on('drawing',handleDrawing);
        socket.on('roundEnded', handleRoundEnded);
        socket.on('gameEnded', handleGameEnded);

        // Cleanup listeners on component unmount
        return () => {
            socket.off('chooseWord', handleChooseWord);
            socket.off('startDraw', handleStartDraw);
            socket.off('gameStarted', handleGameStarted);
            socket.off('choosing', handleChoosing);
            socket.off('drawing', handleDrawing);
            socket.off('roundEnded', handleRoundEnded);
            socket.on('roundEnded', handleGameEnded);
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
