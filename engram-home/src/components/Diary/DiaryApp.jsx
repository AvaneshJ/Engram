import React, { useState, useEffect } from "react";
import { getDiaryEntries, createDiaryEntry } from "../../api/index";
import DiaryForm from "./DiaryForm";
import DiarySidebar from "./DiarySidebar";
import "./DiaryApp.css";

const DiaryApp = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  // Time format
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Load entries on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await getDiaryEntries();
        setEntries(res.data);
      } catch (err) {
        console.error("Failed to load diary entries", err);
      }
    })();
  }, []);

  // Save new entry
  const handleSaveEntry = async ({ title, content }) => {
    try {
      const res = await createDiaryEntry({ title, content });
      setEntries([res.data.diaryEntry, ...entries]);
      setSelectedEntry(null);
    } catch (err) {
      console.error("Failed to create entry", err);
    }
  };

  const handleSelectEntry = (entry) => setSelectedEntry(entry);

  return (
    <div className="diary-app-container">
      <div className="diary-sidebar">
        <DiarySidebar entries={entries} onSelectEntry={handleSelectEntry} />
      </div>
      <div className="diary-main-content">
        <DiaryForm onSave={handleSaveEntry} selectedEntry={selectedEntry} />
      </div>
    </div>
  );
};

export default DiaryApp;
