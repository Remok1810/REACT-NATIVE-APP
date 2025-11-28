import React, { createContext, useState, useEffect } from "react";
import { getHistory, saveToHistory, clearHistory as clearStorageHistory } from "../storage/historyStorage";

// Create Context
export const WatchHistoryContext = createContext();

// Provider component
export const WatchHistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  // Load existing history from AsyncStorage on mount
  useEffect(() => {
    loadHistory(); // Auto load on mount
  }, []);

  // Load history function (used for initial load & manual refresh)
  const loadHistory = async () => {
    try {
      const saved = await getHistory();
      setHistory(saved.reverse()); // newest first
    } catch (error) {
      console.log("Error loading history:", error);
    }
  };

  // Add movie to history
  const addToHistory = async (movie) => {
    setHistory((prev) => {
      // Prevent duplicates
      if (prev.find((m) => m.id === movie.id)) return prev;

      const updated = [movie, ...prev];

      // Save to AsyncStorage
      saveToHistory(movie);

      // 🔹 Live update: reload from storage shortly after saving
      setTimeout(() => loadHistory(), 50);

      return updated;
    });
  };

  // Refresh history manually (pull-to-refresh)
  const refreshHistory = async () => {
    await loadHistory();
  };

  // Clear all history (used in ProfileScreen)
  const clearHistory = async () => {
    try {
      await clearStorageHistory(); // remove from AsyncStorage
      setHistory([]); // clear state immediately
    } catch (error) {
      console.log("Error clearing history:", error);
    }
  };

  return (
    <WatchHistoryContext.Provider
      value={{
        history,           // current watch history
        addToHistory,      // add a movie to history
        refreshHistory,    // pull-to-refresh
        clearHistory,      // clear all history
      }}
    >
      {children}
    </WatchHistoryContext.Provider>
  );
};
