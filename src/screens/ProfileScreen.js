import React, { useState, useContext, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Modal,
  Pressable,
  Share,
  Switch
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WatchHistoryContext } from "../context/WatchHistoryContext";

export default function ProfileScreen() {
  const { clearHistory, refreshHistory } = useContext(WatchHistoryContext);

  // Profile States
  const [avatar, setAvatar] = useState("https://via.placeholder.com/100");
  const [name, setName] = useState(""); 
  const [bio, setBio] = useState("This is my bio");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [helpText, setHelpText] = useState("");
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  // Theme & Notifications
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // App Lock States
  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [appLockPassword, setAppLockPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const theme = {
    dark: {
      background: "#000",
      textPrimary: "#fff",
      textSecondary: "#aaa",
      iconColor: "#fff",
      modalBackground: "#1A1A1A",
      inputBackground: "#222",
      borderColor: "#555"
    },
    light: {
      background: "#fff",
      textPrimary: "#000",
      textSecondary: "#555",
      iconColor: "#000",
      modalBackground: "#f2f2f2",
      inputBackground: "#fff",
      borderColor: "#ccc"
    }
  };
  const colors = isDarkTheme ? theme.dark : theme.light;

  // Load app lock from storage on mount
  useEffect(() => {
    const loadAppLock = async () => {
      try {
        const enabled = await AsyncStorage.getItem("appPasswordEnabled");
        const savedPass = await AsyncStorage.getItem("appPassword");
        setAppLockEnabled(enabled === "true");
        if (savedPass) setAppLockPassword(savedPass);
      } catch (error) {
        console.log("Error loading app lock:", error);
      }
    };
    loadAppLock();
  }, []);

  // Profile functions
  const changeAvatar = () => {
    const options = { mediaType: "photo", maxWidth: 500, maxHeight: 500, quality: 0.8 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert("Error", response.errorMessage || "Something went wrong");
      } else {
        const uri = response.assets[0].uri;
        setAvatar(uri);
      }
    });
  };

  const deleteWatchHistory = () => {
    Alert.alert(
      "Delete All Watch History?",
      "Are you sure you want to clear your entire watch history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await clearHistory();
            await refreshHistory();
            Alert.alert("History Deleted", "Your watch history is now cleared.");
          },
        },
      ]
    );
  };

  const submitHelp = () => {
    if (!helpText.trim()) {
      Alert.alert("Error", "Please type your query before submitting.");
      return;
    }
    Alert.alert("Query Submitted", "Your query has been sent successfully!");
    setHelpText("");
    setHelpModalVisible(false);
  };

  const inviteFriend = async () => {
    try {
      await Share.share({
        message: "Hey! Check out this awesome app: https://yourappwebsite.com",
        title: "Invite a Friend",
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const changePassword = () => {
    Alert.alert("Change Password", "Password change functionality goes here.");
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    Alert.alert("Theme Changed", `Theme changed to ${!isDarkTheme ? "Dark" : "Light"} mode.`);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    Alert.alert("Notifications", `Notifications ${!notificationsEnabled ? "Enabled" : "Disabled"}`);
  };

  // App Lock toggle
  const toggleAppLock = async () => {
    if (appLockEnabled) {
      await AsyncStorage.setItem("appPasswordEnabled", "false");
      setAppLockEnabled(false);
      Alert.alert("App Lock Disabled", "App lock has been disabled.");
    } else {
      if (!newPassword.trim()) {
        Alert.alert("Error", "Please enter a password to enable app lock.");
        return;
      }
      await AsyncStorage.setItem("appPassword", newPassword);
      await AsyncStorage.setItem("appPasswordEnabled", "true");
      setAppLockPassword(newPassword);
      setAppLockEnabled(true);
      setNewPassword("");
      Alert.alert("App Lock Enabled", "App lock is now enabled.");
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={changeAvatar}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.editIcon}>
            <Ionicons name="camera-outline" size={20} color={colors.iconColor} />
          </View>
        </TouchableOpacity>

        <View style={styles.nameContainer}>
          <TouchableOpacity onPress={() => setIsEditingName(true)}>
            {isEditingName ? (
              <TextInput
                style={[styles.nameTextInput, { color: colors.textPrimary }]}
                value={name}
                onChangeText={setName}
                onBlur={() => setIsEditingName(false)}
                autoFocus
                placeholder="Name"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={[styles.nameText, { color: colors.textPrimary }]}>
                {name || "Name"} <Ionicons name="create-outline" size={16} color={colors.iconColor} />
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bioContainer}>
          <TouchableOpacity onPress={() => setIsEditingBio(true)}>
            {isEditingBio ? (
              <TextInput
                style={[styles.bioTextInput, { color: colors.textPrimary, backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.borderColor, padding: 5, borderRadius: 8 }]}
                value={bio}
                onChangeText={setBio}
                onBlur={() => setIsEditingBio(false)}
                multiline
                placeholder="Enter bio"
                placeholderTextColor={colors.textSecondary}
                autoFocus
              />
            ) : (
              <Text style={[styles.bioText, { color: colors.textSecondary }]}>{bio}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Options */}
      <View style={styles.optionsContainer}>
        {[
          { icon: "lock-closed-outline", text: "Privacy", action: () => setPrivacyModalVisible(true) },
          { icon: "trash-bin-outline", text: "Delete Watch History", action: deleteWatchHistory },
          { icon: "help-circle-outline", text: "Help & Support", action: () => setHelpModalVisible(true) },
          { icon: "settings-outline", text: "Settings", action: () => setSettingsModalVisible(true) },
          { icon: "person-add-outline", text: "Invite a Friend", action: inviteFriend },
          { icon: "log-out-outline", text: "Logout" },
        ].map((item, index) => (
          <TouchableOpacity 
            style={styles.option} 
            key={index}
            onPress={item.action ? item.action : () => {}}
          >
            <Ionicons 
              name={item.icon} 
              size={22} 
              color={item.text.includes("Delete") ? "#ff4444" : colors.iconColor} 
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.optionText, { color: item.text.includes("Delete") ? "#ff4444" : colors.textPrimary }]}>
                {item.text}
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward-outline" 
              size={22} 
              color={item.text.includes("Delete") ? "#ff4444" : colors.textSecondary} 
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Privacy Modal */}
      <Modal animationType="slide" transparent={true} visible={privacyModalVisible} onRequestClose={() => setPrivacyModalVisible(false)}>
        <View style={[styles.modalBackground, { backgroundColor: "rgba(0,0,0,0.7)" }]}>
          <View style={[styles.modalContainer, { backgroundColor: colors.modalBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Privacy Details</Text>
            <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Name:</Text><Text style={[styles.detailValue, { color: colors.textPrimary }]}>Kaleeshwaran</Text></View>
            <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Email:</Text><Text style={[styles.detailValue, { color: colors.textPrimary }]}>kaleeshk441@gmail.com</Text></View>
            <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Phone:</Text><Text style={[styles.detailValue, { color: colors.textPrimary }]}>8072577491</Text></View>
            <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.textSecondary }]}>DOB:</Text><Text style={[styles.detailValue, { color: colors.textPrimary }]}>18/10/2003</Text></View>
            <Pressable style={styles.closeButton} onPress={() => setPrivacyModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Help Modal */}
      <Modal animationType="slide" transparent={true} visible={helpModalVisible} onRequestClose={() => setHelpModalVisible(false)}>
        <View style={[styles.modalBackground, { backgroundColor: "rgba(0,0,0,0.7)" }]}>
          <View style={[styles.modalContainer, { backgroundColor: colors.modalBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Help & Support</Text>
            <TextInput
              style={[styles.bioTextInput, { width: "100%", minHeight: 100, borderWidth: 1, borderColor: colors.borderColor, borderRadius: 10, padding: 10, marginTop: 10, color: colors.textPrimary, backgroundColor: colors.inputBackground }]}
              value={helpText}
              onChangeText={setHelpText}
              multiline
              placeholder="Type your query here..."
              placeholderTextColor={colors.textSecondary}
            />
            <Pressable style={[styles.closeButton, { backgroundColor: "green", marginTop: 15 }]} onPress={submitHelp}>
              <Text style={styles.closeButtonText}>Submit</Text>
            </Pressable>
            <Pressable style={[styles.closeButton, { backgroundColor: "red", marginTop: 10 }]} onPress={() => setHelpModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal animationType="slide" transparent={true} visible={settingsModalVisible} onRequestClose={() => setSettingsModalVisible(false)}>
        <View style={[styles.modalBackground, { backgroundColor: "rgba(0,0,0,0.7)" }]}>
          <View style={[styles.modalContainer, { backgroundColor: colors.modalBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Settings</Text>
            <TouchableOpacity style={[styles.option, { paddingVertical: 10 }]} onPress={changePassword}>
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>Change Password</Text>
            </TouchableOpacity>

            {/* App Lock */}
            <View style={{ width: "100%", marginTop: 15 }}>
              {!appLockEnabled && (
                <TextInput
                  placeholder="Set App Password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                  style={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: colors.borderColor,
                    borderRadius: 8,
                    padding: 10,
                    color: colors.textPrimary,
                    marginBottom: 10,
                  }}
                />
              )}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: colors.textPrimary, fontSize: 16 }}>Enable App Lock</Text>
                <Switch value={appLockEnabled} onValueChange={toggleAppLock} />
              </View>
            </View>

            <View style={[styles.option, { justifyContent: "space-between", marginTop: 15 }]}>
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>Dark/Light Theme</Text>
              <Switch value={isDarkTheme} onValueChange={toggleTheme} />
            </View>
            <View style={[styles.option, { justifyContent: "space-between" }]}>
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>Notifications</Text>
              <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
            </View>
            <Pressable style={styles.closeButton} onPress={() => setSettingsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: "center", paddingVertical: 30 },
  avatar: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    borderWidth: 3, 
    borderColor: "#fff",
    marginBottom: 15
  },
  editIcon: { 
    position: "absolute", 
    bottom: 0, 
    right: 0, 
    backgroundColor: "#333", 
    padding: 6, 
    borderRadius: 20,
    zIndex: 10
  },
  nameContainer: { marginTop: 10, alignItems: "center" },
  nameText: { fontSize: 22, fontWeight: "bold" },
  nameTextInput: { fontSize: 22, fontWeight: "bold", textAlign: "center", padding: 0 },
  bioContainer: { marginTop: 5, alignItems: "center", paddingHorizontal: 20 },
  bioText: { fontSize: 14, textAlign: "center" },
  bioTextInput: { fontSize: 14, textAlign: "left", padding: 0 },
  optionsContainer: { marginTop: 30 },
  option: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 18, 
    paddingHorizontal: 20, 
    borderBottomColor: "#333", 
    borderBottomWidth: 1 
  },
  optionText: { fontSize: 16, marginLeft: 15 },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "85%", borderRadius: 15, padding: 20, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 10 },
  detailLabel: { fontSize: 16 },
  detailValue: { fontSize: 16, fontWeight: "bold" },
  closeButton: { marginTop: 20, backgroundColor: "red", paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10 },
  closeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
