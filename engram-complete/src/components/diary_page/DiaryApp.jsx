import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDiaryEntries,
  createDiaryEntry,
  deleteDiaryEntry,
} from "../../api/index";
import {
  Moon,
  Sun,
  ArrowLeft,
  Menu,
  X,
  MessageCircle,
  Trash2,
} from "lucide-react";
import "./DiaryApp.css";

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

const MobileSidebarToggle = ({ isSidebarVisible, toggleSidebar }) => {
  return (
    <button
      onClick={toggleSidebar}
      className="mobile-sidebar-toggle"
      aria-label={isSidebarVisible ? "Hide entries" : "Show entries"}
    >
      {isSidebarVisible ? <X size={18} /> : <Menu size={18} />}
    </button>
  );
};

const DiaryForm = ({ onSave, onDelete, selectedEntry, onBack, isDarkMode }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isViewing, setIsViewing] = useState(false);

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    if (selectedEntry) {
      setTitle(selectedEntry.title || "");
      setContent(selectedEntry.content || "");
      setIsViewing(true);
    } else {
      setIsViewing(false);
      setTitle("");
      setContent("");
    }
  }, [selectedEntry]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSave({ title, content });
    setTitle("");
    setContent("");
  };

  // --- DELETE CLICK HANDLER (No Popup) ---
  const handleDelete = () => {
    // Removed window.confirm check to delete directly
    const idToDelete = selectedEntry._id || selectedEntry.id;
    onDelete(idToDelete);
  };

  if (isViewing && selectedEntry) {
    return (
      <div
        className={`journal-display ${isDarkMode ? "dark-mode" : "light-mode"}`}
      >
        {/* Header for Display Mode */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <button onClick={onBack} className="back-button">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {/* TRASH BIN BUTTON */}
          <button
            onClick={handleDelete}
            className="delete-button"
            style={{
              background: "transparent",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>

        <h1 className="entry-title">{selectedEntry.title || "Untitled"}</h1>

        <div className="entry-date">
          {formatDateTime(selectedEntry.createdAt)}
        </div>

        <div className="entry-content">{selectedEntry.content}</div>
      </div>
    );
  }

  return (
    <form
      className={`diary-form ${isDarkMode ? "dark-mode" : "light-mode"}`}
      onSubmit={handleSubmit}
    >
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

      <button type="submit" className="submit-button">
        Submit Entry
      </button>
    </form>
  );
};

const DiarySidebar = ({ entries, onSelectEntry, onDelete, isDarkMode }) => {
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div
      className={`diary-entries-list ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <h1 className="entries-title">My Diary Entries</h1>

      {entries.length === 0 ? (
        <p className="no-entries-message">No entries yet. Start writing!</p>
      ) : (
        entries.map((entry) => (
          <div
            key={entry._id || entry.id}
            className="journal-entry"
            onClick={() => onSelectEntry(entry)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="entry-info" style={{ overflow: "hidden", flex: 1 }}>
              <h3 className="entry-item-title">{entry.title || "Untitled"}</h3>
              <p className="entry-item-date">
                {formatDateTime(entry.createdAt)}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation(); // Stop the click from opening the entry
                onDelete(entry._id || entry.id);
              }}
              className="sidebar-delete-btn"
              style={{
                background: "transparent",
                border: "none",
                color: "#ef4444",
                cursor: "pointer",
                padding: "8px",
                marginLeft: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.7,
                transition: "opacity 0.2s",
              }}
              title="Delete"
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

const DiaryApp = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobileView = () => {
      const isMobile = window.innerWidth <= 768;
      setIsMobileView(isMobile);
      if (!isMobile) {
        setIsSidebarVisible(false);
      }
    };

    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("diary-theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    } else {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    }

    (async () => {
      try {
        const data = await getDiaryEntries();
        if (Array.isArray(data)) setEntries(data);
      } catch (err) {
        console.error("Failed to load diary entries", err);
      }
    })();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      localStorage.setItem("diary-theme", "light");
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    } else {
      localStorage.setItem("diary-theme", "dark");
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleSaveEntry = async ({ title, content }) => {
    try {
      const data = await createDiaryEntry({ title, content });
      setEntries([data.diaryEntry, ...entries]);
      setSelectedEntry(null);
      if (isMobileView) {
        setIsSidebarVisible(false);
      }
    } catch (err) {
      console.error("Failed to create entry", err);
      alert("Something went wrong. Please try again.");
    }
  };

  // --- DELETE HANDLER FUNCTION ---
  const handleDeleteEntry = async (id) => {
    try {
      console.log("Deleting entry:", id);
      await deleteDiaryEntry(id);

      // Update state: Remove deleted entry from list
      setEntries(entries.filter((entry) => (entry._id || entry.id) !== id));

      // If we deleted the currently viewed entry, go back to main screen
      if (selectedEntry && (selectedEntry._id || selectedEntry.id) === id) {
        setSelectedEntry(null);
      }
    } catch (err) {
      console.error("Failed to delete entry", err);
      alert("Failed to delete entry. Please try again.");
    }
  };

  return (
    <div
      className={`diary-app-container ${
        isDarkMode ? "dark-mode" : "light-mode"
      } ${isMobileView ? "mobile-view" : ""}`}
    >
      {/* Header Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-4 z-50">
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>

      <button
        className="page-back-button"
        onClick={() => (window.location.href = "/new_page")}
        title="Go back"
        aria-label="Go back"
      >
        <ArrowLeft size={18} />
      </button>

      {isMobileView && (
        <MobileSidebarToggle
          isSidebarVisible={isSidebarVisible}
          toggleSidebar={toggleSidebar}
        />
      )}

      {isMobileView ? (
        <>
          <div
            className={`diary-sidebar ${
              isSidebarVisible ? "visible" : "hidden"
            }`}
          >
            <DiarySidebar
              entries={entries}
              onSelectEntry={(e) => {
                setSelectedEntry(e);
                setIsSidebarVisible(false);
              }}
              onDelete={handleDeleteEntry}
              isDarkMode={isDarkMode}
            />
          </div>

          <div
            className={`diary-main-content ${
              !isSidebarVisible ? "visible" : "hidden"
            }`}
          >
            <DiaryForm
              onSave={handleSaveEntry}
              onDelete={handleDeleteEntry}
              selectedEntry={selectedEntry}
              onBack={() => setSelectedEntry(null)}
              isDarkMode={isDarkMode}
            />
          </div>
        </>
      ) : (
        <>
          <div className="diary-sidebar">
            <DiarySidebar
              entries={entries}
              onSelectEntry={setSelectedEntry}
              onDelete={handleDeleteEntry}
              isDarkMode={isDarkMode}
            />
          </div>

          <div className="diary-main-content">
            <DiaryForm
              onSave={handleSaveEntry}
              onDelete={handleDeleteEntry}
              selectedEntry={selectedEntry}
              onBack={() => setSelectedEntry(null)}
              isDarkMode={isDarkMode}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DiaryApp;
