import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors, Typography } from "../utils/constants";
import { useResponsive } from "../hooks/useResponsive";
import { Sidebar } from "./Sidebar";
import { HomeScreen } from "../features/home/HomeScreen";
import { GameScreen } from "../features/game/GameScreen";
import { GameSetupScreen } from "../features/game/GameSetupScreen";
import { PuzzleScreen } from "../features/puzzles/PuzzleScreen";
import { ProfileScreen } from "../features/profile/ProfileScreen";
import { SettingsScreen } from "../features/profile/SettingsScreen";

const Tab = createBottomTabNavigator();
const PlayStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function PlayStackNavigator() {
  return (
    <PlayStack.Navigator screenOptions={{ headerShown: false }}>
      <PlayStack.Screen name="GameSetup" component={GameSetupScreenWrapper} />
      <PlayStack.Screen name="Game" component={GameScreen} />
    </PlayStack.Navigator>
  );
}

function GameSetupScreenWrapper({ navigation }: any) {
  return <GameSetupScreen onStart={() => navigation.navigate("Game")} />;
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    </ProfileStack.Navigator>
  );
}

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border },
        tabBarActiveTintColor: Colors.textPrimary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "Home" }} />
      <Tab.Screen name="PlayTab" component={PlayStackNavigator} options={{ tabBarLabel: "Play" }} />
      <Tab.Screen name="Puzzles" component={PuzzleScreen} options={{ tabBarLabel: "Puzzles" }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ tabBarLabel: "Profile" }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isTablet } = useResponsive();
  return (
    <NavigationContainer>
      {isTablet ? <Sidebar /> : <BottomTabs />}
    </NavigationContainer>
  );
}
