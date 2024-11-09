import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#f0f8ff',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
};

const CreateGameModal = ({ socket }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        noOfPlayers: 2,
        noOfRounds: 2,
        drawTime: 10,
        hints: false,
        wordCount: 1,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : Number(value),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit('createroom', formData);
        handleClose();
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500">
            <h1 className="text-4xl font-bold text-white mb-10">Create a Game</h1>
            <Button onClick={handleOpen} variant="contained" color="primary">
                Open Form
            </Button>

            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" style={{ color: '#4b0082', textAlign: 'center' }}>
                        Create a Game
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <label style={{ color: '#4682b4' }}>
                            Number of Players (2-20):
                            <input
                                type="number"
                                name="noOfPlayers"
                                min="2"
                                max="20"
                                value={formData.noOfPlayers}
                                onChange={handleChange}
                                style={{ marginLeft: '10px', padding: '5px', borderRadius: '5px' }}
                            />
                        </label>
                        <label style={{ color: '#4682b4' }}>
                            Number of Rounds (2-10):
                            <input
                                type="number"
                                name="noOfRounds"
                                min="2"
                                max="10"
                                value={formData.noOfRounds}
                                onChange={handleChange}
                                style={{ marginLeft: '10px', padding: '5px', borderRadius: '5px' }}
                            />
                        </label>
                        <label style={{ color: '#4682b4' }}>
                            Draw Time (10-150 sec):
                            <input
                                type="number"
                                name="drawTime"
                                min="10"
                                max="150"
                                value={formData.drawTime}
                                onChange={handleChange}
                                style={{ marginLeft: '10px', padding: '5px', borderRadius: '5px' }}
                            />
                        </label>
                        <label style={{ color: '#4682b4' }}>
                            Hints:
                            <input
                                type="checkbox"
                                name="hints"
                                checked={formData.hints}
                                onChange={handleChange}
                                style={{ marginLeft: '10px', transform: 'scale(1.2)' }}
                            />
                        </label>
                        <label style={{ color: '#4682b4' }}>
                            Word Count (1-4):
                            <input
                                type="number"
                                name="wordCount"
                                min="1"
                                max="4"
                                value={formData.wordCount}
                                onChange={handleChange}
                                style={{ marginLeft: '10px', padding: '5px', borderRadius: '5px' }}
                            />
                        </label>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#4b0082',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                        >
                            Create Room
                        </button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default CreateGameModal;
