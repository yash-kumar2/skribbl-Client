import React, { useRef, useState, useEffect } from 'react';

const Whiteboard = ({ socket, mode, word, leaderboard }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  let strokeColor = '#000000';
  const [lineWidth, setLineWidth] = useState(5);
  const [fillColor, setFillColor] = useState('#ffffff');
  const [messages, setMessages] = useState([]);
  const [guess, setGuess] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const updateCanvasSize = () => {
      const width = container.clientWidth;
      const height = Math.min(window.innerHeight * 0.6, width * 0.75); // 4:3 aspect ratio
      
      canvas.width = width * 2;
      canvas.height = height * 2;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext('2d');
      context.scale(2, 2);
      context.lineCap = 'round';
      context.strokeStyle = strokeColor;
      context.lineWidth = lineWidth;
      contextRef.current = context;
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

    socket.on('draw', handleDraw);
    socket.on('mouseup', handleMouseUp);
    socket.on('fill', handleFill);

    return () => {
      socket.off('draw', handleDraw);
      socket.off('mouseup', handleMouseUp);
      socket.off('fill', handleFill);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [socket, strokeColor, lineWidth]);

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
    setMessages([...messages, { type: 'guess', text: guess }]);
    setGuess("");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drawing Area */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold capitalize">{mode} Mode</h2>
            {mode === 'guesser' && (
              <div className="text-lg">
                Word to guess: <span className="font-medium">{word}</span>
              </div>
            )}
          </div>

          {mode === 'drawer' && (
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Color:</label>
                <input
                  type="color"
                  onChange={handleColorChange}
                  className="w-16 h-8 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Width:</label>
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
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Fill Canvas
              </button>
            </div>
          )}

          <div className="w-full relative bg-white">
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
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Chat</h3>
            <div className="h-64 overflow-y-auto mb-4 border border-gray-100 rounded-lg p-4 space-y-2">
              {messages.map((msg, index) => (
                <div key={index} className="text-sm">
                  {msg.type === 'guess' && (
                    <span className="font-semibold">Guess: </span>
                  )}
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={guess}
                onChange={handleGuessChange}
                onKeyPress={(e) => e.key === 'Enter' && submitGuess()}
                placeholder={mode === 'guesser' ? "Enter your guess" : "Chat here..."}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={submitGuess}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                {mode === 'guesser' ? "Guess" : "Send"}
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
            <div className="space-y-2">
              {leaderboard?.map((player, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md"
                >
                  <span className="text-sm">{player.name}</span>
                  <span className="font-semibold">{player.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;