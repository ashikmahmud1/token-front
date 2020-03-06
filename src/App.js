import React from 'react';
import './App.css';
import WebSocket from "./components/WebSocket";

function App() {
    // connect to the websocket
    return (
        <div className="App">
            <WebSocket/>
        </div>
    );
}

export default App;
