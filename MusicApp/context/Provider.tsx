import React, { useReducer, ReactNode, useEffect } from 'react';
import { Context } from './Context';
import { Reducer, initialState } from './Reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  );
};