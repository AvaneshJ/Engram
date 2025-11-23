const API =
  import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || "http://localhost:5000";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getDiaryEntries = async () => {
  const res = await fetch(`${API}/api/diary/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  if (!res.ok) throw new Error("Failed to fetch diary entries");
  return res.json();
};

export const createDiaryEntry = async ({ title, content }) => {
  const res = await fetch(`${API}/api/diary/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) {
    let errorMessage = "Failed to create diary entry";
    try {
      const err = await res.json();
      errorMessage = err.error || errorMessage;
    } catch (e) {}
    throw new Error(errorMessage);
  }
  return res.json();
};

export const deleteDiaryEntry = async (id) => {
  const res = await fetch(`${API}/api/diary/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    let errorMessage = "Failed to delete entry";
    try {
      const err = await res.json();
      errorMessage = err.error || errorMessage;
    } catch (e) {}
    throw new Error(errorMessage);
  }

  return res.json();
};
