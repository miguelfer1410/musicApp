import React, { useState, useCallback, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { usePlayer } from '@/context/player/PlayerContext';
import BottomDrawer from '../search/BottomDrawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faList, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { Context } from '@/context/Context';

const { width } = Dimensions.get('window');

export const Header = ({ onMinimize }:any) => {
  const { minimizePlayer } = usePlayer();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isPlaylistModalVisible, setIsPlaylistModalVisible] = useState(false);
  const { state, dispatch } = useContext(Context);

  const handleMinimize = () => {
    minimizePlayer();
    onMinimize && onMinimize();
  };

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleOptionSelect = useCallback((option:any) => {
    if (option === 'AddPlaylist') {
      setIsPlaylistModalVisible(true);
    }
    setIsBottomSheetOpen(false);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleMinimize}>
          <Ionicons name="chevron-down" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleDrawer} style={styles.optionsButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <BottomDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        height={0.5}
        header={
          state.selectedSong && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {state.selectedSong.album?.images?.[0]?.url && (
                <Image
                  source={{ uri: state.selectedSong.album.images[0].url }}
                  style={{ width: 50, height: 50, borderRadius: 5, marginRight: 10 }}
                />
              )}
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                  {state.selectedSong.name || 'Sem título'}
                </Text>
                <Text style={{ fontSize: 14, color: 'grey' }}>
                  {state.selectedSong.artists?.map((artist:any) => artist.name).join(", ") || 'Artista desconhecido'}
                </Text>
              </View>
            </View>
          )
        }
      >
        <View>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
            onPress={() => handleOptionSelect('AddPlaylist')}
          >
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10, color: '#bcbcbc' }} size={20} />
            <Text style={{ fontSize: 20, color: '#bcbcbc', fontWeight: 'bold' }}>Adicionar a Playlist</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
            onPress={() => handleOptionSelect('AddQueue')}
          >
            <FontAwesomeIcon icon={faList} style={{ marginRight: 10, color: '#bcbcbc' }} size={20} />
            <Text style={{ fontSize: 20, color: '#bcbcbc', fontWeight: 'bold' }}>Adicionar à Fila</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
            onPress={() => handleOptionSelect('Share')}
          >
            <FontAwesomeIcon icon={faShareAlt} style={{ marginRight: 10, color: '#bcbcbc' }} size={20} />
            <Text style={{ fontSize: 20, color: '#bcbcbc', fontWeight: 'bold' }}>Partilhar</Text>
          </TouchableOpacity>
        </View>
      </BottomDrawer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 25,
    left: (width - 370) / 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 370,
    zIndex: 10,
  },
  optionsButton: {
    marginLeft: 20,
  },
});

export default Header;