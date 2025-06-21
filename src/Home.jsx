import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from './GlobalContext';

function Home({ socket, option, setOption }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    const [error, setError] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [checkError, setCheckError] = useState('');
    const { user, setUser } = useGlobalContext();

    const checkActivity = async () => {
        setIsChecking(true);
        setCheckError('');
        
        try {
            const response = await fetch('http://localhost:3000/active');
            if (response.ok) {
                setIsActive(true);
            } else {
                setIsActive(false);
                setCheckError('Server not active');
            }
        } catch (error) {
            setIsActive(false);
            setCheckError('Connection failed');
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        checkActivity();
    }, []);

    const handleJoinRoom = (username, room, option) => {
        if (!isActive) return;
        
        socket.emit('join', { username, room, option }, (error) => {
            if (error) {
                setError(error);
            } else {
                navigate(`/room/${room}`);
            }
        });
    };

    const handleOpen = (option2) => {
        if (!isActive) return;
        
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

                {/* Activity Status */}
                <div className="mb-8">
                    {isChecking ? (
                        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-4 text-white">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Checking server status...</span>
                            </div>
                        </div>
                    ) : !isActive ? (
                        <div className="bg-red-500 bg-opacity-20 backdrop-blur-lg rounded-lg p-4 text-white border-2 border-red-500 border-opacity-30">
                            <div className="flex items-center justify-center space-x-2 mb-3">
                                <span className="text-red-200">⚠️ Server not active</span>
                            </div>
                            <p className="text-sm text-red-200 mb-3">{checkError}</p>
                            <button
                                onClick={checkActivity}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                            >
                                Recheck
                            </button>
                        </div>
                    ) : (
                        <div className="bg-green-500 bg-opacity-20 backdrop-blur-lg rounded-lg p-4 text-white border-2 border-green-500 border-opacity-30">
                            <div className="flex items-center justify-center space-x-2">
                                <span className="text-green-200">✅ Server is active</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <button
                        onClick={() => handleOpen('join')}
                        disabled={!isActive || isChecking}
                        className={`group p-8 backdrop-blur-lg rounded-2xl transition-all duration-300 border-2 border-white border-opacity-20 ${
                            !isActive || isChecking
                                ? 'bg-gray-500 bg-opacity-20 cursor-not-allowed opacity-50'
                                : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                        }`}
                    >
                        <div className={`text-6xl mb-4 transition-transform duration-300 ${
                            !isActive || isChecking ? '' : 'group-hover:scale-110'
                        }`}>
                            🎮
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Join Room</h2>
                        <p className="text-white text-opacity-80">Join an existing game room</p>
                    </button>

                    <button
                        onClick={() => handleOpen('create')}
                        disabled={!isActive || isChecking}
                        className={`group p-8 backdrop-blur-lg rounded-2xl transition-all duration-300 border-2 border-white border-opacity-20 ${
                            !isActive || isChecking
                                ? 'bg-gray-500 bg-opacity-20 cursor-not-allowed opacity-50'
                                : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                        }`}
                    >
                        <div className={`text-6xl mb-4 transition-transform duration-300 ${
                            !isActive || isChecking ? '' : 'group-hover:scale-110'
                        }`}>
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
                                            onChange={(e) => {setUsername(e.target.value)
                                                setUser(e.target.value)
                                            }}
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
                                            disabled={!username || !room}
                                            className="w-1/2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
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