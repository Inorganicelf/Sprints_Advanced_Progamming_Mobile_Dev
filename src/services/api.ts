import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL_KEY = '@HorizonApp:apiUrl';
const DEFAULT_API_URL = 'http://10.0.2.2:8080'; // URL base, sem o /api/readings
const TOKEN_KEY = '@horizon_auth_token';

/**
 * Obtém a URL da API do AsyncStorage. Se nenhuma URL estiver salva, retorna a URL padrão.
 */
export const getApiUrl = async (): Promise<string> => {
  try {
    const url = await AsyncStorage.getItem(API_URL_KEY);
    return url || DEFAULT_API_URL;
  } catch (e) {
    console.error('Falha ao ler a URL da API do AsyncStorage.', e);
    return DEFAULT_API_URL;
  }
};

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}
export const storeAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const apiUrl = await getApiUrl();
  const response = await fetch(`${apiUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return await response.json();
};
export const logout = async (): Promise<void> => {
  await removeAuthToken();
};
/**
 * Salva a URL da API no AsyncStorage.
 */
export const setApiUrl = async (url: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(API_URL_KEY, url);
  } catch (e) {
    console.error('Falha ao salvar a URL da API no AsyncStorage.', e);
  }
};

const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor que injeta dinamicamente a URL base em cada chamada.
api.interceptors.request.use(
  async (config) => {
    config.baseURL = await getApiUrl();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interface para o payload de criação de uma nova leitura/sensor
export interface NewReadingPayload {
  name: string;
  currentValue: number;
  unit: string;
  status: 'OK' | 'Alerta';
  type: string;
  location: string;
}

/**
 * Busca a lista de todos os sensores do backend.
 */
export const fetchSensors = async () => {
  const apiUrl = await getApiUrl();
  const token = await getAuthToken();
  
  const response = await fetch(`${apiUrl}/api/readings/get`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sensors');
  }

  return await response.json();
};

/**
 * Envia uma nova leitura (ou cria um novo sensor) para o backend.
 */
export const createSensorReading = async (payload: NewReadingPayload) => {
  const apiUrl = await getApiUrl();
  const token = await getAuthToken();
  
  const response = await fetch(`${apiUrl}/api/readings/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create sensor reading');
  }

  return await response.json();
};
export default api;