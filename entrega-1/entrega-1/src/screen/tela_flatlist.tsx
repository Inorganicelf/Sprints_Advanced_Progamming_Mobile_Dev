import React, { useState, useEffect } from 'react';
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
} from 'react-native';

const { width } = Dimensions.get('window');

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

// Interface para o modal
interface ModalData {
  visible: boolean;
  sensor: SensorData | null;
}

const TelaFlatList: React.FC = () => {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ModalData>({
    visible: false,
    sensor: null,
  });

  // Função para gerar histórico simulado
  const generateSimulatedHistory = (currentValue: number): number[] => {
    const history: number[] = [];
    const baseValue = currentValue;
    
    // Gera 10 valores históricos com variação de ±20%
    for (let i = 0; i < 10; i++) {
      const variation = (Math.random() - 0.5) * 0.4; // ±20%
      const value = baseValue * (1 + variation);
      history.push(Number(value.toFixed(2)));
    }
    
    return history;
  };

  // Função para carregar dados do arquivo sensors.json
  const loadSensors = async () => {
    try {
      // Importa os dados do arquivo JSON
      const sensorsData = require('../mock/sensors.json');
      
      // Adiciona histórico simulado para cada sensor
      const sensorsWithHistory = sensorsData.sensors.map((sensor: SensorData) => ({
        ...sensor,
        history: generateSimulatedHistory(sensor.currentValue),
      }));
      
      setSensors(sensorsWithHistory);
    } catch (error) {
      console.error('Erro ao carregar sensores:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para refresh da lista
  const onRefresh = async () => {
    setRefreshing(true);
    await loadSensors();
    setRefreshing(false);
  };

  // Função para atualizar dados manualmente
  const handleUpdateData = async () => {
    setLoading(true);
    await loadSensors();
  };

  // Função para determinar a cor do status
  const getStatusColor = (status: string): string => {
    return status === 'OK' ? '#4CAF50' : '#FF9800';
  };

  // Função para determinar a cor de fundo do status
  const getStatusBackgroundColor = (status: string): string => {
    return status === 'OK' ? '#E8F5E8' : '#FFF3E0';
  };

  // Função para lidar com o toque no sensor
  const handleSensorPress = (sensor: SensorData) => {
    setModalData({
      visible: true,
      sensor: sensor,
    });
  };

  // Função para fechar o modal
  const closeModal = () => {
    setModalData({
      visible: false,
      sensor: null,
    });
  };

  // Componente do gráfico simples
  const SimpleChart = ({ data, unit }: { data: number[]; unit: string }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Histórico de Valores</Text>
        
        {/* Eixo Y - Valores máximo e mínimo */}
        <View style={styles.chartYAxis}>
          <Text style={styles.yAxisLabel}>{maxValue.toFixed(1)} {unit}</Text>
          <Text style={styles.yAxisLabel}>{minValue.toFixed(1)} {unit}</Text>
        </View>

        {/* Área do gráfico */}
        <View style={styles.chartArea}>
          <View style={styles.chartGrid}>
            {/* Linhas de grade horizontais */}
            {[0, 1, 2, 3, 4].map((index) => (
              <View key={index} style={styles.gridLine} />
            ))}
          </View>

          {/* Barras do gráfico */}
          <View style={styles.barsContainer}>
            {data.map((value, index) => {
              const height = ((value - minValue) / range) * 120 + 10; // Altura mínima de 10
              return (
                <View key={index} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: height,
                        backgroundColor: value > (maxValue + minValue) / 2 ? '#4CAF50' : '#2196F3',
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{index + 1}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Legenda */}
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Acima da média</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
            <Text style={styles.legendText}>Abaixo da média</Text>
          </View>
        </View>
      </View>
    );
  };

  // Componente para renderizar cada item da lista
  const renderSensorItem = ({ item }: { item: SensorData }) => (
    <TouchableOpacity
      style={styles.sensorCard}
      onPress={() => handleSensorPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.sensorName}>{item.name}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusBackgroundColor(item.status) },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.status) },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.sensorLocation}>{item.location}</Text>
      <Text style={styles.sensorType}>Tipo: {item.type}</Text>

      <View style={styles.valueContainer}>
        <Text style={styles.currentValue}>
          {item.currentValue} {item.unit}
        </Text>
        <Text style={styles.valueLabel}>Valor Atual</Text>
      </View>

      {/* Indicador de que é clicável */}
      <View style={styles.clickIndicator}>
        <Text style={styles.clickText}>Toque para ver histórico →</Text>
      </View>
    </TouchableOpacity>
  );

  // Componente para lista vazia
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Nenhum sensor encontrado</Text>
      <Text style={styles.emptySubtext}>
        Verifique se o arquivo sensors.json está configurado corretamente
      </Text>
    </View>
  );

  // Separador entre itens
  const ItemSeparator = () => <View style={styles.separator} />;

  // Carrega os dados quando o componente é montado
  useEffect(() => {
    loadSensors();
  }, []);

  // Mostra loading enquanto carrega os dados
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Carregando sensores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Componentes Pneumáticos</Text>
        <Text style={styles.headerSubtitle}>
          {sensors.length} sensores encontrados
        </Text>
      </View>

      {/* Botão Atualizar */}
      <View style={styles.updateButtonContainer}>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateData}
          activeOpacity={0.7}
        >
          <Text style={styles.updateButtonText}>🔄 Atualizar Dados</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sensors}
        renderItem={renderSensorItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Modal para exibir histórico */}
      <Modal
        visible={modalData.visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {modalData.sensor?.name}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Informações do sensor */}
            <View style={styles.sensorInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Localização:</Text>
                <Text style={styles.infoValue}>{modalData.sensor?.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tipo:</Text>
                <Text style={styles.infoValue}>{modalData.sensor?.type}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={[
                  styles.infoValue,
                  { color: getStatusColor(modalData.sensor?.status || 'OK') }
                ]}>
                  {modalData.sensor?.status}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Valor Atual:</Text>
                <Text style={styles.currentValueModal}>
                  {modalData.sensor?.currentValue} {modalData.sensor?.unit}
                </Text>
              </View>
            </View>

            {/* Gráfico */}
            {modalData.sensor?.history && (
              <SimpleChart
                data={modalData.sensor.history}
                unit={modalData.sensor.unit}
              />
            )}

            {/* Dados tabulares */}
            <View style={styles.dataTable}>
              <Text style={styles.tableTitle}>Dados Históricos</Text>
              {modalData.sensor?.history?.map((value, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableIndex}>#{index + 1}</Text>
                  <Text style={styles.tableValue}>
                    {value} {modalData.sensor?.unit}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 4,
  },
  updateButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  updateButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  sensorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sensorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sensorLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  sensorType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  valueContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  currentValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  valueLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  clickIndicator: {
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  clickText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  // Estilos do Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    backgroundColor: '#2196F3',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  sensorInfo: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
    infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  currentValueModal: {
    fontSize: 18,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  // Estilos do Gráfico
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartYAxis: {
    position: 'absolute',
    left: 0,
    top: 50,
    height: 120,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#666',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
  },
  chartArea: {
    marginLeft: 50,
    marginRight: 10,
    height: 140,
    position: 'relative',
  },
  chartGrid: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
    opacity: 0.5,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: 10,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 1,
  },
  bar: {
    width: '80%',
    borderRadius: 2,
    minHeight: 10,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  // Estilos da Tabela
  dataTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tableIndex: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tableValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});

export default TelaFlatList;