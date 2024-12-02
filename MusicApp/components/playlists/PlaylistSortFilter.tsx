import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Context } from '@/context/Context';
import BottomDrawer from '../search/BottomDrawer';

type SortOption = 'name' | 'artist' | 'dateAdded' ;

const PlaylistSortFilter = () => {
  const [showOptions, setShowOptions] = useState(false);
  const { state, dispatch } = useContext(Context);

  const sortOptions: { label: string; value: SortOption; icon: string }[] = [
    { label: 'Nome', value: 'name', icon: 'text' },
    { label: 'Artista', value: 'artist', icon: 'person' },
    { label: 'Data adicionada', value: 'dateAdded', icon: 'calendar' },
  ];

  const handleSelect = (option: SortOption) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: option });
    setShowOptions(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.mainButton}
        onPress={() => setShowOptions(true)}
      >
        <Ionicons name="funnel-outline" size={20} color="#fff" />
        <Text style={styles.mainButtonText}>
          Ordenar por: {sortOptions.find(opt => opt.value === state.sortOption)?.label || 'Nome'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#fff" />
      </TouchableOpacity>

      <BottomDrawer
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
        height={0.4}
        header={
          <Text style={styles.drawerTitle}>Ordenar por</Text>
        }
      >
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionItem,
              state.sortOption === option.value && styles.selectedOption
            ]}
            onPress={() => handleSelect(option.value)}
          >
            <Ionicons 
              name={option.icon as any} 
              size={24} 
              color={state.sortOption === option.value ? "#5f27cd" : "#fff"} 
            />
            <Text style={[
              styles.optionText,
              state.sortOption === option.value && styles.selectedOptionText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </BottomDrawer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(28, 28, 28, 0.95)',
    zIndex: 99,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: 'rgba(95, 39, 205, 0.1)',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 16,
  },
  selectedOptionText: {
    color: '#5f27cd',
    fontWeight: '600',
  },
});

export default PlaylistSortFilter;