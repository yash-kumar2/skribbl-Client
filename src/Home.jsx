// src/Home.jsx
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import Modal from '@mui/material/Modal';
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
function Home() {
    const navigate = useNavigate();

    const handleJoinRoom = () => {
        // Logic to join a room (e.g., prompt for room ID and navigate)
        navigate('/join'); // Adjust path if needed
    };

    const handleCreateRoom = () => {
        // Logic to create a room and navigate to it
        navigate('/create'); // Adjust path if needed
    };
    const [open, setOpen] = React.useState(false);
     const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500">
            <h1 className="text-4xl font-bold text-white mb-10">Welcome to Scribbl Clone</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div
                    onClick={handleJoinRoom}
                    className="cursor-pointer w-64 h-48 bg-blue-400 hover:bg-blue-500 transition-all rounded-lg shadow-lg flex flex-col items-center justify-center text-white text-xl font-semibold"
                >
                    Join Room
                </div>
                <div
                    onClick={handleOpen}
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
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
           work in progress
          </Typography>
        </Box>
      </Modal>
        </div>
    );
}

export default Home;
