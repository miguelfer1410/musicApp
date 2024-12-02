import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Context } from '@/context/Context';
import { getArtistId, getArtistMonthlyListeners, getArtistPopularity } from '@/api/api';
import PopularityToolTip from './PopularityToolTip';
const FullBioComponent = () => {
  const { state } = useContext(Context);
  const [monthlyListeners, setMonthlyListeners] = useState<number | null>(null);
  const [popularity, setPopularity] = useState<number | null>(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      if (state.selectedSong?.artists?.[0]?.name && state.token) {
        try {
          const artistId = await getArtistId(state.selectedSong.artists[0].name, state.token);
          if (artistId) {
            const listeners = await getArtistMonthlyListeners(artistId, state.token);
            setMonthlyListeners(listeners);
            const artistPopularity = await getArtistPopularity(artistId, state.token);
            setPopularity(artistPopularity);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do artista:', error);
        }
      }
    };

    fetchArtistData();
  }, [state.selectedSong, state.token]);

  return (
    <ScrollView style={styles.container}>
      {state.artistImage && (
        <Image source={{ uri: state.artistImage }} style={styles.artistImage} resizeMode="cover" />
      )}

      {/* Título e número de ouvintes mensais */}
      {monthlyListeners !== null && popularity !== null && (
        <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', marginBottom:20}}>
          <View style={styles.listenersContainer}>
            <Text style={styles.listeners}>{monthlyListeners.toLocaleString()}</Text>
            <Text style={styles.monthlyText}>OUVINTES POR MÊS</Text>
          </View>
          <PopularityToolTip popularity={popularity} />
        </View>
      )}

      {/* Biografia */}
      <Text style={styles.bio}>
        {state.artistBio?.split(/<a href=.*$/)[0] || ''}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  artistImage: {
    width: 340,
    height: 340,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 10,
  },
  listenersContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  listeners: {
    fontSize: 40,
    color: 'white',
    left: 16,
    fontWeight: 'bold',
  },
  popularityContainer: {
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 50,
    width: 50,
    height: 50,
    backgroundColor: 'deepskyblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    right:17,
  },
  popularityText: {
    color: 'white',
    fontSize: 20,
  },
  monthlyText: {
    color: 'white',
    left: 16,
    marginBottom: 25,
  },
  bio: {
    fontSize: 16,
    color: 'white',
    textAlign: 'justify',
    paddingHorizontal: 16,
  },
});

export default FullBioComponent;
