import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Context } from '../../context/Context';
import useMusicRecommendations from '@/hooks/useMusicRecommendations';

const genres = ['Hip-Hop', 'Rock', 'Pop', 'Jazz', 'Classical', 'Electronic', 'Soul'];

const GenreFilter = () => {
  const { state, dispatch } = useContext(Context);

  const onSelectGenre = (item: string) => {
    dispatch({
      type: "SET_SELECTED_GENRE",
      payload: item,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {genres.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => onSelectGenre(item)}
            style={[
              styles.button,
              state.selectedGenre === item && styles.selectedButton,
            ]}
          >
            <Text
              style={[
                styles.genre,
                state.selectedGenre === item && styles.selectedGenre,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  button: {
    marginHorizontal: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedButton: {
    backgroundColor: '#2e2e2e',
    borderColor: '#5f27cd',
    borderWidth: 2,
  },
  genre: {
    color: '#b3b3b3',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedGenre: {
    color: 'white',
    fontWeight: '600',
  },
});

export default GenreFilter;
