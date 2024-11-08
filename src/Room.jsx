// src/Room.jsx
import Whiteboard from "./components/Whiteboard";
function Room({socket}) {
    return (
        <Whiteboard socket={socket}/>
    );

}
export default Room;
