import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { getArtistBio, getArtistImage } from '@/api/api';
import { Context } from '@/context/Context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/types';

const ArtistBio = () => {
  const [artist, setArtist] = useState<{ name: string; bio: string; imageUrl: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { state, dispatch } = useContext(Context);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchBio = async () => {
      try {
        setLoading(true);
        const artistName = state.selectedSong.artists[0].name;

        const bio = await getArtistBio(artistName);
        const imageUrl = await getArtistImage(artistName, state.token);

        setArtist({ name: artistName, bio, imageUrl });
        dispatch({ type: 'SET_ARTIST_BIO', payload: bio });
        dispatch({type:'SET_ARTIST_IMAGE',payload:imageUrl})
      } catch (err) {
        setError('Não foi possível carregar a biografia do artista.');
      } finally {
        setLoading(false);
      }
    };

    fetchBio();
  }, [state.selectedSong.artists[0].name]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!artist) {
    return null;
  }

  const previewBio = artist.bio.split(' ').slice(0, 50).join(' ');

  return (
    <View style={styles.container}>
      {artist.imageUrl && (
        <Image source={{ uri: artist.imageUrl }} style={styles.artistImage} resizeMode="cover" />
      )}
      <Text style={styles.overlayText}>Perfil do Artista</Text>
      <Text style={styles.title}>{artist.name}</Text>
      <Text style={styles.bio}>
        {previewBio}{' '}
        <Text style={styles.seeMore} onPress={() => navigation.navigate('FullBio')}>
          Ver mais
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    top: 20,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 8,
    alignSelf: 'center',
    width: 320,
  },
  bio: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'justify',
    marginBottom: 30,
    alignSelf: 'center',
    width: 320,
  },
  artistImage: {
    width: '100%',
    height: 300,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    marginBottom: 20,
    padding:20
  },
  overlayText: {
    position: 'absolute',
    top: 60,
    left: 60,
    transform: [{ translateX: -50 }, { translateY: -50 }],
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  seeMore: {
    fontSize: 16,
    color: '#1DB954',
    textDecorationLine: 'underline',
  },
});

export default ArtistBio;
