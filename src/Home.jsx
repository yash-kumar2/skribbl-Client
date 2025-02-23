import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ socket, option, setOption }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    const [error, setError] = useState('');

    const handleJoinRoom = (username, room, option) => {
        socket.emit('join', { username, room, option }, (error) => {
            if (error) {
                setError(error);
            } else {
                navigate(`/room/${room}`);
            }
        });
    };

    const handleOpen = (option2) => {
        setOption(option2);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError('');
        setUsername('');
        setRoom('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center">
                <div className="mb-12">
                    <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
                        Scribbl
                    </h1>
                    <p className="text-white text-xl opacity-90">Draw, Guess, Have Fun!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <button
                        onClick={() => handleOpen('join')}
                        className="group p-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl hover:bg-opacity-30 transition-all duration-300 border-2 border-white border-opacity-20"
                    >
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            🎮
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Join Room</h2>
                        <p className="text-white text-opacity-80">Join an existing game room</p>
                    </button>

                    <button
                        onClick={() => handleOpen('create')}
                        className="group p-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl hover:bg-opacity-30 transition-all duration-300 border-2 border-white border-opacity-20"
                    >
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            🎨
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Create Room</h2>
                        <p className="text-white text-opacity-80">Start a new game room</p>
                    </button>
                </div>

                {open && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-purple-600 mb-6">
                                    {option === 'join' ? 'Join Game Room' : 'Create Game Room'}
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                            placeholder="Enter your username"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Room ID
                                        </label>
                                        <input
                                            type="text"
                                            value={room}
                                            onChange={(e) => setRoom(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                            placeholder="Enter room ID"
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-red-500 text-sm mt-2">{error}</p>
                                    )}

                                    <div className="flex space-x-4 mt-6">
                                        <button
                                            onClick={handleClose}
                                            className="w-1/2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleJoinRoom(username, room, option)}
                                            className="w-1/2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                                        >
                                            {option === 'join' ? 'Join Room' : 'Create Room'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;