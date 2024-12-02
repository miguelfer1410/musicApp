import { Context } from '@/context/Context';
import React, { useContext } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

export const Cover = () => {
  const { state } = useContext(Context);

  return (
    <View style={styles.container}>
      <Image source={{ uri: state.selectedSong.album.images[0].url }} style={styles.image} />
    </View>
  );
};

const { height } = Dimensions.get('window'); // Obtém a altura da tela

const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 350,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: height * 0.10, // Define o posicionamento
    alignSelf: 'center', // Centraliza horizontalmente
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
});
