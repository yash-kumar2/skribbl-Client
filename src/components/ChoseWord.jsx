import React, { useState, useEffect } from 'react';

function WordSelection({ words, ms, onWordChosen }) {
    const [timeLeft, setTimeLeft] = useState(ms / 1000);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [ms]);

    const handleWordClick = (word) => {
        onWordChosen(word);
    };

    // Calculate progress circle parameters
    const radius = 30;
    const circumference = radius * 2 * Math.PI;
    const progress = (timeLeft / (ms / 1000)) * 100;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Choose the word to draw
                </h2>

                <div className="flex flex-col gap-3 mb-8">
                    {words.map((word, index) => (
                        <button
                            key={index}
                            onClick={() => handleWordClick(word)}
                            className="py-3 px-6 border-2 border-purple-500 text-purple-600 rounded-lg 
                                     hover:bg-purple-500 hover:text-white transition-colors duration-200
                                     font-medium text-lg"
                        >
                            {word}
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-center gap-4">
                    <div className="relative w-16 h-16">
                        <svg className="transform -rotate-90 w-16 h-16">
                            {/* Background circle */}
                            <circle
                                cx="32"
                                cy="32"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                className="text-gray-200"
                            />
                            {/* Progress circle */}
                            <circle
                                cx="32"
                                cy="32"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                className="text-purple-500 transition-all duration-200"
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <span className="text-xl font-bold text-gray-700">{timeLeft}s</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WordSelection;