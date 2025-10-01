import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { getApiUrl, setApiUrl } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const TelaConfiguracoes: React.FC = () => {
  const [apiUrl, setApiUrlInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUrl = async () => {
      const url = await getApiUrl();
      setApiUrlInput(url);
      setLoading(false);
    };
    loadUrl();
  }, []);

  const handleSave = async () => {
    if (!apiUrl.trim() || !apiUrl.startsWith('http')) {
      Alert.alert('URL Inválida', 'Por favor, insira a URL base (ex: http://10.0.2.2:8080).');
      return;
    }
    await setApiUrl(apiUrl.trim());
    Alert.alert('Sucesso', 'A URL da API foi atualizada.', [
        { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações da API</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 50 }} />
      ) : (
        <View style={styles.content}>
          <Text style={styles.label}>URL Base do Servidor</Text>
          <TextInput
            style={styles.input}
            value={apiUrl}
            onChangeText={setApiUrlInput}
            placeholder="http://10.0.2.2:8080"
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.infoText}>
            Insira o endereço de rede do seu servidor Spring Boot. O aplicativo se conectará aos endpoints (ex: /api/readings/get) a partir desta URL.
          </Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar e Voltar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  backButton: { padding: 8 },
  backButtonText: { fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  infoText: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 30 },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default TelaConfiguracoes;