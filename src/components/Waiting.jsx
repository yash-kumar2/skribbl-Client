import React from 'react';

function Waiting({ content }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {content}
                </h2>
                <div className="flex justify-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    );
}

export default Waiting;