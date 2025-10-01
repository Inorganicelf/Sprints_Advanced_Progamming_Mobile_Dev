import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL_KEY = '@HorizonApp:apiUrl';
const DEFAULT_API_URL = 'http://10.0.2.2:8080'; // URL base, sem o /api/readings

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
  try {
    const response = await api.get('/api/readings/get');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar sensores via API:', error);
    throw error;
  }
};

/**
 * Envia uma nova leitura (ou cria um novo sensor) para o backend.
 */
export const createSensorReading = async (payload: NewReadingPayload) => {
  try {
    const response = await api.post('/api/readings/create', payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar nova leitura via API:', error);
    throw error;
  }
};

export default api;