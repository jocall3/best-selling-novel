```jsx
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { fabric } from 'fabric';
import './GenerationCanvasPage.css';

const GenerationCanvasPage = () => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [canvasState, setCanvasState] = useState([]); // Stores fabric objects

  useEffect(() => {
    const newSocket = io('http://localhost:3001'); // Adjust URL as needed
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to websocket server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from websocket server');
    });

    newSocket.on('canvasUpdate', (data) => {
      console.log('Received canvas update:', data);
      // Apply updates to the fabric canvas
      if (fabricCanvasRef.current) {
        // Clear existing objects and re-render from state if the state is fully reliable
        // For real-time, more granular updates might be better but this is simpler to start.
        fabricCanvasRef.current.clear();
        data.forEach(objData => {
          fabricCanvasRef.current.add(new fabric.util.enlivenObjects([objData])[0]);
        });
        fabricCanvasRef.current.renderAll();
      }
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#f0f0f0',
      });
      fabricCanvasRef.current = fabricCanvas;

      // Load initial state if available
      if (canvasState.length > 0) {
        fabricCanvas.loadFromJSON(canvasState, () => {
          fabricCanvas.renderAll();
        });
      }

      // Handle fabric canvas events and emit updates
      fabricCanvas.on('object:modified', (e) => {
        const updatedObjects = fabricCanvas.getObjects().map(obj => obj.toJSON());
        setCanvasState(updatedObjects);
        if (socket) {
          socket.emit('canvasChange', updatedObjects);
        }
      });

      fabricCanvas.on('object:added', (e) => {
        const updatedObjects = fabricCanvas.getObjects().map(obj => obj.toJSON());
        setCanvasState(updatedObjects);
        if (socket) {
          socket.emit('canvasChange', updatedObjects);
        }
      });

      fabricCanvas.on('object:removed', (e) => {
        const updatedObjects = fabricCanvas.getObjects().map(obj => obj.toJSON());
        setCanvasState(updatedObjects);
        if (socket) {
          socket.emit('canvasChange', updatedObjects);
        }
      });

      // Clean up fabric canvas on unmount
      return () => {
        fabricCanvas.dispose();
      };
    }
  }, [socket, canvasState]); // Re-run if socket or canvasState changes

  const addRectangle = () => {
    if (fabricCanvasRef.current) {
      const rect = new fabric.Rect({
        left: 50,
        top: 50,
        fill: 'red',
        width: 100,
        height: 100,
      });
      fabricCanvasRef.current.add(rect);
      const updatedObjects = fabricCanvasRef.current.getObjects().map(obj => obj.toJSON());
      setCanvasState(updatedObjects);
      if (socket) {
        socket.emit('canvasChange', updatedObjects);
      }
    }
  };

  const addCircle = () => {
    if (fabricCanvasRef.current) {
      const circle = new fabric.Circle({
        left: 200,
        top: 150,
        fill: 'blue',
        radius: 50,
      });
      fabricCanvasRef.current.add(circle);
      const updatedObjects = fabricCanvasRef.current.getObjects().map(obj => obj.toJSON());
      setCanvasState(updatedObjects);
      if (socket) {
        socket.emit('canvasChange', updatedObjects);
      }
    }
  };

  const addText = () => {
    if (fabricCanvasRef.current) {
      const text = new fabric.Text('Generated Content', {
        left: 300,
        top: 250,
        fill: 'green',
        fontSize: 20,
      });
      fabricCanvasRef.current.add(text);
      const updatedObjects = fabricCanvasRef.current.getObjects().map(obj => obj.toJSON());
      setCanvasState(updatedObjects);
      if (socket) {
        socket.emit('canvasChange', updatedObjects);
      }
    }
  };

  return (
    <div className="generation-canvas-container">
      <h1>Real-time Generation Canvas</h1>
      <div className="canvas-controls">
        <button onClick={addRectangle}>Add Rectangle</button>
        <button onClick={addCircle}>Add Circle</button>
        <button onClick={addText}>Add Text</button>
      </div>
      <canvas ref={canvasRef} />
      <div className="legend">
        <p>Watch agents generate content here in real-time.</p>
        <p>Interactions on this canvas will be reflected across all connected users.</p>
      </div>
    </div>
  );
};

export default GenerationCanvasPage;
```