import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/types';
import { Context } from '@/context/Context';
import BottomDrawer from '@/components/search/BottomDrawer';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Playlist {
  name: string;
  songs: string[];
  pinned: boolean;
}

const PlaylistList = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editedPlaylistName, setEditedPlaylistName] = useState('');
  const [pinAnimation] = useState(new Animated.Value(0));
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    fetchPlaylists();
  }, [state.playlists, dispatch]);

  const fetchPlaylists = async () => {
    try {
      const storedPlaylists = await AsyncStorage.getItem('playlists');
      const parsedPlaylists = storedPlaylists ? JSON.parse(storedPlaylists) : [];
      setPlaylists(parsedPlaylists);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as playlists.');
      console.error(error);
    }
  };

  const animatePin = (isPinning: boolean) => {
    Animated.sequence([
      Animated.timing(pinAnimation, {
        toValue: isPinning ? 1 : 0,
        duration: 300,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleOptionsPress = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setEditedPlaylistName(playlist.name);
    setIsDrawerOpen(true);
  };

  const handlePinPlaylist = () => {
    if (selectedPlaylist) {
      const newPinnedState = !selectedPlaylist.pinned;
      animatePin(newPinnedState);
      
      const updatedPlaylists = playlists.map((playlist) =>
        playlist.name === selectedPlaylist.name
          ? { ...playlist, pinned: newPinnedState }
          : playlist
      );
      
      setPlaylists(updatedPlaylists);
      AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
      setTimeout(() => setIsDrawerOpen(false), 300);
    }
  };

  const handleSelectPlaylist = (item:any) => {
    dispatch({ type: 'SET_SELECTED_PLAYLIST', payload: item }),
    navigation.navigate('PlaylistDetails')
  }

  const handleDeletePlaylist = () => {
    Alert.alert(
      'Eliminar Playlist',
      `Tem certeza que deseja eliminar "${selectedPlaylist?.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            const updatedPlaylists = playlists.filter(
              (playlist) => playlist.name !== selectedPlaylist?.name
            );
            setPlaylists(updatedPlaylists);
            AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
            setIsDrawerOpen(false);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderPlaylist = ({ item }: { item: Playlist }) => {
    return (
      <Animated.View
        style={[
          styles.playlistItem,
          item.pinned && styles.pinnedPlaylist,
        ]}
      >
        <TouchableOpacity
          style={styles.playlistDetails}
          onPress={() =>
            handleSelectPlaylist(item.name)
          }
        >
          <View style={styles.playlistInfo}>
            {item.pinned && (
              <View style={styles.pinnedBadge}>
                <Ionicons name="pin" size={12} color="#fff" />
                <Text style={styles.pinnedText}>Fixada</Text>
              </View>
            )}
            <Text style={styles.playlistName}>{item.name}</Text>
            <Text style={styles.songCount}>
              {item.songs.length} {item.songs.length === 1 ? 'música' : 'músicas'}
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => handleOptionsPress(item)}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#bcbcbc" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSectionHeader = (title: string) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const organizedPlaylists = playlists.reduce(
    (acc, playlist) => {
      if (playlist.pinned) {
        acc.pinned.push(playlist);
      } else {
        acc.regular.push(playlist);
      }
      return acc;
    },
    { pinned: [] as Playlist[], regular: [] as Playlist[] }
  );

  return (
    <View style={styles.container}>
      {playlists.length > 0 ? (
        <FlatList
          data={[...organizedPlaylists.pinned, ...organizedPlaylists.regular]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderPlaylist}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="musical-notes-outline" size={48} color="#666" />
          <Text style={styles.noPlaylistsText}>Nenhuma playlist encontrada</Text>
          <Text style={styles.noPlaylistsSubtext}>
            Crie uma nova playlist para começar
          </Text>
        </View>
      )}

      {selectedPlaylist && (
              <BottomDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                height={0.3}
              >
          <View style={styles.drawerContent}>
            <Text style={styles.drawerHeader}>{selectedPlaylist.name}</Text>
            
            <TouchableOpacity
              style={styles.drawerOption}
              onPress={handlePinPlaylist}
            >
              <Animated.View
                style={[styles.optionIconContainer]}
              >
                <Ionicons
                  name={selectedPlaylist.pinned ? "pin" : "pin-outline"}
                  size={24}
                  color={selectedPlaylist.pinned ? "#5f27cd" : "#bcbcbc"}
                />
              </Animated.View>
              <Text 
                style={[styles.optionText, selectedPlaylist.pinned && styles.activeOptionText]}
              >
                {selectedPlaylist.pinned ? 'Desfixar playlist' : 'Fixar playlist'}
              </Text>
            </TouchableOpacity>

            
            <TouchableOpacity
              style={styles.drawerOption}
              onPress={handleDeletePlaylist}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="trash-outline" size={24} color="#ff4757" />
              </View>
              <Text style={[styles.optionText, styles.deleteText]}>
                Eliminar Playlist
              </Text>
            </TouchableOpacity>
          </View>
        </BottomDrawer>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#1a1a1a',
    marginTop:70
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    
  },
  pinnedPlaylist: {
    borderColor: '#5f27cd40',
  },
  playlistDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playlistInfo: {
    flex: 1,
    
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5f27cd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 8,
  },
  pinnedText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 4,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  activeOptionText: {
    color: '#5f27cd',
  },
  
  songCount: {
    fontSize: 14,
    color: '#777',
  },
  optionsButton: {
    marginLeft: 15,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  listContainer: {
    height:700
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noPlaylistsText: {
    fontSize: 18,
    color: '#666',
  },
  noPlaylistsSubtext: {
    fontSize: 14,
    color: '#999',
  },
  drawerContent: {
    padding: 20,
  },
  drawerHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color:'white',
  },
  drawerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionIconContainer: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#bcbcbc',
  },
  activeOption: {
    color: '#5f27cd',
  },
  deleteText: {
    color: '#ff4757',
  },
});

export default PlaylistList;
