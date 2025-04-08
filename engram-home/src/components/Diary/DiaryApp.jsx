import React, { useState, useEffect } from 'react';
import DiaryForm from './DiaryForm';
import DiarySidebar from './DiarySidebar';
import './DiaryApp.css';

const DiaryApp = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    // Load entries from localStorage on component mount
    const savedEntries = localStorage.getItem('diaryEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const handleSaveEntry = (entry) => {
    const now = new Date();
    const newEntry = {
      ...entry,
      id: Date.now(),
      date: now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
    setSelectedEntry(null);
  };

  const handleSelectEntry = (entry) => {
    setSelectedEntry(entry);
  };

  return (
    <div className="diary-app-container">
      <div className="diary-sidebar">
        <DiarySidebar
          entries={entries}
          onSelectEntry={handleSelectEntry}
        />
      </div>
      <div className="diary-main-content">
        <DiaryForm
          onSave={handleSaveEntry}
          selectedEntry={selectedEntry}
        />
      </div>
    </div>
  );
};

export default DiaryApp; 