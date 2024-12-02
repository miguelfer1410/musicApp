import React, { useContext } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import MusicRecommendations from './MusicRecommendation';
import { Context } from '../../context/Context';
import useMusicRecommendations from '@/hooks/useMusicRecommendations';

const MusicRecommendationsList = () => {
  const { state } = useContext(Context);
  const { loading } = useMusicRecommendations();

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5f27cd" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={state.recommendations}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MusicRecommendations item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default MusicRecommendationsList;
