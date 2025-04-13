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
      const token = localStorage.getItem("token");

      // 1️⃣ Create the diary entry
      const data = await createDiaryEntry({ title, content });
      setEntries([data.diaryEntry, ...entries]);
      setSelectedEntry(null);

      // 2️⃣ Recompute Aura
      const auraRes = await fetch("http://localhost:5000/api/aura/update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const auraData = await auraRes.json();
      console.log("🧠 Updated aura/personality:", auraData.personality);

      // 🧠 Optionally store the personality somewhere (e.g. context)
      // setPersonality(auraData.personality); if you're using global state
    } catch (err) {
      console.error("Failed to create entry or update aura", err);
      alert("Something went wrong. Please try again.");
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
