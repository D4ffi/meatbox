// src/main.tsx - Alternativa con HashRouter
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { HashRouter } from "react-router-dom"; // Cambio aquí
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter> {/* Más seguro para Electron */}
            <App />
        </HashRouter>
    </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
})