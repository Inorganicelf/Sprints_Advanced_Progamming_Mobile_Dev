import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import TelaSplash from './src/screen/tela_splash';
import TelaFlatList from './src/screen/tela_flatlist';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions= {{headerShown: false}} initialRouteName="SPLASH">
        <Stack.Screen name="SPLASH" component={TelaSplash} />
        <Stack.Screen name="FLATLIST" component={TelaFlatList} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App

const styles = StyleSheet.create({})