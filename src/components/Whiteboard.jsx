import React, { useRef, useState, useEffect } from 'react';

const Whiteboard = ({ socket, mode, word, leaderboard: initialLeaderboard }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  let strokeColor = '#000000';
  const [lineWidth, setLineWidth] = useState(5);
  const [fillColor, setFillColor] = useState('#ffffff');
  const [messages, setMessages] = useState([]);
  const [guess, setGuess] = useState("");
  const [leaderboard, setLeaderboard] = useState([
    { username: "Alice", score: 600 },
    { username: "Bob", score: 980 },
    { username: "Charlie", score: 400 }
  ]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialLeaderboard) {
      setLeaderboard(initialLeaderboard);
    }
  }, [initialLeaderboard]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = canvas.parentElement;
      const width = container.clientWidth;
      const height = Math.min(window.innerHeight * 0.6, width * 0.75);
    
      // Save the current canvas content
      const savedImage = canvas.toDataURL(); // Saves current drawing as an image
    
      // Resize canvas
      canvas.width = width * 2;
      canvas.height = height * 2;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    
      const context = canvas.getContext("2d");
      context.scale(2, 2);
      context.lineCap = "round";
      context.strokeStyle = strokeColor;
      context.lineWidth = lineWidth;
      contextRef.current = context;
    
      // Restore the saved image
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
      };
      img.src = savedImage;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const handleDraw = ({ x, y, color, width, beginNewPath }) => {
      if (beginNewPath) contextRef.current.beginPath();
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = width;
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
      contextRef.current.moveTo(x, y);
    };

    const handleMouseUp = () => {
      contextRef.current.beginPath();
    };

    const handleFill = (color) => {
      const ctx = contextRef.current;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    const handleColorChange2 = (color) => {
      console.log(color);
      strokeColor = color;
      contextRef.current.strokeStyle = color;
    };

    const handleMessage = (data) => {
      if (data.guess) {
        // This is a guess message
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            type: 'guess', 
            username: data.username, 
            text: data.guess, 
            correct: data.correct 
          }
        ]);
      } else if (data.correct === true) {
        // This is a correct guess message
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            type: 'correct', 
            username: data.username 
          }
        ]);
      }
    };

    socket.on('draw', handleDraw);
    socket.on('mouseup', handleMouseUp);
    socket.on('fill', handleFill);
    socket.on('colorChange', handleColorChange2);
    socket.on('message', handleMessage);

    return () => {
      socket.off('draw', handleDraw);
      socket.off('mouseup', handleMouseUp);
      socket.off('fill', handleFill);
      socket.off('colorChange', handleColorChange2);
      socket.off('message', handleMessage);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [socket, strokeColor, lineWidth, initialLeaderboard]);

  const startDrawing = ({ nativeEvent }) => {
    if (mode !== 'drawer') return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    socket.emit('draw', { x: offsetX, y: offsetY, color: strokeColor, width: lineWidth, beginNewPath: true });
  };

  const finishDrawing = () => {
    if (mode !== 'drawer') return;
    setIsDrawing(false);
    contextRef.current.closePath();
    socket.emit('mouseup');
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || mode !== 'drawer') return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    socket.emit('draw', { x: offsetX, y: offsetY, color: strokeColor, width: lineWidth, beginNewPath: false });
  };

  const handleColorChange = (e) => {
    strokeColor = e.target.value;
    contextRef.current.strokeStyle = e.target.value;
    socket.emit('colorChange', e.target.value);
  };

  const handleLineWidthChange = (e) => {
    const newWidth = parseInt(e.target.value, 10);
    setLineWidth(newWidth);
    contextRef.current.lineWidth = newWidth;
  };

  const handleFill = () => {
    contextRef.current.fillStyle = fillColor;
    contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    socket.emit('fill', fillColor);
  };

  const handleGuessChange = (e) => setGuess(e.target.value);

  const submitGuess = () => {
    if (!guess.trim()) return;
    socket.emit('guess', guess);
    setMessages([...messages, { type: 'myGuess', text: guess }]);
    setGuess("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Drawing Area */}
          <div className="lg:col-span-2 bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-2 border-white border-opacity-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-purple-700 capitalize">{mode} Mode</h2>
              {mode === 'drawer' && word && (
                <div className="text-lg bg-purple-100 px-4 py-2 rounded-full">
                  Draw: <span className="font-bold text-purple-800">{word}</span>
                </div>
              )}
            </div>

            {mode === 'drawer' && (
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Color:</label>
                  <input
                    type="color"
                    onChange={handleColorChange}
                    className="w-16 h-8 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Width:</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={lineWidth}
                    onChange={handleLineWidthChange}
                    className="w-32"
                  />
                  <span className="text-sm">{lineWidth}px</span>
                </div>
                <button
                  onClick={handleFill}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                >
                  Fill Canvas
                </button>
              </div>
            )}

            <div className="w-full relative bg-white rounded-xl overflow-hidden">
              <canvas
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                ref={canvasRef}
                className="border border-gray-200 rounded-lg shadow-sm"
                style={{ cursor: mode === 'drawer' ? 'crosshair' : 'default' }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chat Box */}
            <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-2 border-white border-opacity-20">
              <h3 className="text-xl font-bold text-purple-700 mb-4">Guesses</h3>
              <div className="h-64 overflow-y-auto mb-4 border border-purple-100 rounded-lg p-4 space-y-3 bg-white bg-opacity-80">
                {messages.map((msg, index) => (
                  <div key={index} className={`text-sm ${msg.type === 'correct' ? 'bg-green-100 p-2 rounded-lg' : ''}`}>
                    {msg.type === 'myGuess' && (
                      <div>
                        <span className="font-semibold text-purple-700">Your guess: </span>
                        <span>{msg.text}</span>
                      </div>
                    )}
                    {msg.type === 'guess' && (
                      <div>
                        <span className="font-semibold text-blue-600">{msg.username}: </span>
                        <span>{msg.text}</span>
                      </div>
                    )}
                    {msg.type === 'correct' && (
                      <div className="text-green-700 font-medium">
                        <span className="font-bold">{msg.username}</span> guessed the word correctly!
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={guess}
                  onChange={handleGuessChange}
                  onKeyPress={(e) => e.key === 'Enter' && submitGuess()}
                  placeholder={mode === 'guesser' ? "Enter your guess" : "Chat here..."}
                  className="flex-1 px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <button
                  onClick={submitGuess}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                >
                  {mode === 'guesser' ? "Guess" : "Send"}
                </button>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-2 border-white border-opacity-20">
              <h3 className="text-xl font-bold text-purple-700 mb-4">Leaderboard</h3>
              <div className="space-y-3">
                {leaderboard.sort((a, b) => b.score - a.score).map((player, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      index === 0 ? 'bg-yellow-100 border border-yellow-200' : 
                      index === 1 ? 'bg-gray-100 border border-gray-200' : 
                      index === 2 ? 'bg-amber-50 border border-amber-200' : 
                      'hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="font-medium w-6 text-center mr-2">
                        {index + 1}.
                      </span>
                      <span className="text-sm font-medium">{player.username}</span>
                    </div>
                    <span className="font-bold bg-purple-100 px-3 py-1 rounded-full text-purple-800">
                      {player.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;