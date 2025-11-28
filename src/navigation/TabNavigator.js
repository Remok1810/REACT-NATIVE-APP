import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

// Custom button for center Home with animation
const CustomTabBarButton = ({ children, onPress, focused }) => {
  const scale = new Animated.Value(focused ? 1.3 : 1);

  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.3 : 1,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <TouchableOpacity
      style={styles.customButtonContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.customButton,
          { transform: [{ scale }] },
          { backgroundColor: focused ? "red" : "#000" },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          height: Platform.OS === "ios" ? 90 : 70,
          borderTopWidth: 0,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
        },
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontSize: 16,
          marginBottom: 5,
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIonIcon name={focused ? "time" : "time-outline"} color={color} focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={36} color="#fff" />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIonIcon name={focused ? "person" : "person-outline"} color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Animated Icon for pop effect
const AnimatedIonIcon = ({ name, color, focused }) => {
  const scale = new Animated.Value(focused ? 1.3 : 1);

  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.3 : 1,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return <Animated.View style={{ transform: [{ scale }] }}><Ionicons name={name} size={30} color={color} /></Animated.View>;
};

const styles = StyleSheet.create({
  customButtonContainer: {
    top: -30,
    justifyContent: "center",
    alignItems: "center",
  },
  customButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
