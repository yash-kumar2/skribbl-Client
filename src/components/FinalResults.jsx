import React from 'react';

const FinalResults = ({ data }) => {
  if (!data || !data.finalScores) return null;

  // Sort players by score (already sorted, but ensuring it)
  const sortedPlayers = [...data.finalScores].sort((a, b) => b.score - a.score);

  const getPositionEmoji = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '🏅';
    }
  };

  const getPositionText = (index) => {
    switch (index) {
      case 0: return '1st Place';
      case 1: return '2nd Place';
      case 2: return '3rd Place';
      default: return `${index + 1}th Place`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-2xl p-8 border-2 border-white border-opacity-30 relative">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-purple-700 mb-4">🎉 Game Over! 🎉</h1>
          <div className="text-xl text-gray-700">
            Final Results
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">🏆 Leaderboard 🏆</h2>
          <div className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <div 
                key={player.username}
                className={`flex justify-between items-center p-4 rounded-xl transform transition-all duration-300 hover:scale-105 ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-300 shadow-lg' : 
                  index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 shadow-lg' : 
                  index === 2 ? 'bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200 shadow-lg' : 
                  'bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 shadow-md'
                }`}
              >
                <div className="flex items-center">
                  <div className="text-4xl mr-4">
                    {getPositionEmoji(index)}
                  </div>
                  <div>
                    <div className="font-bold text-xl text-gray-800">{player.username}</div>
                    <div className="text-sm text-purple-600 font-medium">
                      {getPositionText(index)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-700">
                    {player.score.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">total points</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Winner celebration */}
        {sortedPlayers.length > 0 && (
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl p-6 border-2 border-purple-300">
              <div className="text-2xl font-bold text-purple-700 mb-2">
                🎊 Congratulations! 🎊
              </div>
              <div className="text-lg text-gray-700">
                <span className="font-bold text-purple-600 text-xl">{sortedPlayers[0].username}</span> wins with {sortedPlayers[0].score.toLocaleString()} points!
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="text-lg text-purple-600 font-medium">
            Thanks for playing! 🎨
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 text-4xl opacity-20">🎨</div>
        <div className="absolute top-4 right-4 text-4xl opacity-20">🏆</div>
        <div className="absolute bottom-4 left-4 text-4xl opacity-20">✨</div>
        <div className="absolute bottom-4 right-4 text-4xl opacity-20">🎯</div>
        
        {/* Additional celebration elements */}
        <div className="absolute top-1/4 left-8 text-3xl opacity-15 animate-pulse">🎉</div>
        <div className="absolute top-1/4 right-8 text-3xl opacity-15 animate-pulse">🎊</div>
        <div className="absolute bottom-1/4 left-12 text-3xl opacity-15 animate-pulse">🌟</div>
        <div className="absolute bottom-1/4 right-12 text-3xl opacity-15 animate-pulse">⭐</div>
      </div>
    </div>
  );
};

export default FinalResults;