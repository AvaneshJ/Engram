import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// No userId needed in the client for now:
export const getDiaryEntries = () => API.get("/diary");
export const createDiaryEntry = ({ title, content }) =>
  API.post("/diary/create", { title, content });
