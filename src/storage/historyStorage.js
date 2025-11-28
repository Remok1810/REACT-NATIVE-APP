import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "WATCH_HISTORY";

export async function saveToHistory(item) {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    const history = existing ? JSON.parse(existing) : [];

    const updated = [item, ...history]; // Newest first
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.log("Error saving history:", error);
  }
}

export async function getHistory() {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.log("Error loading history:", error);
    return [];
  }
}

export async function clearHistory() {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.log("Error clearing history:", error);
  }
}
