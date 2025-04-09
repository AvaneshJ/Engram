import React from "react";

const DiarySidebar = ({ entries, onSelectEntry }) => {
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
  return (
    <div
      className="diary-entries-list"
      style={{
        padding: "1.5rem",
        fontFamily: "'Times New Roman', Times, serif",
        textAlign: "left",
      }}
    >
      <h1
        style={{
          fontSize: "1.785rem",
          color: "#fff",
          marginBottom: "2rem",
          fontWeight: 520,
          fontFamily: "'Times New Roman', Times, serif",
          textAlign: "left",
        }}
      >
        My Diary Entries
      </h1>
      {entries.length === 0 ? (
        <p
          style={{
            color: "#8e9aaf",
            fontSize: "1.02rem",
            opacity: 0.8,
            letterSpacing: "0.05em",
            fontWeight: 520,
            fontFamily: "'Times New Roman', Times, serif",
            textAlign: "left",
          }}
        >
          No entries yet. Start writing!
        </p>
      ) : (
        entries.map((entry) => (
          <div
            key={entry.id}
            className="journal-entry"
            onClick={() => onSelectEntry(entry)}
            style={{
              padding: "1rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              cursor: "pointer",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
              fontFamily: "'Times New Roman', Times, serif",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <h3
              style={{
                color: "#fff",
                fontSize: "1.122rem",
                marginBottom: "0.5rem",
                fontWeight: 520,
                fontFamily: "'Times New Roman', Times, serif",
                textAlign: "left",
                width: "100%",
              }}
            >
              {entry.title || "Untitled"}
            </h3>
            <p
              style={{
                color: "#8e9aaf",
                fontSize: "0.867rem",
                margin: 0,
                fontWeight: 520,
                fontFamily: "'Times New Roman', Times, serif",
                textAlign: "left",
                width: "100%",
              }}
            >
              {formatDate(entry.date)}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default DiarySidebar;
