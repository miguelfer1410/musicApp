import React, { useContext, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Animated
} from 'react-native';
import { Context } from '@/context/Context';
import { Ionicons } from '@expo/vector-icons';
import BottomDrawer from './BottomDrawer';
import PlaylistSelectorModal from './PlaylistsSelectorModel';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faList, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/types';
import useAudioPlayer from '@/hooks/useAudioPlayer';
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const SearchResults = () => {
  const { state, dispatch } = useContext(Context);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = React.useState(false);
  const [isPlaylistModalVisible, setIsPlaylistModalVisible] = React.useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Create animated values for all items at once
  const animatedValues = useMemo(() => 
    state.results.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(50)
    })), [state.results.length]);  

  React.useEffect(() => {
    if (state.results.length > 0) {
      const animations = state.results.map((_:any , index:any) =>
        Animated.parallel([
          Animated.timing(animatedValues[index].opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValues[index].translateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );

      Animated.stagger(100, animations).start();
    }
  }, [state.results]);

  const handlePress = (item:any) => {
    navigation.navigate('Player');
    dispatch({ type: 'SET_SELECTED_SONG', payload: item });
  };

  const handleIconPress = useCallback((item:any) => {
    dispatch({
      type: 'SET_SELECTED_MUSIC_ICON',
      payload: item,
    });
    setIsBottomSheetOpen(true);
  }, [dispatch]);

  const handleOptionSelect = useCallback((option:any) => {
    if (option === 'AddPlaylist') {
      setIsPlaylistModalVisible(true);
    }
    setIsBottomSheetOpen(false);
  }, []);

  const renderItem = useCallback(({ item, index }:any) => {
    const animatedStyle = {
      opacity: animatedValues[index]?.opacity,
      transform: [{ translateY: animatedValues[index]?.translateY }],
    };

    // Verificação de segurança
    const albumImageUrl = item?.album?.images?.[0]?.url;

    return (
      <AnimatedTouchableOpacity
        onPress={() => handlePress(item)}
        style={[styles.resultItem, animatedStyle]}
      >
        <Image 
          source={albumImageUrl ? { uri: albumImageUrl } : undefined} 
          style={styles.thumbnail}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{item.name || 'Sem título'}</Text>
          <Text style={styles.year}>
            {item.artists?.map((artist:any) => artist.name).join(", ") || 'Artista desconhecido'}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => handleIconPress(item)}
          style={styles.iconContainer}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color="rgba(255, 255, 255, 0.6)"
          />
        </TouchableOpacity>
      </AnimatedTouchableOpacity>
    );
  }, [handlePress, handleIconPress, animatedValues]);

  if (state.isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{state.error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => dispatch({ type: 'CLEAR_ERROR' })}
        >
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {state.results.length > 0 ? (
        <FlatList
          data={state.results}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="musical-notes" size={48} color="rgba(255, 255, 255, 0.2)" />
          <Text style={styles.emptyStateText}>Reproduz o que mais gostas</Text>
          <Text style={styles.emptyStateSubText}>
            Procure por artistas, músicas e muito mais
          </Text>
        </View>
      )}

      <BottomDrawer
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        header={
          state.selectedMusicIcon && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {state.selectedMusicIcon.album?.images?.[0]?.url && (
                <Image
                  source={{ uri: state.selectedMusicIcon.album.images[0].url }}
                  style={{ width: 50, height: 50, borderRadius: 5, marginRight: 10 }}
                />
              )}
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                  {state.selectedMusicIcon.name || 'Sem título'}
                </Text>
                <Text style={{ fontSize: 14, color: 'grey' }}>
                  {state.selectedMusicIcon.artists?.map((artist:any) => artist.name).join(", ") || 'Artista desconhecido'}
                </Text>
              </View>
            </View>
          )
        }
      >
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
      </BottomDrawer>

      <PlaylistSelectorModal
        visible={isPlaylistModalVisible}
        onClose={() => setIsPlaylistModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  resultItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  genre: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 2,
  },
  year: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  iconContainer: {
    padding: 8,
    marginLeft: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 8,
  },
  errorText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SearchResults;