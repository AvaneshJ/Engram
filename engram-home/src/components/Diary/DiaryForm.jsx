import React, { useState, useEffect } from 'react';

const DiaryForm = ({ onSave, selectedEntry }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isViewing, setIsViewing] = useState(false);

  useEffect(() => {
    if (selectedEntry) {
      setTitle(selectedEntry.title || '');
      setContent(selectedEntry.content || '');
      setIsViewing(true);
    }
  }, [selectedEntry]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSave({ title, content });
    setTitle('');
    setContent('');
  };

  const handleBack = () => {
    setTitle('');
    setContent('');
    setIsViewing(false);
  };

  if (isViewing && selectedEntry) {
    return (
      <div className="journal-display" style={{ 
        padding: '2rem', 
        fontFamily: "'Times New Roman', Times, serif",
        border: '1px solid rgba(158, 158, 158, 0.3)',
        borderRadius: '12px',
        backgroundColor: 'rgba(22, 27, 34, 0.7)'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={handleBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#3b82f6',
              fontSize: '1.02rem',
              fontWeight: 520,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              fontFamily: "'Times New Roman', Times, serif"
            }}
          >
            <span style={{ marginRight: '0.5rem' }}>←</span>
            Back
          </button>
        </div>
        <h1 style={{
          fontSize: '2.55rem',
          color: '#fff',
          marginBottom: '0.5rem',
          fontWeight: 520,
          fontFamily: "'Times New Roman', Times, serif"
        }}>{selectedEntry.title || 'Untitled'}</h1>
        <div style={{
          color: '#8e9aaf',
          fontSize: '0.92rem',
          marginBottom: '2rem',
          fontWeight: 520,
          fontFamily: "'Times New Roman', Times, serif"
        }}>
          {selectedEntry.date}
          {selectedEntry.time && `, ${selectedEntry.time}`}
        </div>
        <div style={{
          color: '#fff',
          fontSize: '1.02rem',
          lineHeight: '1.6',
          fontWeight: 520,
          fontFamily: "'Times New Roman', Times, serif"
        }}>{selectedEntry.content}</div>
      </div>
    );
  }

  return (
    <form className="diary-form" onSubmit={handleSubmit} style={{ 
      fontFamily: "'Times New Roman', Times, serif",
      padding: '2rem',
      border: '1px solid rgba(158, 158, 158, 0.3)',
      borderRadius: '12px',
      backgroundColor: 'rgba(22, 27, 34, 0.7)'
    }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter your title here..."
        className="diary-title-input"
        style={{ 
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: '1.02rem',
          fontWeight: 520,
          backgroundColor: '#161b22',
          color: '#fff',
          border: '1px solid rgba(158, 158, 158, 0.2)',
          borderRadius: '8px',
          padding: '12px 15px',
          width: '100%',
          marginBottom: '1rem'
        }}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your diary entry here..."
        className="diary-content-input"
        required
        style={{ 
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: '1.02rem',
          fontWeight: 520,
          backgroundColor: '#161b22',
          color: '#fff',
          backgroundImage: `
            repeating-linear-gradient(
              transparent,
              transparent 31px,
              rgba(255, 255, 255, 0.1) 31px,
              rgba(255, 255, 255, 0.1) 32px
            )
          `,
          backgroundAttachment: 'local',
          lineHeight: '32px',
          padding: '8px 15px',
          border: '1px solid rgba(158, 158, 158, 0.2)',
          borderRadius: '8px',
          width: '100%',
          minHeight: '400px',
          resize: 'vertical'
        }}
      />
      <button 
        type="submit"
        className="submit-button"
        style={{ 
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: '1.02rem',
          fontWeight: 520,
          marginTop: '1rem',
          padding: '10px 24px',
          backgroundColor: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          float: 'right'
        }}
      >
        Submit Entry
      </button>
    </form>
  );
};

export default DiaryForm; 