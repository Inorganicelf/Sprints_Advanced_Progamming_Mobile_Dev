import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { NewReadingPayload } from '../services/api';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: NewReadingPayload) => void;
}

const TelaCadastroLeitura: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [unit, setUnit] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState<'OK' | 'Alerta'>('OK');

  const handleSubmit = () => {
    if (!name || !currentValue || !unit || !location || !type) {
      Alert.alert('Campos Vazios', 'Por favor, preencha todos os campos.');
      return;
    }

    const payload: NewReadingPayload = {
      name,
      currentValue: parseFloat(currentValue),
      unit,
      location,
      type,
      status,
    };
    
    onSubmit(payload);
    // Limpar formulário após envio
    setName('');
    setCurrentValue('');
    setUnit('');
    setLocation('');
    setType('');
    setStatus('OK');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nova Leitura / Sensor</Text>
          <TouchableOpacity onPress={onClose}><Text style={styles.closeButton}>✕</Text></TouchableOpacity>
        </View>
        <ScrollView style={styles.form}>
          <Text style={styles.label}>Nome do Sensor</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Sensor de Pressão Z5" />

          <Text style={styles.label}>Valor Atual</Text>
          <TextInput style={styles.input} value={currentValue} onChangeText={setCurrentValue} placeholder="Ex: 15.8" keyboardType="numeric" />

          <Text style={styles.label}>Unidade</Text>
          <TextInput style={styles.input} value={unit} onChangeText={setUnit} placeholder="Ex: L/min, bar, °C" />

          <Text style={styles.label}>Localização</Text>
          <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Ex: Compressor Auxiliar" />

          <Text style={styles.label}>Tipo</Text>
          <TextInput style={styles.input} value={type} onChangeText={setType} placeholder="Ex: Fluxo, Pressão" />

          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[styles.statusButton, status === 'OK' && styles.statusButtonActive]}
              onPress={() => setStatus('OK')}
            >
              <Text style={[styles.statusButtonText, status === 'OK' && styles.statusButtonTextActive]}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, status === 'Alerta' && styles.statusButtonActive]}
              onPress={() => setStatus('Alerta')}
            >
              <Text style={[styles.statusButtonText, status === 'Alerta' && styles.statusButtonTextActive]}>Alerta</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Salvar Leitura</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    closeButton: { fontSize: 24, color: '#333' },
    form: { padding: 20 },
    label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 10 },
    input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
    statusContainer: { flexDirection: 'row', marginTop: 8 },
    statusButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#CCC', alignItems: 'center', marginRight: 8 },
    statusButtonActive: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
    statusButtonText: { color: '#333', fontWeight: '600' },
    statusButtonTextActive: { color: '#FFFFFF' },
    submitButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 30, marginBottom: 50 },
    submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default TelaCadastroLeitura;