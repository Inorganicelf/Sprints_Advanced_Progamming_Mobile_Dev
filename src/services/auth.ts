import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@app_users';

export interface User {
  email: string;
  senha: string;
  nome: string;
}

// Buscar todos os usuários
export const getUsers = async (): Promise<User[]> => {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
};

// Salvar novo usuário
export const saveUser = async (user: User): Promise<boolean> => {
  try {
    const users = await getUsers();
    
    // Verifica se email já existe
    const emailExists = users.some(u => u.email === user.email);
    if (emailExists) {
      return false;
    }
    
    users.push(user);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    return false;
  }
};

// Validar login
export const validateLogin = async (email: string, senha: string): Promise<boolean> => {
  try {
    const users = await getUsers();
    return users.some(u => u.email === email && u.senha === senha);
  } catch (error) {
    console.error('Erro ao validar login:', error);
    return false;
  }
};
