import React, { FC, useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '@/context/Context';

interface PlaylistSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

const PlaylistSelectorModal: FC<PlaylistSelectorModalProps> = ({ visible, onClose }) => {
  const { width } = Dimensions.get('window');
  const { state, dispatch } = useContext(Context);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<{ name: string, songs: string[] }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const slideAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    if (visible) {
      loadPlaylists();
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          friction: 8,
          tension: 65,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [visible]);

  const togglePlaylistSelection = (playlistName: string) => {
    const scalePressAnim = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(scalePressAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scalePressAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();

    setSelectedPlaylists((prevSelected) =>
      prevSelected.includes(playlistName)
        ? prevSelected.filter((name) => name !== playlistName)
        : [...prevSelected, playlistName]
    );
  };

  const loadPlaylists = async () => {
    setIsLoading(true);
    try {
      const existingPlaylists = await AsyncStorage.getItem('playlists');
      const playlists = existingPlaylists ? JSON.parse(existingPlaylists) : [];
      setPlaylists(playlists);
    } catch (error) {
      console.error('Erro ao carregar playlists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const updatedPlaylists = playlists.map((playlist) => {
        if (selectedPlaylists.includes(playlist.name)) {
          if (!playlist.songs.includes(state.selectedMusicIcon)) {
            return { ...playlist, songs: [...playlist.songs, state.selectedMusicIcon] };
          }
        }
        return playlist;
      });

      setPlaylists(updatedPlaylists);
      await AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
      dispatch({ type: 'UPDATE_PLAYLISTS', payload: updatedPlaylists });
      
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.05,
          friction: 8,
          tension: 65,
          useNativeDriver: true
        }),
        Animated.spring(scaleAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true
        })
      ]).start(() => onClose());
    } catch (error) {
      console.error('Erro ao salvar música nas playlists:', error);
    } finally {
      setIsLoading(false);
      onClose(); // Ensure the modal closes even if there's an error
    }
  };

  const renderPlaylist = ({ item }: { item: { name: string, songs: string[] } }) => {
    const isSelected = selectedPlaylists.includes(item.name);
    
    return (
      <TouchableOpacity 
        style={[styles.playlistItem, isSelected && styles.selectedPlaylistItem]}
        activeOpacity={0.7}
        onPress={() => togglePlaylistSelection(item.name)}>
        <View style={styles.playlistContent}>
          <View style={styles.playlistInfo}>
            <Text style={[styles.playlistText, isSelected && styles.selectedText]}>
              {item.name}
            </Text>
            <Text style={styles.songCount}>
              {item.songs.length} {item.songs.length === 1 ? 'música' : 'músicas'}
            </Text>
          </View>
          <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
            {isSelected && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modalContent,
            { 
              width: width * 0.9,
              transform: [
                { translateY: slideAnim.interpolate({ 
                  inputRange: [0, 1], 
                  outputRange: [0, 0] 
                })},
                { scale: scaleAnim }
              ]
            }
          ]}>
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar à Playlist</Text>
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Text style={styles.closeIconText}>✕</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#5f27cd" style={styles.loader} />
          ) : (
            <>
              {playlists.length > 0 ? (
                <FlatList
                  data={playlists}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderPlaylist}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Nenhuma playlist encontrada</Text>
                  <Text style={styles.emptyStateSubtext}>Crie uma playlist para começar</Text>
                </View>
              )}
            </>
          )}

          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
              activeOpacity={0.7}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.confirmButton,
                selectedPlaylists.length === 0 && styles.disabledButton
              ]} 
              onPress={handleConfirm}
              disabled={selectedPlaylists.length === 0}
              activeOpacity={0.7}>
              <Text style={[
                styles.buttonText, 
                styles.confirmButtonText,
                selectedPlaylists.length === 0 && styles.disabledButtonText
              ]}>
                Adicionar ({selectedPlaylists.length})
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 24,
    maxHeight: 450,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  closeIcon: {
    padding: 8,
  },
  closeIconText: {
    color: '#999',
    fontSize: 20,
    fontWeight: '500',
    marginRight: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
  playlistItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedPlaylistItem: {
    backgroundColor: '#5f27cd20',
    borderColor: '#5f27cd',
  },
  playlistContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playlistInfo: {
    flex: 1,
  },
  playlistText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedText: {
    color: '#5f27cd',
    fontWeight: 'bold',
  },
  songCount: {
    fontSize: 13,
    color: '#999',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#5f27cd',
    borderColor: '#5f27cd',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#2A2A2A',
  },
  confirmButton: {
    backgroundColor: '#5f27cd',
  },
  disabledButton: {
    backgroundColor: '#2A2A2A',
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  confirmButtonText: {
    color: 'white',
  },
  disabledButtonText: {
    color: '#999',
  },
  loader: {
    marginVertical: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default PlaylistSelectorModal;
