import React, { useState } from 'react';

const CreateGameModal = ({ socket, setGameStarted }) => {
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
        socket.emit('gameStarted', formData);
        setGameStarted(true);
        handleClose();
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
                    Scribbl
                </h1>
                <button
                    onClick={handleOpen}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-4 px-8 rounded-full transform hover:scale-105 transition-transform duration-200 shadow-lg text-xl"
                >
                    Create Game Room
                </button>

                {open && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                            <div className="p-6">
                                <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
                                    Game Settings
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        {[
                                            {
                                                label: "Players",
                                                name: "noOfPlayers",
                                                min: 2,
                                                max: 20,
                                                icon: "👥"
                                            },
                                            {
                                                label: "Rounds",
                                                name: "noOfRounds",
                                                min: 2,
                                                max: 10,
                                                icon: "🔄"
                                            },
                                            {
                                                label: "Draw Time",
                                                name: "drawTime",
                                                min: 10,
                                                max: 150,
                                                icon: "⏱"
                                            },
                                            {
                                                label: "Words",
                                                name: "wordCount",
                                                min: 1,
                                                max: 4,
                                                icon: "📝"
                                            }
                                        ].map((setting) => (
                                            <div key={setting.name} className="relative">
                                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                                    {setting.icon} {setting.label}
                                                </label>
                                                <input
                                                    type="range"
                                                    name={setting.name}
                                                    min={setting.min}
                                                    max={setting.max}
                                                    value={formData[setting.name]}
                                                    onChange={handleChange}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                />
                                                <span className="absolute right-0 -top-1 text-sm font-medium text-purple-600">
                                                    {formData[setting.name]}
                                                </span>
                                            </div>
                                        ))}
                                        
                                        <div className="flex items-center space-x-3">
                                            <label className="text-lg font-medium text-gray-700">
                                                💡 Enable Hints
                                            </label>
                                            <input
                                                type="checkbox"
                                                name="hints"
                                                checked={formData.hints}
                                                onChange={handleChange}
                                                className="w-6 h-6 rounded border-gray-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-1/2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                                        >
                                            Start Game
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateGameModal;