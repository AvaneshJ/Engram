import React from 'react';

const JournalDisplay = ({ entry, onBack }) => {
  return (
    <div className="journal-display">
      <button className="back-button" onClick={onBack}>
        ← Back to Writing
      </button>
      <h1>{entry.title || 'Untitled'}</h1>
      <div className="date">{entry.date}</div>
      <div className="content">{entry.text}</div>
    </div>
  );
};

export default JournalDisplay; 