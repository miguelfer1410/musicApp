import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Context } from '@/context/Context';
import useAudioPlayer from '@/hooks/useAudioPlayer';

const ControlButtons = () => {
  const [playPauseScale] = useState(new Animated.Value(1));
  const [activeButton, setActiveButton] = useState(null);
  const { state, dispatch } = useContext(Context);
  const { playPreview, stopPreview } = useAudioPlayer(); // Use the hook

  const createPressAnimation = (buttonName: any) => {
    return () => {
      setActiveButton(buttonName);
      Animated.sequence([
        Animated.timing(playPauseScale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(playPauseScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => setActiveButton(null));
    };
  };

  const handlePlayPause = async () => {
    if (state.isPlaying) {
      await stopPreview();
    } else if (state.selectedSong?.preview_url) {
      await playPreview(state.selectedSong.preview_url);
    }
  };
  
  
  

  const renderIconButton = (
    name: any,
    color = 'white',
    size = 32,
    onPress = () => {},
    isActive = false
  ) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        opacity: isActive ? 0.5 : 1,
        marginHorizontal: 15,
      }}
    >
      <Ionicons name={name} size={size} color={color} />
    </TouchableOpacity>
  );

  const renderPlayButton = () => (
    <Animated.View
      style={{
        transform: [{ scale: playPauseScale }],
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 50,
        backgroundColor: 'white',
        marginHorizontal: 20,
        width: 70,
        height: 70,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
      }}
    >
      <TouchableOpacity onPress={() => { createPressAnimation('play')(); handlePlayPause(); }}>
        <Ionicons name={state.isPlaying ? 'pause' : 'play'} size={35} color="black" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View
      style={{
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 10,
          borderRadius: 50,
          backgroundColor: '#333',
          paddingHorizontal: 10,
        }}
      >
        {renderIconButton('shuffle', activeButton === 'shuffle' ? '#4ECDC4' : 'white')}

        {renderIconButton(
          'play-back',
          activeButton === 'back' ? '#4ECDC4' : 'white',
          32,
          createPressAnimation('back')
        )}

        {renderPlayButton()}

        {renderIconButton(
          'play-forward',
          activeButton === 'forward' ? '#4ECDC4' : 'white',
          32,
          createPressAnimation('forward')
        )}

        {renderIconButton('repeat', activeButton === 'repeat' ? '#4ECDC4' : 'white')}
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          flex: 1,
          width: '92%',
          marginTop: 20,
        }}
      >
        {renderIconButton(
          'share-social-outline',
          activeButton === 'layers' ? '#4ECDC4' : 'white'
        )}

        {renderIconButton(
          'layers-outline',
          activeButton === 'layers' ? '#4ECDC4' : 'white'
        )}
      </View>
    </View>
  );
};

export default ControlButtons;
