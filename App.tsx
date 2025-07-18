/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import ChatScreen from './ChatScreen';
import ConnexionScreen from './ConnexionScreen';
import DashboardScreen from './DashboardScreen'; // Importer le nouvel écran
import AgentNavigator from './AgentNavigator';

// On définit ici la liste de tous les écrans et les paramètres qu'ils peuvent recevoir.
// Cela garantit que l'on ne peut pas se tromper en naviguant.
export type RootStackParamList = {
  Login: undefined; // L'écran Login ne reçoit aucun paramètre
  Chat: undefined;  // L'écran Chat non plus pour l'instant
  Connexion: undefined; // Ajouter l'écran de connexion
  Dashboard: undefined;
  AgentFlow: undefined; // Le flux de navigation de l'agent
};

// Crée un navigateur de type "Stack"
const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* Définit notre premier écran. L'application démarrera ici. */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Connexion" component={ConnexionScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="AgentFlow" component={AgentNavigator} />
        {/* Nous ajouterons d'autres écrans ici plus tard */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
