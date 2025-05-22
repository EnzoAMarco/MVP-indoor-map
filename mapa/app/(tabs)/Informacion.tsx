import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, Animated } from 'react-native';

interface CategoryItem {
  label: string;
  info: string;
}

interface Category {
  title: string;
  items: CategoryItem[];
}

const InformationComponent: React.FC = () => {
  const categories: Category[] = [
    {
      title: 'Opciones Gastronómicas',
      items: [
        { label: 'Cocina Petersen', info: 'Information for Cocina Petersen' },
        { label: 'La cantina', info: 'Information for La cantina' },
        { label: 'Rústica', info: 'Information for Rústica' },
        { label: 'Starbucks', info: 'Information for Starbucks' },
      ],
    },
    {
      title: 'Expendedoras',
      items: [
        { label: 'Café', info: 'Lima 1: Primer subsuelo\nLima 3: Pisos 2, 3, 4, 5, 6, 7, 8 y 9\nUade Labs: Piso 6' },
        { label: 'Agua Caliente', info: 'Information for Agua Caliente' },
        { label: 'Agua Fría', info: 'Information for Agua Fría' },
        { label: 'Gaseosas', info: 'Information for Gaseosas' },
      ],
    },
    {
      title: 'Otros',
      items: [
        { label: 'Santander', info: 'Information for Santander' },
        { label: 'Bookstore Temas', info: 'Information for Bookstore Temas' },
        { label: 'Ascensores', info: 'Information for Ascensores' },
        { label: 'Salidas de emergencia', info: 'Information for Salidas de emergencia' },
        { label: 'Estacionamiento', info: 'Information for Estacionamiento' },
        { label: 'Medicus', info: 'Information for Medicus' },
        { label: 'Centro de copiado', info: 'Information for Centro de copiado' },
        { label: 'Recarga sube', info: 'Information for Recarga sube' },
        { label: 'UADE Store', info: 'Information for UADE Store' },
      ],
    },
  ];

  const [selectedInfo, setSelectedInfo] = useState<string>('');
  const [selectedButtonLabel, setSelectedButtonLabel] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: isModalVisible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: isModalVisible ? 1 : 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isModalVisible]);

  const handleButtonPress = (info: string, label: string) => {
    setSelectedInfo(info);
    setSelectedButtonLabel(label);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Información</Text>
        <View style={styles.divider} />
        {categories.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.buttonsContainer}>
              {category.items.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.button,
                    selectedButtonLabel === item.label && styles.selectedButton,
                  ]}
                  onPress={() => handleButtonPress(item.info, item.label)}
                >
                  <Text style={selectedButtonLabel === item.label && styles.selectedButtonText}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {index < categories.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
          <Animated.View style={[styles.modalContainer, { opacity: modalOpacity, transform: [{ scale: modalScale }] }]}>
            <Text style={styles.modalTitle}>{selectedButtonLabel || 'Información'}</Text>
            <Text style={styles.modalText}>{selectedInfo || 'Selecciona una opción.'}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 70,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#d3d3d3',
    marginVertical: 15,
    width: '100%',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#d3d3d3',
  },
  selectedButton: {
    backgroundColor: '#e0e0e0',
    borderColor: '#a9a9a9',
  },
  selectedButtonText: {
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InformationComponent;