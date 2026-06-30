import react, { useRef, useState, useEffect } from "react";
import { FaHandPointDown, FaPen  } from "react-icons/fa";


function DigitCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixelArray, setPixelArray] = useState(new Array(28 * 28).fill(0));
  const lastPos = useRef({ x: 0, y: 0 });

  // Grid Dimensions
  const GRID_SIZE = 28;
  const DISPLAY_SIZE = 280; // Size on the screen (pixels)
  const SCALE = DISPLAY_SIZE / GRID_SIZE; // 10x upscaling for rendering

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Initialize background to pure black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
  }, []);

  // Update the 28x28 state array from the high-res canvas
  const updatePixelArray = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Create a tiny offscreen 28x28 canvas to let the browser handle downscaling
    const offscreen = document.createElement('canvas');
    offscreen.width = GRID_SIZE;
    offscreen.height = GRID_SIZE;
    const oCtx = offscreen.getContext('2d');
    
    // Draw our smooth visual canvas onto the 28x28 canvas
    oCtx.drawImage(canvas, 0, 0, DISPLAY_SIZE, DISPLAY_SIZE, 0, 0, GRID_SIZE, GRID_SIZE);
    
    // Get raw pixel information
    const imgData = oCtx.getImageData(0, 0, GRID_SIZE, GRID_SIZE);
    const data = imgData.data; // RGBA array
    
    const tempArray = new Array(GRID_SIZE * GRID_SIZE);
    for (let i = 0; i < tempArray.length; i++) {
      // Grab the Red channel (or average them) since it's grayscale
      // Normalize value between 0.0 (black) and 1.0 (white) or 0-255
      tempArray[i] = data[i * 4] / 255; 
    }
    
    setPixelArray(tempArray);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    const pos = getCoordinates(e);
    lastPos.current = pos;
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const currentPos = getCoordinates(e);

    // Calculate distance between events to prevent gaps
    const dist = Math.hypot(currentPos.x - lastPos.current.x, currentPos.y - lastPos.current.y);
    const steps = Math.ceil(dist / 2);

    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 1 : i / steps;
      const x = lastPos.current.x + (currentPos.x - lastPos.current.x) * t;
      const y = lastPos.current.y + (currentPos.y - lastPos.current.y) * t;

      // --- Soft-Bleed Brush Logic ---
      const brushRadius = 18; // Tweak for visual thickness
      const gradient = ctx.createRadialGradient(x, y, brushRadius * 0.2, x, y, brushRadius);
      
      // Paint is white on black background (standard ML format)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');  // Core solid opaque
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)'); // Bleeding mid-tone
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');   // Smoothly transparent edge

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPos.current = currentPos;
    updatePixelArray();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
    setPixelArray(new Array(GRID_SIZE * GRID_SIZE).fill(0));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', fontFamily: 'sans-serif' }}>
      <canvas
        ref={canvasRef}
        width={DISPLAY_SIZE}
        height={DISPLAY_SIZE}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
        style={{ border: '2px solid #555', cursor: 'crosshair', borderRadius: '4px' }}
      />
      
      <button onClick={clearCanvas} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Clear Canvas
      </button>

      <div>
        <h4>Array Status (First 28 values representing row 1):</h4>
        <div style={{ maxWidth: '400px', wordBreak: 'break-all', fontSize: '12px', background: '#f0f0f0', padding: '10px' }}>
          {JSON.stringify(pixelArray.slice(0, 28).map(v => v.toFixed(2)))}...
        </div>
      </div>
    </div>
  );
}

export default function Playground () {
    return(
        <>
        <main className="h-[90vh] md:h-[85vh] w-full font-[Inter] flex items-center justify-center flex-col bg-pink-50">

        
        <h1 className="flex items-center justify-center gap-2 text-3xl">Draw Digit in Canvas <FaPen /></h1>
        <FaHandPointDown className="text-3xl" />
        <DigitCanvas />
        </main>
        </>
    );
}