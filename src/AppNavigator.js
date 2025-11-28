import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./navigation/TabNavigator";
import DetailsScreen from "./screens/DetailsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* Bottom Tabs */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />

        {/* Movie Details Page */}
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{
            headerShown: true,
            title: "Movie Details",
            headerStyle: { backgroundColor: "#0D0D0D" },
            headerTintColor: "#fff",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
