import React, { useEffect, useState } from "react";
import { StatusBar, Alert, View, ActivityIndicator, TextInput, Button } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/AppNavigator";
import { WatchHistoryProvider } from "./src/context/WatchHistoryContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [appPasswordEnabled, setAppPasswordEnabled] = useState(false);
  const [appPassword, setAppPassword] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  useEffect(() => {
    const checkPassword = async () => {
      try {
        const enabled = await AsyncStorage.getItem("appPasswordEnabled");
        const savedPass = await AsyncStorage.getItem("appPassword");
        if (enabled === "true" && savedPass) {
          setAppPasswordEnabled(true);
          setAppPassword(savedPass);
          setShowPasswordPrompt(true);
        }
      } catch (error) {
        console.log("Error checking app password:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkPassword();
  }, []);

  const verifyPassword = () => {
    if (enteredPassword === appPassword) {
      setShowPasswordPrompt(false);
      setEnteredPassword("");
    } else {
      Alert.alert("Incorrect Password", "Please try again.");
      setEnteredPassword("");
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (showPasswordPrompt) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000", padding: 20 }}>
        <TextInput
          placeholder="Enter App Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={enteredPassword}
          onChangeText={setEnteredPassword}
          style={{
            width: "100%",
            borderWidth: 1,
            borderColor: "#555",
            borderRadius: 8,
            padding: 10,
            color: "#fff",
            marginBottom: 20,
          }}
        />
        <Button title="Unlock" onPress={verifyPassword} />
      </View>
    );
  }

  return (
    <WatchHistoryProvider>
      <SafeAreaProvider>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <AppNavigator />
      </SafeAreaProvider>
    </WatchHistoryProvider>
  );
}
