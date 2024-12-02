import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppDrawerNavigator from './routes/route'; // Ajuste o caminho se necessário
import { Provider } from './context/Provider';
import { PlayerProvider } from './context/player/PlayerContext';


const App = () => {

  return (
    <PlayerProvider>
      <Provider>
        <NavigationContainer>
          <AppDrawerNavigator />
        </NavigationContainer>
      </Provider>
    </PlayerProvider>
  );
};

export default App;
