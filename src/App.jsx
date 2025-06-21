// App.jsx
import { Routes, Route ,useNavigate} from 'react-router-dom';
import Home from './Home';
import Room from './Room';
import io from 'socket.io-client';
import { useState } from 'react';
const socket = io.connect("https://server-skribbl.onrender.com");

function App() {
    const [option,setOption]=useState('')
    //navigate=useNavigate()
    

    return (
        <Routes>
            <Route path="/" element={<Home socket={socket} option={option} setOption={setOption}/>} />
            <Route path="/room/:id" element={<Room  socket={socket} option={option} setOption={setOption}/>} />
        </Routes>
    );
}

export default App;
