// src/components/DiaryApp.js
import React, { useState, useEffect } from "react";
import { getDiaryEntries, createDiaryEntry } from "../../api/index";
import DiaryForm from "./DiaryForm";
import DiarySidebar from "./DiarySidebar";
import "./DiaryApp.css";

const DiaryApp = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getDiaryEntries();
        setEntries(data);
      } catch (err) {
        console.error("Failed to load diary entries", err);
        alert(
          "Could not load diary entries. Please make sure you’re logged in."
        );
      }
    })();
  }, []);

  const handleSaveEntry = async ({ title, content }) => {
    try {
      const data = await createDiaryEntry({ title, content });
      setEntries([data.diaryEntry, ...entries]);
      setSelectedEntry(null);
    } catch (err) {
      console.error("Failed to create entry", err);
      alert("Could not save diary entry. Please try again.");
    }
  };

  const handleSelectEntry = (entry) => {
    setSelectedEntry(entry);
  };

  // **NEW**: clear selection when user hits "Back"
  const handleBack = () => {
    setSelectedEntry(null);
  };

  return (
    <div className="diary-app-container">
      <div className="diary-sidebar">
        <DiarySidebar entries={entries} onSelectEntry={handleSelectEntry} />
      </div>
      <div className="diary-main-content">
        <DiaryForm
          onSave={handleSaveEntry}
          selectedEntry={selectedEntry}
          onBack={handleBack} // pass it down
        />
      </div>
    </div>
  );
};

export default DiaryApp;
