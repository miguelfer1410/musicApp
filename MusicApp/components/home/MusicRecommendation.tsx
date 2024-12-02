// MusicRecommendations.tsx
import React, { useContext , useState} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useAudioPlayer from '@/hooks/useAudioPlayer'; // Import the hook
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/types';
import { Context } from '@/context/Context';
import Alert from '../helpers/Alert';

interface MusicRecommendationsProps {
  item: any; // Define your item type or use the MusicRecommendation type
}

const MusicRecommendations: React.FC<MusicRecommendationsProps> = ({ item }) => {
  const { name, artists, uri, preview_url, album } = item;
  const { playPreview, stopPreview } = useAudioPlayer(); // Use the hook
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {state, dispatch} = useContext(Context);
  const artistNames = artists.map((artist:any) => artist.name).join(", ");
  const coverImage = album.images && album.images.length > 0 ? album.images[0].url : null;


  const handlePlay = async (item: any) => {
    console.log(item);
  
    if (item.preview_url) {
      dispatch({type:'SET_HAS_PREVIEW',payload:true});

      // Para qualquer música já em reprodução
      await stopPreview();
  
      // Atualiza o estado global com a música selecionada
      dispatch({ type: 'SET_SELECTED_SONG', payload: item });
  
      // Define como "tocando"
      console.log("Music: " + state.isPlaying)
  
      // Navega para a tela do Player
      navigation.navigate('Player');
    } else {
      dispatch({type:'SET_HAS_PREVIEW',payload:false});
    }
  };
  

  return (
    <>
    <TouchableOpacity activeOpacity={0.7} onPress={() => handlePlay(item)}>
      <LinearGradient
        colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
        style={styles.card}
      >
        {coverImage && <Image source={{ uri: coverImage }} style={styles.image} />}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {artistNames}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
    
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 12,
    margin: 6,
    width: (Dimensions.get('window').width - 48) / 2,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    height: 250,
  },
  image: {
    width: (Dimensions.get('window').width - 48) / 2 - 24,
    height: (Dimensions.get('window').width - 48) / 2 - 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  artist: {
    fontSize: 12,
    color: '#b3b3b3',
  },
  duration: {
    fontSize: 12,
    color: '#b3b3b3',
  },
});

export default MusicRecommendations;
