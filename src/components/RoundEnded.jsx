import React from 'react';

const RoundEnded = ({ data }) => {
  if (!data) return null;

  // Convert roundScores object to array and sort by score
  const sortedRoundScores = Object.entries(data.roundScores)
    .map(([username, score]) => ({ username, score }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-2xl p-8 border-2 border-white border-opacity-30">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-700 mb-2">Round {data.round} Ended!</h1>
          <div className="text-lg text-gray-700 mb-4">
            <span className="font-semibold">{data.drawer}</span> was drawing: 
            <span className="font-bold text-purple-600 ml-2 text-xl">"{data.word}"</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">Round Scores</h2>
          <div className="space-y-4">
            {sortedRoundScores.map((player, index) => (
              <div 
                key={player.username}
                className={`flex justify-between items-center p-4 rounded-xl ${
                  index === 0 && player.score > 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-300' : 
                  index === 1 && player.score > 0 ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300' : 
                  index === 2 && player.score > 0 ? 'bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200' : 
                  'bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200'
                }`}
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold mr-4">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-800">{player.username}</div>
                    {player.username === data.drawer && (
                      <div className="text-sm text-purple-600 font-medium">Drawer</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-700">
                    +{player.score}
                  </div>
                  <div className="text-sm text-gray-600">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg text-purple-600 font-medium">
            Waiting for next round...
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 text-4xl opacity-20">🎨</div>
        <div className="absolute top-4 right-4 text-4xl opacity-20">🏆</div>
        <div className="absolute bottom-4 left-4 text-4xl opacity-20">✨</div>
        <div className="absolute bottom-4 right-4 text-4xl opacity-20">🎯</div>
      </div>
    </div>
  );
};

export default RoundEnded;