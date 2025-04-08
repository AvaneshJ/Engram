import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PixelCanvas from './components/main_page';
import ChatInterface from './components/ChatInterface/ChatInterface';
import DiaryApp from './components/Diary/DiaryApp';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PixelCanvas />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/diary" element={<DiaryApp />} />
      </Routes>
    </div>
  );
};

export default App;