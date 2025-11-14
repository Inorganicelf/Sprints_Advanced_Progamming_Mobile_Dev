import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import TelaSplash from './src/screen/tela_splash';
import TelaLogin from './src/screen/tela_login';
import TelaFlatList from './src/screen/tela_flatlist';
import TelaConfiguracoes from './src/screen/tela_configuracoes';
import TelaRegistro from './src/screen/tela_registro';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SPLASH" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SPLASH" component={TelaSplash} />
        <Stack.Screen name="LOGIN" component={TelaLogin} />
        <Stack.Screen name="FLATLIST" component={TelaFlatList} />
        <Stack.Screen name="SETTINGS" component={TelaConfiguracoes} />
        <Stack.Screen name="REGISTRO" component={TelaRegistro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
