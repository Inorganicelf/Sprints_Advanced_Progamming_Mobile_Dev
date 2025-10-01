import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Dimensions,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchSensors, createSensorReading, NewReadingPayload } from '../services/api';
import TelaCadastroLeitura from './tela_cadastro_leitura'; // Importa a nova tela/modal

// Interface para definir o tipo do sensor
interface SensorData {
  id: number;
  name: string;
  currentValue: number;
  unit: string;
  status: 'OK' | 'Alerta';
  type: string;
  location: string;
  history?: number[];
}

interface ModalData {
  visible: boolean;
  sensor: SensorData | null;
}

const TelaFlatList: React.FC = () => {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [detailsModal, setDetailsModal] = useState<ModalData>({ visible: false, sensor: null });
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const navigation = useNavigation<any>();

  const generateSimulatedHistory = (currentValue: number): number[] => {
    const history: number[] = [];
    for (let i = 0; i < 10; i++) {
      history.push(Number((currentValue * (1 + (Math.random() - 0.5) * 0.4)).toFixed(2)));
    }
    return history;
  };

  const loadSensors = useCallback(async (isRefreshing = false) => {
    if (!isRefreshing) setLoading(true);
    try {
      const sensorsData = await fetchSensors();
      const sensorsWithHistory = Array.isArray(sensorsData)
        ? sensorsData.map((s: SensorData) => ({ ...s, history: generateSimulatedHistory(s.currentValue) }))
        : [];
      setSensors(sensorsWithHistory);
    } catch (error) {
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível carregar os dados. Verifique a URL da API na tela de configurações.',
        [{ text: 'Ir para Config.', onPress: () => navigation.navigate('SETTINGS') }, { text: 'OK' }]
      );
    } finally {
      if (!isRefreshing) setLoading(false);
      setRefreshing(false);
    }
  }, [navigation]);

  useFocusEffect(useCallback(() => { loadSensors(); }, [loadSensors]));
  
  const onRefresh = () => {
    setRefreshing(true);
    loadSensors(true);
  };
  
  const handleAddSensor = async (payload: NewReadingPayload) => {
    try {
      await createSensorReading(payload);
      setAddModalVisible(false);
      Alert.alert('Sucesso', 'Nova leitura registrada com sucesso!');
      onRefresh(); // Recarrega a lista para mostrar o novo item
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar a nova leitura.');
    }
  };

  const getStatusColor = (status: string): string => status === 'OK' ? '#4CAF50' : '#FF9800';
  const getStatusBackgroundColor = (status: string): string => status === 'OK' ? '#E8F5E8' : '#FFF3E0';
  const handleSensorPress = (sensor: SensorData) => setDetailsModal({ visible: true, sensor });
  const closeDetailsModal = () => setDetailsModal({ visible: false, sensor: null });

  const renderSensorItem = ({ item }: { item: SensorData }) => (
    <TouchableOpacity style={styles.sensorCard} onPress={() => handleSensorPress(item)} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <Text style={styles.sensorName} numberOfLines={1}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBackgroundColor(item.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.sensorLocation}>{item.location}</Text>
      <Text style={styles.sensorType}>Tipo: {item.type}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.currentValue}>{item.currentValue} {item.unit}</Text>
        <Text style={styles.valueLabel}>Valor Atual</Text>
      </View>
      <View style={styles.clickIndicator}><Text style={styles.clickText}>Toque para ver histórico →</Text></View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" /><Text style={styles.loadingText}>Carregando sensores...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Componentes Pneumáticos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SETTINGS')} style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>{sensors.length} sensores encontrados</Text>
      </View>

      <FlatList
        data={sensors}
        renderItem={renderSensorItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum sensor encontrado</Text>
            <Text style={styles.emptySubtext}>Tente atualizar a lista ou verifique as configurações.</Text>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2196F3']} />}
      />

      {/* Botão Flutuante para Adicionar Sensor */}
      <TouchableOpacity style={styles.fab} onPress={() => setAddModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal de Detalhes (código omitido para brevidade, pode colar o seu original) */}
      <Modal visible={detailsModal.visible} animationType="slide" onRequestClose={closeDetailsModal}>
        {/* ... Seu código do modal de detalhes aqui ... */}
      </Modal>

      {/* Modal de Cadastro de Nova Leitura */}
      <TelaCadastroLeitura
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={handleAddSensor}
      />
    </SafeAreaView>
  );
};

// ... Estilos (cole todos os estilos do seu arquivo original e adicione os novos)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#2196F3', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 14, color: '#E3F2FD', marginTop: 4 },
  settingsButton: { padding: 8 },
  settingsButtonText: { fontSize: 24, color: '#FFFFFF' },
  listContainer: { padding: 16, paddingBottom: 80 },
  separator: { height: 12 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#666' },
  emptySubtext: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 8 },
  sensorCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sensorName: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusText: { fontSize: 12, fontWeight: '600' },
  sensorLocation: { fontSize: 14, color: '#666', marginBottom: 4 },
  sensorType: { fontSize: 14, color: '#666', marginBottom: 12, fontStyle: 'italic' },
  valueContainer: { alignItems: 'flex-start', marginBottom: 12 },
  currentValue: { fontSize: 28, fontWeight: 'bold', color: '#2196F3' },
  valueLabel: { fontSize: 12, color: '#999', marginTop: 2 },
  clickIndicator: { alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  clickText: { fontSize: 12, color: '#2196F3', fontWeight: '500' },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#2196F3',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 3 },
  },
  fabText: {
    fontSize: 30,
    color: 'white',
  },
});

export default TelaFlatList;