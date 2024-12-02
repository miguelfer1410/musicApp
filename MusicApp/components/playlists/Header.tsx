import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddModal from './AddModal'; // Importando o componente de modal

export default function Header() {
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>A minha Biblioteca</Text>
      <View style={styles.icons}>
        {/* Ícone de busca */}
        <TouchableOpacity style={styles.iconWrapper} onPress={() => console.log('Search Pressed')}>
          <Ionicons name="search" size={28} color="white" />
        </TouchableOpacity>

        {/* Ícone de adicionar */}
        <TouchableOpacity style={styles.iconWrapper} onPress={openModal}>
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal que aparece ao clicar no ícone de adicionar */}
      <AddModal visible={isModalVisible} onClose={closeModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1e1e1e',
    position: 'absolute', // Isso mantém o header fixo no topo
    marginTop: 20,
    left: 10,
    right: 10,
    zIndex: 1, // Para garantir que o header fique acima do conteúdo
  },
  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  icons: {
    flexDirection: 'row',
  },
  iconWrapper: {
    marginLeft: 10, // Espaçamento entre os ícones
  },
});
