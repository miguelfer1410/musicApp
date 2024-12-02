import { Context } from '@/context/Context';
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Obtém a largura da tela

const SongInfo = () => {
  const { state } = useContext(Context);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{state.selectedSong.name}</Text>
      <Text style={styles.artist}>
        {Array.isArray(state.selectedSong.artists)
          ? state.selectedSong.artists.map((artist: any) => artist.name).join(', ')
          : 'Unknown Artist'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    marginLeft: (width - 350) / 2, // Alinha com o início do Cover
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  artist: {
    fontSize: 18,
    color: 'gray',
  },
});

export default SongInfo;
