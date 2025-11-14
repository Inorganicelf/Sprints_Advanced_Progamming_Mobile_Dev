import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define your stack parameter list
export type RootStackParamList = {
  SPLASH: undefined;
  LOGIN: undefined;
  REGISTRO: undefined;  // ADICIONAR ESTA LINHA
  DASHBOARD: undefined;
  FLATLIST: undefined;
  SETTINGS: undefined;
};

// Adicionar também:
export type RegistroScreenProps = NativeStackScreenProps<RootStackParamList, 'REGISTRO'>;


// Screen props types
export type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'SPLASH'>;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'LOGIN'>;
export type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'DASHBOARD'>;
export type FlatListScreenProps = NativeStackScreenProps<RootStackParamList, 'FLATLIST'>;
export type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'SETTINGS'>;

// Global type declaration for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
