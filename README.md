# KNN-HDR Frontend: Khushi Neural Network - Handwritten Digit Recognizer

This is the interactive frontend for the **KNN-HDR (Khushi Neural Network - Handwritten Digit Recognizer)** application. It is built using React, Vite, Tailwind CSS, and Motion.

It provides a digital canvas for drawing handwritten digits, automatically preprocesses and downscales the drawings, and queries the custom neural network backend to display predictions in real time.

---

## ✨ Features

*   **Interactive Drawing Canvas:** A $280 \times 280$ visual canvas designed for natural mouse or touch drawing.
*   **Soft-Bleed Brush Logic:** Uses radial gradients to simulate a soft brush stroke, avoiding harsh outlines and producing smooth grayscale gradients similar to the MNIST dataset.
*   **Offscreen Downscaling:** Uses a secondary $28 \times 28$ canvas to let the browser automatically downscale the high-resolution drawing. The $784$ pixel values (representing grayscale intensities $[0, 255]$) are then extracted to feed the neural network.
*   **Playful Expandable Header:** Hovering over the header elements dynamically expands **"KNN"** to **"Khushi Neural Network"** and **"HDR"** to **"Handwritten Digit Recognizer"** with smooth spring animations.
*   **Seamless Prediction Retrieval:** Real-time API integration communicating predictions and canvas state resets.

---

## 📂 Project Structure

```
frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/               # Assets folder
│   ├── Components/
│   │   ├── Header/
│   │   │   └── Header.jsx     # Header with expandable text and animations
│   │   └── Playground/
│   │       └── Playground.jsx # Drawing canvas & prediction logic
│   ├── App.jsx               # Application entry component
│   ├── index.css             # Tailwind CSS custom styles
│   └── main.jsx              # React application mounting point
├── eslint.config.js          # ESLint configuration
├── index.html                # Application entry HTML file
├── package.json              # NPM dependencies & scripts
└── vite.config.js            # Vite configuration
```
---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (LTS version recommended).

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the package dependencies:
   ```bash
   npm install
   ```

### Running Locally

To launch the Vite development server:

```bash
npm run dev
```

The app will typically run on `http://localhost:5173`. Open this URL in your web browser.

### Building for Production

To compile and optimize your project for production:

```bash
npm run build
```

This generates production assets in the `dist` directory.
