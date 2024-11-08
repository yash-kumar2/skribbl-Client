import React, { useRef, useState, useEffect } from 'react';

const Whiteboard = ({ socket }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
 // const [strokeColor, setStrokeColor] = useState('#000000');
 let strokeColor='#000000'
  const [lineWidth, setLineWidth] = useState(5);
  const [fillColor, setFillColor] = useState('#ffffff');

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = strokeColor;
    context.lineWidth = lineWidth;
    contextRef.current = context;

    const handleDraw = ({ x, y, color, width, beginNewPath }) => {
      if (beginNewPath) contextRef.current.beginPath();  // Start new path when specified
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = width;
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
      contextRef.current.moveTo(x, y);
    };

    const handleMouseUp = () => {
      contextRef.current.beginPath();  // Ensure path separation on mouse lift
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
    };
  }, [socket, strokeColor, lineWidth]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);

    // Emit start drawing with beginNewPath
    socket.emit('draw', { x: offsetX, y: offsetY, color: strokeColor, width: lineWidth, beginNewPath: true });
  };

  const finishDrawing = () => {
    setIsDrawing(false);
    contextRef.current.closePath();
    socket.emit('mouseup');  // Emit mouseup to separate paths for other clients
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    socket.emit('draw', {
      x: offsetX,
      y: offsetY,
      color: strokeColor,
      width: lineWidth,
      beginNewPath: false  // Continue path until mouse lift
    });
  };

  const handleColorChange = (e) => {
    //setStrokeColor(e.target.value);
    strokeColor=e.target.value
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
    socket.emit('fill', fillColor);  // Emit fill color to sync with other clients
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Stroke Color:
          <input type="color" value={strokeColor} onChange={handleColorChange} />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Line Width:
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={handleLineWidthChange}
          />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Fill Color:
          <input
            type="color"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
          />
        </label>
        <button style={{ marginLeft: '10px' }} onClick={handleFill}>
          Fill Canvas
        </button>
      </div>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
        style={{ border: '1px solid black', cursor: 'crosshair' }}
      />
    </div>
  );
};

export default Whiteboard;
