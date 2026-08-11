import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screens/SplashScreen';
import ProblemsScreen from './screens/ProblemsScreen';
import LogProblemScreen from './screens/LogProblemScreen';
import ProblemDetailScreen from './screens/ProblemDetailScreen';
import StatsScreen from './screens/StatsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Problems" component={ProblemsScreen} />
        <Stack.Screen name="LogProblem" component={LogProblemScreen} />
        <Stack.Screen name="ProblemDetail" component={ProblemDetailScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}