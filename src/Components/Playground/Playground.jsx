import React, { useRef, useState, useEffect } from "react";
import { FaHandPointDown, FaPen } from "react-icons/fa";

export default function Playground() {
    const [prediction, setPrediction] = useState(false);
    const [predictedDigit, setPredictedDigit] = useState(null);

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
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        // Initialize background to pure black
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
    }, []);

    // Update the 28x28 state array from the high-res canvas
    const updatePixelArray = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
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
            // Grab the Red channel (or average them) since it's grayscale.
            // We pass the raw value [0, 255] because the backend's feedforward
            // function normalizes it by dividing by 255.0.
            tempArray[i] = data[i * 4];
        }

        setPixelArray(tempArray);
    };

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
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
        if (!canvas) return;
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
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
        setPixelArray(new Array(GRID_SIZE * GRID_SIZE).fill(0));
        setPrediction(false);
        setPredictedDigit(null);
    };

    const predictDigit = async (pixelArray) => {
        try {
            const response = await fetch('https://khushineuralnetwork-hdr-backend.onrender.com/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pixels: pixelArray })
            });

            if (!response.ok) {
                throw new Error(`Server returned error: ${response.statusText}`);
            }

            const data = await response.json();
            setPrediction(true);
            setPredictedDigit(data.digit);

        } catch (err) {
            console.error("Error fetching prediction from server:", err);
        }
    };

    return (
        <>
            <main className="h-[90vh] md:h-[85vh] w-full font-[Inter] flex items-center justify-center flex-col gap-2 bg-zinc-950 ">
                <h1 className="flex items-center justify-center gap-2 text-3xl text-white font-semibold cursor-pointer">Draw Digit in Canvas <FaPen /></h1>
                <FaHandPointDown className="text-3xl text-pink-600" />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', fontFamily: 'sans-serif' }}>
                    <canvas
                        ref={canvasRef}
                        width={DISPLAY_SIZE}
                        height={DISPLAY_SIZE}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={() => setIsDrawing(false)}
                        onMouseLeave={() => setIsDrawing(false)}
                        style={{ border: '5px double #DB2777', cursor: 'crosshair', borderRadius: '4px' }}
                    />
                    <div className="flex-col md:flex-row flex items-center justify-center gap-3">
                        <button onClick={clearCanvas} className="px-3 py-2 rounded-2xl bg-pink-600 text-xl font-[Inter] text-white cursor-pointer font-semibold duration-100">
                            Clear Canvas
                        </button>
                        <button onClick={() => predictDigit(pixelArray)} className="px-3 py-2 rounded-2xl bg-pink-600 text-xl font-[Inter] text-white cursor-pointer font-semibold duration-100">
                            Predict Digit
                        </button>
                    </div>
                </div>
                {
                    prediction ?
                    <h1 className="text-xl text-white font-[Inter]">Prediction: {predictedDigit} </h1>
                    : <p></p>
                }
            </main>
        </>
    );
}
