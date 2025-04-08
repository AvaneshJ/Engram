import React, { useState } from 'react';

const DiaryForm = ({ addEntry }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    addEntry(title, content);
    setTitle('');
    setContent('');
  };

  return (
    <form className="diary-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter your title here..."
        className="diary-title-input"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your diary entry here..."
        className="diary-content-input"
        required
      />
      <button 
        type="submit"
        className="submit-button"
      >
        Submit Entry
      </button>
    </form>
  );
};

export default DiaryForm; 