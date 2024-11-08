// App.jsx
import { Routes, Route ,useNavigate} from 'react-router-dom';
import Home from './Home';
import Room from './Room';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3000");

function App() {
    //navigate=useNavigate()
    

    return (
        <Routes>
            <Route path="/" element={<Home socket={socket} />} />
            <Route path="/room/:id" element={<Room  socket={socket}/>} />
        </Routes>
    );
}

export default App;
