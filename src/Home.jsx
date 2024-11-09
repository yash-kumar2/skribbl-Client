// src/Home.jsx
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { io } from 'socket.io-client';

const socket = io(); // Adjust this if the server address is different

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function Home({socket,option,setOption}) {
    const navigate = useNavigate();
    const handleJoinRoom = (username, room,option) => {
        socket.emit('join', { username, room,option }, (error) => {
            if (error) {
                setError(error)
                console.error(error); // Replace with a state update if needed
            } else {
                console.log("sdf")
                navigate(`/room/${room}`);
                console.log(room)
            }
        });
    };
    
    const [open, setOpen] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [room, setRoom] = React.useState('');
    const [error, setError] = React.useState('');
    

    const handleOpen = (option2) => {
        setOption(option2)
        
        setOpen(true)};
    const handleClose = () => {
        setOpen(false);
        setError('');
        setUsername('');
        setRoom('');
    };

    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500">
            <h1 className="text-4xl font-bold text-white mb-10">Welcome to Scribbl Clone</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div
                    onClick={()=>handleOpen('join')}
                    className="cursor-pointer w-64 h-48 bg-blue-400 hover:bg-blue-500 transition-all rounded-lg shadow-lg flex flex-col items-center justify-center text-white text-xl font-semibold"
                >
                    Join Room
                </div>
                <div
                    onClick={()=>handleOpen('create')}
                    className="cursor-pointer w-64 h-48 bg-green-400 hover:bg-green-500 transition-all rounded-lg shadow-lg flex flex-col items-center justify-center text-white text-xl font-semibold"
                >
                    Create Room
                </div>
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {option} Room
                    </Typography>
                    <TextField
                        label="Username"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Room ID"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                    />
                    {error && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={()=>{
                            handleJoinRoom(username,room,option)
                        }}
                        sx={{ mt: 2 }}
                    >
                        {option} Room
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default Home;
