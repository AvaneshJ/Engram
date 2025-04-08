import React from 'react';

const DiarySidebar = ({ entries, onSelectEntry }) => {
  return (
    <div className="diary-entries-list">
      <h1>My Diary Entries</h1>
      {entries.length === 0 ? (
        <p style={{
          color: '#8e9aaf',
          fontSize: '16px',
          opacity: 0.8,
          letterSpacing: '0.05em'
        }}>No entries yet. Start writing!</p>
      ) : (
        entries.map(entry => (
          <div
            key={entry.id}
            className="journal-entry"
            onClick={() => onSelectEntry(entry)}
          >
            <h3 style={{
              color: '#f3f4f6',
              fontSize: '18px',
              marginBottom: '8px',
              fontWeight: '500'
            }}>{entry.title || 'Untitled'}</h3>
            <p style={{
              color: '#8e9aaf',
              fontSize: '14px',
              opacity: 0.8
            }}>{entry.date}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default DiarySidebar; 