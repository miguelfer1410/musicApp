import React, { useEffect, useState, useContext, useCallback } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Animated, 
  TouchableOpacity,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { Context } from '@/context/Context';
import { Feather } from '@expo/vector-icons';
import { getMusicSearchResult } from '@/api/api';
import debounce from 'lodash/debounce';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { state,dispatch } = useContext(Context);
  const [isFocused, setIsFocused] = useState(false);

  const animatedValue = React.useRef(new Animated.Value(0)).current;

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.length >= 2) {
        setIsLoading(true);
        try {
          const data = await getMusicSearchResult(term, state.token);
          dispatch({
            type: 'SET_SEARCH_RESULTS',
            payload: data,
          });
        } catch (error) {
          console.error('Search error:', error);
          dispatch({
            type: 'SET_SEARCH_ERROR',
            payload: 'Não foi possível realizar a busca. Tente novamente.',
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm]);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const handleClear = () => {
    setSearchTerm('');
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.searchBar,
          {
            transform: [
              {
                scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.02],
                }),
              },
            ],
          },
        ]}
      >
        <Feather name="search" size={20} color="rgba(255, 255, 255, 0.6)" />
        <TextInput
          style={styles.input}
          placeholder="O que queres ouvir?"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {isLoading ? (
          <ActivityIndicator size="small" color="rgba(255, 255, 255, 0.6)" />
        ) : searchTerm.length > 0 ? (
          <TouchableOpacity onPress={handleClear}>
            <Feather name="x" size={20} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
});

