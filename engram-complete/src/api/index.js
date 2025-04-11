// Mock API functions for diary operations
let diaryEntries = [];

export const getDiaryEntries = async () => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: diaryEntries };
};

export const createDiaryEntry = async ({ title, content }) => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date();
  const date = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  
  const newEntry = {
    id: Date.now(),
    title,
    content,
    date: `${date}-${month}-${year}`,
    createdAt: now.toISOString()
  };
  
  diaryEntries = [newEntry, ...diaryEntries];
  return { data: { diaryEntry: newEntry } };
};

export const updateDiaryEntry = async (id, { title, content }) => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const entryIndex = diaryEntries.findIndex(entry => entry.id === id);
  if (entryIndex === -1) {
    throw new Error('Entry not found');
  }
  
  const updatedEntry = {
    ...diaryEntries[entryIndex],
    title,
    content,
    updatedAt: new Date().toISOString()
  };
  
  diaryEntries[entryIndex] = updatedEntry;
  return { data: { diaryEntry: updatedEntry } };
};

export const deleteDiaryEntry = async (id) => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  diaryEntries = diaryEntries.filter(entry => entry.id !== id);
  return { data: { success: true } };
}; 