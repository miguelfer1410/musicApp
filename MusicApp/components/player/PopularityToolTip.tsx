import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

const PopularityToolTip = ({ popularity }: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  const getPopularityDescription = (score: any) => {
    if (score >= 80) return 'Muito Popular';
    if (score >= 60) return 'Popular';
    if (score >= 40) return 'Moderadamente Popular';
    if (score >= 20) return 'Pouco Popular';
    return 'Baixa Popularidade';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.popularityContainer}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.popularityText}>{popularity}</Text>
        <Text style={{color:'white'}}>popularidade</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalContent} 
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Índice de Popularidade</Text>
            
            <View style={styles.descriptionContainer}>
              <Text style={styles.modalText}>
                Este índice representa a popularidade do artista em uma escala de 0 a 100.
              </Text>
            </View>

            <View style={styles.popularityRanges}>
              {[
                { range: '0-20', description: 'Baixa Popularidade', color: '#FF6B6B' },
                { range: '20-40', description: 'Pouco Popular', color: '#FCA311' },
                { range: '40-60', description: 'Moderadamente Popular', color: '#4ECDC4' },
                { range: '60-80', description: 'Popular', color: '#A8DADC' },
                { range: '80-100', description: 'Muito Popular', color: '#457B9D' }
              ].map((item, index) => (
                <View key={index} style={styles.rangeItem}>
                  <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                  <Text style={styles.rangeText}>
                    {item.range}: {item.description}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.currentStatus}>
              Status Atual: {getPopularityDescription(popularity)}
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Entendido</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularityContainer: {
    backgroundColor: 'deepskyblue',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    right: 10,
  },
  popularityText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
  },
  descriptionContainer: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
  modalText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  popularityRanges: {
    width: '100%',
    marginBottom: 15,
  },
  rangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  rangeText: {
    color: 'white',
    fontSize: 13,
  },
  currentStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginTop: 10,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: 'deepskyblue',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PopularityToolTip;