import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAudioPlayer from '@/hooks/useAudioPlayer'; // Import the hook
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/types';
import { Context } from '@/context/Context';
import BottomDrawer from '../search/BottomDrawer'; // Certifique-se de ajustar o caminho
import AsyncStorage from '@react-native-async-storage/async-storage';
import Alert from '../helpers/Alert';

interface Song {
  id: number;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
}

interface SongListProps {
  onScroll?: (event: any) => void;
}

const SongList: React.FC<SongListProps> = ({ onScroll }) => {
  const { state, dispatch } = useContext(Context);
  const [songs, setSongs] = useState<Song[]>([]);
  const [sortedSongs, setSortedSongs] = useState<Song[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [alertVisible, setAlertVisible] = useState(false); // Estado para o alerta
  const [alertMessage, setAlertMessage] = useState(''); // Mensagem do alerta


  useEffect(() => {
    fetchPlaylistSongs();
  }, [state.selectedPlaylist]);

  const fetchPlaylistSongs = async () => {
    try {
      const storedPlaylists = await AsyncStorage.getItem('playlists');
      const parsedPlaylists = storedPlaylists ? JSON.parse(storedPlaylists) : [];
      const playlist = parsedPlaylists.find((pl: { name: string }) => pl.name === state.selectedPlaylist);
      setSongs(playlist ? playlist.songs.map((song: any, index: any) => ({ ...song, id: index })) : []);
    } catch (error) {
      console.error('Erro ao carregar músicas da playlist:', error);
    }
  };

  const removeSongFromAsyncStorage = async (songName: string) => {
    try {
      const storedPlaylists = await AsyncStorage.getItem('playlists');
      if (storedPlaylists) {
        const playlists = JSON.parse(storedPlaylists);
  
        // Atualizar a playlist correspondente
        const updatedPlaylists = playlists.map((playlist: any) => {
          if (playlist.name === state.selectedPlaylist) {
            return {
              ...playlist,
              songs: playlist.songs.filter((song: Song) => song.name !== songName), // Usar o name da música
            };
          }
          return playlist;
        });
  
        // Salvar as playlists atualizadas no AsyncStorage
        await AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
  
        // Atualizar a lista de músicas local
        fetchPlaylistSongs();

        

      
      }
    } catch (error) {
      console.error('Failed to remove song from AsyncStorage', error);
    }
  };
  

  useEffect(() => {
    const sortSongs = () => {
      const sorted = [...songs];
      if (state.sortOption) {
        switch (state.sortOption) {
          case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'artist':
            sorted.sort((a, b) => a.artists[0].name.localeCompare(b.artists[0].name));
            break;
          case 'dateAdded':
            // If you have dateAdded field
            break;
          case 'duration':
            // If you have duration field
            break;
        }
      }
      setSortedSongs(sorted);
    };
    sortSongs();
  }, [songs, state.sortOption]);

  const handlePlay = (item: any) => {
    if (item.preview_url) {
      dispatch({ type: 'SET_SELECTED_SONG', payload: item });
      navigation.navigate('Player');
    } else {
      console.log('No preview available');
    }
  };

  const handleOptionsPress = (item: Song) => {
    setSelectedSong(item);
    setIsDrawerOpen(true);
  };

  const handleDeleteSong = () => {
    if (selectedSong) {
      // Lógica para eliminar a música da playlist
      console.log(selectedSong.name);
      removeSongFromAsyncStorage(selectedSong.name);
      setIsDrawerOpen(false);
    }
  };

  const renderSong = ({ item, index }: { item: Song; index: number }) => (
    <TouchableOpacity onPress={() => handlePlay(item)}>
      <View style={styles.songItem}>
        <Image
          source={{ uri: item.album.images[0].url }}
          style={{ width: 60, height: 60, borderRadius: 5, marginRight: 10 }}
        />
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{item.name}</Text>
          <Text style={styles.songArtist}>{item.artists.map((artist: any) => artist.name).join(', ')}</Text>
        </View>
        <View style={styles.songActions}>
          <TouchableOpacity onPress={() => handleOptionsPress(item)}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#ffffff80" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <Animated.FlatList
        data={sortedSongs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderSong}
        contentContainerStyle={styles.listContainer}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListFooterComponent={<View style={styles.footer} />} // Adiciona um rodapé vazio
      />
      <BottomDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} height={0.3}>
        <View style={styles.drawerContent}>
          <Text style={styles.drawerHeader}>{selectedSong?.name}</Text>
          <TouchableOpacity style={styles.drawerOption} onPress={handleDeleteSong}>
            <Ionicons name="trash-outline" size={24} color="#ff4757" />
            <Text style={styles.drawerOptionText}>Eliminar Música</Text>
          </TouchableOpacity>
        </View>
      </BottomDrawer>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 20, // Reduzir o padding top aqui
    paddingBottom: 20,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    backgroundColor: 'rgba(45, 45, 45, 0.6)', // Neutral color
    borderRadius: 8,
    width: '100%', // Make the item take full width of its parent
    marginHorizontal: 0, // Remove horizontal margins
  },
  footer: {
    height: 180, // Altura do rodapé para garantir que o último item não fique cortado
  },
  songIndex: {
    width: 30,
    color: '#ffffff80',
    fontSize: 14,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  songArtist: {
    color: '#ffffff80',
    fontSize: 14,
    marginTop: 4,
  },
  songActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  duration: {
    color: '#ffffff80',
    fontSize: 14,
  },
  drawerContent: {
    padding: 20,
  },
  drawerHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
  },
  drawerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  drawerOptionText: {
    fontSize: 16,
    color: '#ff4757',
    marginLeft: 10,
  },
});

export default SongList;