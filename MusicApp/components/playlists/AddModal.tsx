import React, { useContext, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '@/context/Context';

interface AddModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ visible, onClose }) => {
  const [playlistName, setPlaylistName] = useState('');
  const {state, dispatch} = useContext(Context)

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      Alert.alert('Erro', 'O nome da playlist é obrigatório!');
      return;
    }
  
    try {
      // Recupera playlists existentes
      const existingPlaylists = await AsyncStorage.getItem('playlists');
      let playlists = [];
  
      if (existingPlaylists) {
        try {
          playlists = JSON.parse(existingPlaylists);
          if (!Array.isArray(playlists)) {
            playlists = []; // Garante que playlists será um array
          }
        } catch (error) {
          console.warn('Erro ao fazer parsing do AsyncStorage:', error);
          playlists = []; // Fallback para array vazio
        }
      }
  
      // Cria nova playlist
      const newPlaylist = {
        name: playlistName.trim(),
        songs: [], // Inicialmente sem músicas
      };
  
      // Atualiza a lista de playlists
      const updatedPlaylists = [...playlists, newPlaylist];
  
      // Salva no AsyncStorage
      await AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
  
      // Atualiza o estado global com o dispatch
      dispatch({
        type: 'ADD_PLAYLIST',
        payload: updatedPlaylists,
      });
  
      Alert.alert('Sucesso', `A playlist "${playlistName}" foi criada!`);
      setPlaylistName('');
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a playlist. Tente novamente.');
      console.error(error);
    }
  };
  
  

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Dá um nome à tua playlist</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nome da playlist"
              placeholderTextColor="white"
              value={playlistName}
              onChangeText={setPlaylistName}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreatePlaylist} style={styles.createButton}>
              <Text style={styles.buttonText}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fundo semi-transparente
  },
  modalContent: {
    backgroundColor: 'dimgray',
    padding: 30,
    borderRadius: 10,
    width: 350,
    height: 350,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 60,
    color: 'white',
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  input: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
    borderColor: 'gray',
    borderWidth: 2,
  },
  createButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AddModal;
